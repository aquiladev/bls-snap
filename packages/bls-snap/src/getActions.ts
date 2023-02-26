import { ApiParams, GetActionsRequestParams } from './types/snapApi';
import { Action } from './types/snapState';
import * as snapUtils from './utils/snapUtils';

/**
 * Gets actions from the specific network.
 *
 * @param params - The request handler args as object.
 * @param params.requestParams.chainId - Id of the supported network.
 * @param params.requestParams.senderAddress - Address of the sender.
 * @returns The actions.
 */
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
