/* eslint-disable jsdoc/require-jsdoc */
import { v4 as uuidv4 } from 'uuid';
import { ApiParams, AddOperationRequestParams } from './types/snapApi';
import { upsertOperation } from './utils/snapUtils';

export async function addOperation(params: ApiParams) {
  try {
    const { state, mutex, requestParams, wallet } = params;
    const { senderAddress, contractAddress, encodedFunction, chainId } =
      requestParams as AddOperationRequestParams;

    const operation = {
      id: uuidv4(),
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
