/* eslint-disable jsdoc/require-jsdoc */
import { v4 as uuidv4 } from 'uuid';
import { ApiParams, AddActionRequestParams } from './types/snapApi';
import { Action } from './types/snapState';
import { insertAction } from './utils/snapUtils';

export async function addAction(params: ApiParams): Promise<Action> {
  try {
    const { state, mutex, requestParams, wallet } = params;
    const {
      chainId,
      value,
      senderAddress,
      contractAddress,
      encodedFunction,
      functionFragment,
    } = requestParams as AddActionRequestParams;

    const _value: number = value || 0;
    if (_value < 0) {
      throw new Error(`Value must be greater or equal 0`);
    }

    const action: Action = {
      id: uuidv4(),
      value: _value,
      senderAddress,
      contractAddress,
      encodedFunction,
      functionFragment: functionFragment || '',
    };
    await insertAction(action, chainId, wallet, mutex, state);

    console.log(`addAction:\naction: ${JSON.stringify(action)}`);
    return action;
  } catch (err) {
    console.error(`Problem found: ${err}`);
    throw err;
  }
}
