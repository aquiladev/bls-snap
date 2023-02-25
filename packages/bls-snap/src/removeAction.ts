/* eslint-disable jsdoc/require-jsdoc */
import { ApiParams, RemoveActionRequestParams } from './types/snapApi';
import { Action } from './types/snapState';
import * as snapUtils from './utils/snapUtils';

export async function removeAction(params: ApiParams): Promise<Action> {
  try {
    const { state, mutex, requestParams, snap } = params;
    const { chainId, id } = requestParams as RemoveActionRequestParams;

    const action = snapUtils.getActionById(id, chainId, state);
    if (!action) {
      throw new Error(`Action not found: ${JSON.stringify(requestParams)}`);
    }

    await snapUtils.removeActions([action], chainId, snap, mutex, state);

    console.log(`removeAction:\naction: ${JSON.stringify(action)}`);
    return action;
  } catch (err) {
    console.error(`Problem found: ${err}`);
    throw err;
  }
}
