/* eslint-disable jsdoc/require-jsdoc */
import { ethers } from 'ethers';
import {
  Aggregator,
  BlsWalletWrapper,
  validateConfig,
} from 'bls-wallet-clients';
import { ApiParams } from './types/snapApi';
import { ARBITRUM_GOERLI_NETWORK } from './utils/constants';
import * as snapUtils from './utils/snapUtils';
import { Transaction } from './types/snapState';

export async function sendBundle(params: ApiParams) {
  try {
    const { state, mutex } = params;
    const ops = snapUtils.getOperations(state);
    console.log('OPS', ops);

    const netCfg = validateConfig(ARBITRUM_GOERLI_NETWORK.config);

    const provider = new ethers.providers.JsonRpcProvider(
      ARBITRUM_GOERLI_NETWORK.rpcUrl,
      { name: '', chainId: ARBITRUM_GOERLI_NETWORK.chainId },
    );

    // 32 random bytes
    const privateKey =
      '0x0001020304050607080910111213141516171819202122232425262728293031';

    // Note that if a wallet doesn't yet exist, it will be
    // lazily created on the first transaction.
    const account = await BlsWalletWrapper.connect(
      privateKey,
      netCfg.addresses.verificationGateway,
      provider,
    );

    const nonce = await account.Nonce();
    // All of the actions in a bundle are atomic, if one
    // action fails they will all fail.
    const bundle = account.sign({
      nonce,
      actions: ops,
    });

    const aggregator = new Aggregator(ARBITRUM_GOERLI_NETWORK.aggregator);
    const addResult = await aggregator.add(bundle);

    if ('failures' in addResult) {
      throw new Error(addResult.failures.join('\n'));
    }

    console.log('Bundle hash:', addResult.hash);

    await snapUtils.upsertTransaction(
      {
        txHash: addResult.hash,
        chainId: ARBITRUM_GOERLI_NETWORK.chainId,
      } as Transaction,
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
