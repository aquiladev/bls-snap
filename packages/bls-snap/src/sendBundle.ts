import { BigNumber, ethers, utils } from 'ethers';
import { ApiParams, SendBundleRequestParams } from './types/snapApi';
import * as config from './utils/config';
import * as snapUtils from './utils/snapUtils';
import { Bundle } from './types/snapState';
import { getAggregator, getWallet } from './utils/blsUtils';

/**
 * Sends bundle to the specific network.
 *
 * @param params - The request handler args as object.
 * @param params.requestParams.chainId - Id of the supported network.
 * @param params.requestParams.senderAddress - Address of the sender.
 * @param params.requestParams.actionIds - Ids of the actions.
 * @returns The bundle.
 */
export async function sendBundle(params: ApiParams): Promise<Bundle> {
  try {
    const { state, mutex, snap, requestParams } = params;
    const { senderAddress, actionIds, chainId } =
      requestParams as SendBundleRequestParams;

    if (!ethers.utils.isAddress(senderAddress)) {
      throw new Error(`The given sender address is invalid: ${senderAddress}`);
    }

    const network = config.getNetwork(chainId);
    if (!network) {
      throw new Error(`The network is not supported: ${chainId}`);
    }

    if (!actionIds.length) {
      throw new Error(`No actions provided: ${JSON.stringify(requestParams)}`);
    }

    const account = snapUtils.getAccount(senderAddress, chainId, state);
    if (!account) {
      throw new Error(
        `Account not found: ${senderAddress} chainId: ${chainId}`,
      );
    }

    const actions = snapUtils
      .getActions(senderAddress, chainId, state)
      .filter((a) => actionIds.includes(a.id));
    if (!actions?.length) {
      throw new Error(`No actions found: ${senderAddress} chainId: ${chainId}`);
    }

    if (actionIds.length !== actions.length) {
      const foundIds = actions.map((a) => a.id);
      throw new Error(
        `Some actions were not found: ${actionIds.filter(
          (a) => !foundIds.includes(a),
        )}`,
      );
    }

    // Note that if a wallet doesn't yet exist, it will be
    // lazily created on the first transaction.
    const wallet = await getWallet(network, account.privateKey);
    const nonce = await wallet.Nonce();

    const iface = new utils.Interface(['function sendEthToTxOrigin()']);
    const feeAction = {
      ethValue: 1,
      // Provide 1 wei with this action so that the fee transfer to
      // tx.origin can be included in the gas estimate.
      contractAddress: network.config.addresses.utilities,
      encodedFunction: iface.encodeFunctionData('sendEthToTxOrigin'),
    };

    const _actions = actions.map((op) => {
      return {
        ethValue: op.value,
        contractAddress: op.contractAddress,
        encodedFunction: op.encodedFunction,
      };
    });

    const aggregator = getAggregator(network);

    // Estimate the fee required to send the bundle
    const estimateFeeBundle = await wallet.signWithGasEstimate({
      nonce,
      actions: [..._actions, feeAction],
    });
    const feeEstimate = await aggregator.estimateFee(estimateFeeBundle);

    // Add a safety premium to the fee to account for fluctuations in gas estimation
    const safetyDivisor = 5;
    const feeRequired = BigNumber.from(feeEstimate.feeRequired);
    const safetyPremium = feeRequired.div(safetyDivisor);
    const safeFee = feeRequired.add(safetyPremium);

    // All of the actions in a bundle are atomic, if one
    // action fails they will all fail.
    const _bundle = await wallet.signWithGasEstimate({
      nonce,
      actions: [
        ..._actions,
        {
          ...feeAction,
          ethValue: safeFee, // fee amount
        },
      ],
    });
    const result = await aggregator.add(_bundle);

    if ('failures' in result) {
      throw new Error(result.failures.join('\n'));
    }

    const bundle: Bundle = {
      senderAddress,
      bundleHash: result.hash,
      nonce: nonce.toNumber(),
      actions,
    };
    await snapUtils.upsertBundle(bundle, chainId, snap, mutex, state);
    await snapUtils.removeActions(actions, chainId, snap, mutex, state);

    console.log(`sendBundle:\nbundle: ${JSON.stringify(bundle)}`);
    return bundle;
  } catch (err) {
    console.error(`Problem found: ${err}`);
    throw err;
  }
}
