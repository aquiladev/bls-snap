/* eslint-disable jsdoc/require-jsdoc */
import { ApiParams, AddOperationRequestParams } from './types/snapApi';
import { upsertOperation } from './utils/snapUtils';

export async function addOperation(params: ApiParams) {
  try {
    const { state, mutex, requestParams, wallet } = params;
    const { senderAddress, contractAddress, encodedFunction, chainId } =
      requestParams as AddOperationRequestParams;

    const operation = {
      value: 0,
      senderAddress,
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
