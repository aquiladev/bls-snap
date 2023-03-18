import { ApiParams, CreateAccountRequestParams } from './types/snapApi';
import * as config from './utils/config';
import {
  getKeysFromAddressIndex,
  getValidNumber,
  upsertAccount,
} from './utils/snapUtils';
import { Account, BlsAccount } from './types/snapState';
import { getWallet } from './utils/blsUtils';

/**
 * Creates new account for specific network.
 * Snap uses seedprase from MetaMask through its API `snap_getBip44Entropy` in order to generate accounts.
 * It allows to re-create the same accounts after snap re-installation.
 *
 * @param params - The request handler args as object.
 * @param params.requestParams.chainId - Id of the supported network.
 * @param params.requestParams.addressIndex - Specific address index of the derived key in BIP-44. Optional, default is 0.
 * @returns The new account.
 */
export async function createAccount(params: ApiParams): Promise<Account> {
  try {
    const { state, mutex, snap, requestParams, keyDeriver } = params;
    const { chainId, addressIndex } =
      requestParams as CreateAccountRequestParams;

    const network = config.getNetwork(chainId);
    if (!network) {
      throw new Error(`The network is not supported: ${chainId}`);
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
      name: `Account ${aIndex + 1}`,
    };
    await upsertAccount(account, chainId, snap, mutex, state);

    return {
      address: account.address,
      name: account.name,
    };
  } catch (err) {
    console.error(`Problem found: ${err}`);
    throw err;
  }
}
