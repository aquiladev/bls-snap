/* eslint-disable jsdoc/require-jsdoc */
import { ApiParams, GetOperationsRequestParams } from './types/snapApi';
import * as snapUtils from './utils/snapUtils';

export async function getOperations(params: ApiParams) {
  try {
    const { state, requestParams } = params;
    const { chainId } = requestParams as GetOperationsRequestParams;

    const operations = snapUtils.getOperations(chainId, state);
    console.log(`getOperations:\n${JSON.stringify(operations, null, 2)}`);

    return operations || [];
  } catch (err) {
    console.error(`Problem found: ${err}`);
    throw err;
  }
}
