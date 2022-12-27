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

    const account = snapUtils.getAccount(state, senderAddress, chainId);
    console.log('ACCOUNT', account);
    if (!account) {
      throw new Error(`Account not found: ${senderAddress}`);
    }

    const operations = snapUtils.getOperations(state);
    console.log('OPERATIONS', operations);

    const netCfg = validateConfig(ARBITRUM_GOERLI_NETWORK.config);

    const provider = new ethers.providers.JsonRpcProvider(
      ARBITRUM_GOERLI_NETWORK.rpcUrl,
      { name: '', chainId: ARBITRUM_GOERLI_NETWORK.chainId },
    );

    // Note that if a wallet doesn't yet exist, it will be
    // lazily created on the first transaction.
    const _account = await BlsWalletWrapper.connect(
      account.privateKey,
      netCfg.addresses.verificationGateway,
      provider,
    );

    const nonce = await _account.Nonce();
    // All of the actions in a bundle are atomic, if one
    // action fails they will all fail.
    const bundle = _account.sign({
      nonce,
      actions: operations,
    });

    const aggregator = new Aggregator(ARBITRUM_GOERLI_NETWORK.aggregator);
    const addResult = await aggregator.add(bundle);

    if ('failures' in addResult) {
      throw new Error(addResult.failures.join('\n'));
    }

    console.log('Bundle hash:', addResult.hash);

    await snapUtils.upsertBundle(
      {
        bundleHash: addResult.hash,
        chainId: ARBITRUM_GOERLI_NETWORK.chainId,
      } as Bundle,
      wallet,
      mutex,
      state,
    );
    await snapUtils.cleanOperations(wallet, mutex, state);
    return addResult;
  } catch (err) {
    console.error(`Problem found: ${err}`);
    throw err;
  }
}
