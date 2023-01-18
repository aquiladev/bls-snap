/* eslint-disable jsdoc/require-jsdoc */
import { ApiParams, CreateAccountRequestParams } from './types/snapApi';
import * as constants from './utils/constants';
import {
  getKeysFromAddressIndex,
  getValidNumber,
  upsertAccount,
} from './utils/snapUtils';
import { BlsAccount } from './types/snapState';
import { getWallet } from './utils/blsUtils';

export async function createAccount(params: ApiParams) {
  try {
    const { state, mutex, wallet, requestParams, keyDeriver } = params;
    const { chainId, addressIndex } =
      requestParams as CreateAccountRequestParams;

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
    const _wallet = await getWallet(
      constants.ARBITRUM_GOERLI_NETWORK,
      privateKey,
    );

    const account: BlsAccount = {
      address: _wallet.address,
      publicKey: _wallet.PublicKeyStr(),
      privateKey: _wallet.privateKey,
      derivationPath,
      addressIndex: aIndex,
    };
    await upsertAccount(account, chainId, wallet, mutex, state);

    return {
      address: _wallet.address,
    };
  } catch (err) {
    console.error(`Problem found: ${err}`);
    throw err;
  }
}
