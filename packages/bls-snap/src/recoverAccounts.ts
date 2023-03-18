import { ApiParams, RecoverAccountsRequestParams } from './types/snapApi';
import { Account } from './types/snapState';
import { getAccounts } from './utils/snapUtils';

/**
 * Returns list of accounts for specific network.
 *
 * @param params - The request handler args as object.
 * @param params.requestParams.chainId - Id of the supported network.
 * @returns The list of accounts.
 */
export async function recoverAccounts(
  params: ApiParams,
): Promise<Account[] | undefined> {
  try {
    const { state, requestParams } = params;
    const { chainId } = requestParams as RecoverAccountsRequestParams;

    const accounts = await getAccounts(chainId, state);
    if (accounts?.length) {
      return accounts.map((a) => {
        return { address: a.address, name: a.name };
      });
    }

    return undefined;
  } catch (err) {
    console.error(`Problem found: ${err}`);
    throw err;
  }
}
