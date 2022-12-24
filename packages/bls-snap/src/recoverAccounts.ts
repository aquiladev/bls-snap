/* eslint-disable jsdoc/require-jsdoc */
import { ApiParams, RecoverAccountRequestParams } from './types/snapApi';
import { getAccounts } from './utils/snapUtils';

export async function recoverAccounts(params: ApiParams) {
  try {
    const { state, requestParams } = params;
    const { chainId } = requestParams as RecoverAccountRequestParams;

    const accounts = await getAccounts(state, chainId);
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
