/* eslint-disable jsdoc/require-jsdoc */
import { ApiParams, AddOperationRequestParams } from './types/snapApi';
import { upsertOperation } from './utils/snapUtils';

export async function addOperation(params: ApiParams) {
  try {
    const { state, mutex, requestParams, wallet } = params;
    const { contractAddress, encodedFunction, chainId } =
      requestParams as AddOperationRequestParams;

    const operation = {
      ethValue: 0,
      contractAddress,
      encodedFunction,
    };
    await upsertOperation(operation, chainId, wallet, mutex, state);
    return operation;
  } catch (err) {
    console.error(`Problem found: ${err}`);
    throw err;
  }
}
