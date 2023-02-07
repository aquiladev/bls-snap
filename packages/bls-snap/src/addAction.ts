/* eslint-disable jsdoc/require-jsdoc */
import { v4 as uuidv4 } from 'uuid';
import { ApiParams, AddActionRequestParams } from './types/snapApi';
import { insertAction } from './utils/snapUtils';

export async function addAction(params: ApiParams) {
  try {
    const { state, mutex, requestParams, wallet } = params;
    const { senderAddress, contractAddress, encodedFunction, chainId } =
      requestParams as AddActionRequestParams;

    const action = {
      id: uuidv4(),
      value: 0,
      senderAddress,
      contractAddress,
      encodedFunction,
    };
    console.log('Action:', action);

    await insertAction(action, chainId, wallet, mutex, state);
    return action;
  } catch (err) {
    console.error(`Problem found: ${err}`);
    throw err;
  }
}
