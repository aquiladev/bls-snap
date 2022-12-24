/* eslint-disable jsdoc/require-jsdoc */
import { ethers } from 'ethers';
import { BlsWalletWrapper, validateConfig } from 'bls-wallet-clients';

import { ApiParams } from './types/snapApi';
import { ARBITRUM_GOERLI_NETWORK } from './utils/constants';
import { upsertAccount } from './utils/snapUtils';

export async function createAccount(params: ApiParams) {
  try {
    const { state, mutex, wallet } = params;
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

    await upsertAccount(
      {
        chainId: ARBITRUM_GOERLI_NETWORK.chainId,
        address: account.address,
        privateKey,
      },
      wallet,
      mutex,
      state,
    );

    return {
      address: account.address,
    };
  } catch (err) {
    console.error(`Problem found: ${err}`);
    throw err;
  }
}
