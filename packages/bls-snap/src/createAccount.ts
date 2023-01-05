/* eslint-disable jsdoc/require-jsdoc */
import { ethers } from 'ethers';
import { BlsWalletWrapper } from 'bls-wallet-clients';

import { ApiParams, CreateAccountRequestParams } from './types/snapApi';
import { ARBITRUM_GOERLI_NETWORK } from './utils/constants';
import { upsertAccount } from './utils/snapUtils';
import { randomPrivateKey } from './utils/crypto';

export async function createAccount(params: ApiParams) {
  try {
    const { state, mutex, wallet, requestParams } = params;
    const { chainId } = requestParams as CreateAccountRequestParams;
    const netConfig = ARBITRUM_GOERLI_NETWORK.config;
    if (chainId !== ARBITRUM_GOERLI_NETWORK.chainId) {
      throw new Error(`ChainId not supported: ${chainId}`);
    }

    const privateKey = randomPrivateKey();

    // Note that if a wallet doesn't yet exist, it will be
    // lazily created on the first transaction.
    const account = await BlsWalletWrapper.connect(
      privateKey,
      netConfig.addresses.verificationGateway,
      new ethers.providers.JsonRpcProvider(ARBITRUM_GOERLI_NETWORK.rpcUrl, {
        name: '',
        chainId,
      }),
    );

    const _acc = {
      address: account.address,
      privateKey,
    };
    await upsertAccount(_acc, chainId, wallet, mutex, state);

    return {
      address: account.address,
    };
  } catch (err) {
    console.error(`Problem found: ${err}`);
    throw err;
  }
}
