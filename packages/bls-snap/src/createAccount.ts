/* eslint-disable jsdoc/require-jsdoc */
import { ApiParams, CreateAccountRequestParams } from './types/snapApi';
import * as config from './utils/config';
import {
  getKeysFromAddressIndex,
  getValidNumber,
  upsertAccount,
} from './utils/snapUtils';
import { Account, BlsAccount } from './types/snapState';
import { getWallet } from './utils/blsUtils';

export async function createAccount(params: ApiParams): Promise<Account> {
  try {
    const { state, mutex, snap, requestParams, keyDeriver } = params;
    const { chainId, addressIndex } =
      requestParams as CreateAccountRequestParams;

    const network = config.getNetwork(chainId);
    if (!network) {
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
    const wallet = await getWallet(network, privateKey);

    const account: BlsAccount = {
      address: wallet.address,
      publicKey: wallet.PublicKeyStr(),
      privateKey: wallet.privateKey,
      derivationPath,
      addressIndex: aIndex,
    };
    await upsertAccount(account, chainId, snap, mutex, state);

    return {
      address: wallet.address,
    };
  } catch (err) {
    console.error(`Problem found: ${err}`);
    throw err;
  }
}
