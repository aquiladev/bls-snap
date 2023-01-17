/* eslint-disable jsdoc/require-jsdoc */
import { BlsWalletWrapper } from 'bls-wallet-clients';

import { ApiParams, CreateAccountRequestParams } from './types/snapApi';
import * as constants from './utils/constants';
import {
  getKeysFromAddressIndex,
  getValidNumber,
  upsertAccount,
} from './utils/snapUtils';
import { BlsAccount } from './types/snapState';
import { getProvider } from './utils/evmUtils';

export async function createAccount(params: ApiParams) {
  try {
    const { state, mutex, wallet, requestParams, keyDeriver } = params;
    const { chainId, addressIndex } =
      requestParams as CreateAccountRequestParams;
    const netConfig = constants.ARBITRUM_GOERLI_NETWORK.config;
    if (chainId !== constants.ARBITRUM_GOERLI_NETWORK.chainId) {
      throw new Error(`ChainId not supported: ${chainId}`);
    }

    const {
      privateKey,
      derivationPath,
      addressIndex: aIndex,
    } = await getKeysFromAddressIndex(
      keyDeriver,
      chainId,
      state,
      getValidNumber(addressIndex, -1, 0),
    );

    // Note that if a wallet doesn't yet exist, it will be
    // lazily created on the first transaction.
    const account: BlsWalletWrapper = await BlsWalletWrapper.connect(
      privateKey,
      netConfig.addresses.verificationGateway,
      getProvider(constants.ARBITRUM_GOERLI_NETWORK),
    );

    const _acc: BlsAccount = {
      address: account.address,
      publicKey: account.PublicKeyStr(),
      privateKey: account.privateKey,
      derivationPath,
      addressIndex: aIndex,
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
