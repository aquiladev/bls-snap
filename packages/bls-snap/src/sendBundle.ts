/* eslint-disable jsdoc/require-jsdoc */
import { ethers } from 'ethers';
import {
  Aggregator,
  BlsWalletWrapper,
  validateConfig,
} from 'bls-wallet-clients';
import { ApiParams, SendBundleRequestParams } from './types/snapApi';
import { ARBITRUM_GOERLI_NETWORK } from './utils/constants';
import * as snapUtils from './utils/snapUtils';
import { Bundle } from './types/snapState';

export async function sendBundle(params: ApiParams) {
  try {
    const { state, mutex, wallet, requestParams } = params;
    const { senderAddress, chainId } = requestParams as SendBundleRequestParams;

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

    const netConfig = validateConfig(ARBITRUM_GOERLI_NETWORK.config);
    if (chainId !== ARBITRUM_GOERLI_NETWORK.chainId) {
      throw new Error(`ChainId not supported: ${chainId}`);
    }

    // Note that if a wallet doesn't yet exist, it will be
    // lazily created on the first transaction.
    const _account = await BlsWalletWrapper.connect(
      account.privateKey,
      netConfig.addresses.verificationGateway,
      new ethers.providers.JsonRpcProvider(ARBITRUM_GOERLI_NETWORK.rpcUrl, {
        name: '',
        chainId,
      }),
    );

    const nonce = await _account.Nonce();
    // All of the actions in a bundle are atomic, if one
    // action fails they will all fail.
    const bundle = _account.sign({
      nonce,
      actions: operations.map((op) => {
        return {
          ethValue: op.value,
          contractAddress: op.contractAddress,
          encodedFunction: op.encodedFunction,
        };
      }),
    });

    const aggregator = new Aggregator(ARBITRUM_GOERLI_NETWORK.aggregator);
    const addResult = await aggregator.add(bundle);

    if ('failures' in addResult) {
      throw new Error(addResult.failures.join('\n'));
    }

    console.log('Bundle hash:', addResult.hash);
    await snapUtils.upsertBundle(
      {
        senderAddress,
        bundleHash: addResult.hash,
        operations,
      } as Bundle,
      chainId,
      wallet,
      mutex,
      state,
    );
    await snapUtils.removeOperations(operations, chainId, wallet, mutex, state);
    return addResult;
  } catch (err) {
    console.error(`Problem found: ${err}`);
    throw err;
  }
}
