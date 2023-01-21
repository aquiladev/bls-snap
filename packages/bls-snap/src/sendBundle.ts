/* eslint-disable jsdoc/require-jsdoc */
import { ApiParams, SendBundleRequestParams } from './types/snapApi';
import * as config from './utils/config';
import * as snapUtils from './utils/snapUtils';
import { Bundle } from './types/snapState';
import { getAggregator, getWallet } from './utils/blsUtils';

export async function sendBundle(params: ApiParams) {
  try {
    const { state, mutex, wallet, requestParams } = params;
    const { senderAddress, chainId } = requestParams as SendBundleRequestParams;

    const network = config.getNetwork(chainId);
    if (!network) {
      throw new Error(`ChainId not supported: ${chainId}`);
    }

    const account = snapUtils.getAccount(senderAddress, chainId, state);
    if (!account) {
      throw new Error(
        `Account not found: ${senderAddress} chainId: ${chainId}`,
      );
    }

    const operations = snapUtils.getOperations(senderAddress, chainId, state);
    if (!operations?.length) {
      throw new Error(
        `No operations found: ${senderAddress} chainId: ${chainId}`,
      );
    }

    // Note that if a wallet doesn't yet exist, it will be
    // lazily created on the first transaction.
    const _wallet = await getWallet(network, account.privateKey);

    // All of the actions in a bundle are atomic, if one
    // action fails they will all fail.
    const _bundle = _wallet.sign({
      nonce: await _wallet.Nonce(),
      actions: operations.map((op) => {
        return {
          ethValue: op.value,
          contractAddress: op.contractAddress,
          encodedFunction: op.encodedFunction,
        };
      }),
    });

    const aggregator = getAggregator(network);
    const addResult = await aggregator.add(_bundle);

    if ('failures' in addResult) {
      throw new Error(addResult.failures.join('\n'));
    }

    const bundle: Bundle = {
      senderAddress,
      bundleHash: addResult.hash,
      operations,
    };
    console.log('Bundle:', bundle);

    await snapUtils.upsertBundle(bundle, chainId, wallet, mutex, state);
    await snapUtils.removeOperations(operations, chainId, wallet, mutex, state);
    return bundle;
  } catch (err) {
    console.error(`Problem found: ${err}`);
    throw err;
  }
}
