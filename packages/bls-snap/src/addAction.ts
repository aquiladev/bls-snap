/* eslint-disable jsdoc/require-jsdoc */
import { v4 as uuidv4 } from 'uuid';
import { ApiParams, AddActionRequestParams } from './types/snapApi';
import { Action } from './types/snapState';
import { insertAction } from './utils/snapUtils';

export async function addAction(params: ApiParams): Promise<Action> {
  try {
    const { state, mutex, requestParams, wallet } = params;
    const { senderAddress, contractAddress, encodedFunction, chainId } =
      requestParams as AddActionRequestParams;

    const action: Action = {
      id: uuidv4(),
      value: 0,
      senderAddress,
      contractAddress,
      encodedFunction,
    };
    await insertAction(action, chainId, wallet, mutex, state);

    console.log(`addAction:\naction: ${JSON.stringify(action)}`);
    return action;
  } catch (err) {
    console.error(`Problem found: ${err}`);
    throw err;
  }
}
