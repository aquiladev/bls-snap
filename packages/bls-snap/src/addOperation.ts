/* eslint-disable jsdoc/require-jsdoc */
import { ApiParams, AddOperationRequestParams } from './types/snapApi';
import { upsertOperation } from './utils/snapUtils';

export async function addOperation(params: ApiParams) {
  try {
    const { state, mutex, requestParams, wallet } = params;
    const { contractAddress, encodedFunction } =
      requestParams as AddOperationRequestParams;

    const op = {
      ethValue: 0,
      contractAddress,
      encodedFunction,
    };
    await upsertOperation(op, wallet, mutex, state);
    return op;
  } catch (err) {
    console.error(`Problem found: ${err}`);
    throw err;
  }
}
