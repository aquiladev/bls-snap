/* eslint-disable jsdoc/require-jsdoc */
import { ApiParams, GetActionsRequestParams } from './types/snapApi';
import { Action } from './types/snapState';
import * as snapUtils from './utils/snapUtils';

export async function getActions(params: ApiParams): Promise<Action[]> {
  try {
    const { state, requestParams } = params;
    const { senderAddress, chainId } = requestParams as GetActionsRequestParams;

    const actions = snapUtils.getActions(senderAddress, chainId, state);
    console.log(`getActions:\n${JSON.stringify(actions, null, 2)}`);

    return actions || [];
  } catch (err) {
    console.error(`Problem found: ${err}`);
    throw err;
  }
}
