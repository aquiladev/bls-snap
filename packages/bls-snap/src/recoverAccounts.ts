/* eslint-disable jsdoc/require-jsdoc */
import { ApiParams, RecoverAccountsRequestParams } from './types/snapApi';
import { Account } from './types/snapState';
import { getAccounts } from './utils/snapUtils';

export async function recoverAccounts(
  params: ApiParams,
): Promise<Account[] | undefined> {
  try {
    const { state, requestParams } = params;
    const { chainId } = requestParams as RecoverAccountsRequestParams;

    const accounts = await getAccounts(chainId, state);
    if (accounts?.length) {
      return accounts.map((a) => {
        return { address: a.address };
      });
    }

    return undefined;
  } catch (err) {
    console.error(`Problem found: ${err}`);
    throw err;
  }
}
