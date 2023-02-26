import { ethers } from 'ethers';
import { v4 as uuidv4 } from 'uuid';
import { ApiParams, AddActionRequestParams } from './types/snapApi';
import { Action } from './types/snapState';
import { getValidNumber, insertAction } from './utils/snapUtils';

/**
 * Adds action to specific network.
 *
 * @param params - The request handler args as object.
 * @param params.requestParams.chainId - Id of the supported network.
 * @param params.requestParams.senderAddress - Address of the sender.
 * @param params.requestParams.contractAddress - Address of the contract.
 * @param params.requestParams.encodedFunction - Encoded function.
 * @param params.requestParams.value - Value in Wei. Optional, default value is 0.
 * @param params.requestParams.functionFragment - Function fragment (eg. `function transfer(address,uint256)`). Optional, default value is empty string.
 * @returns The added action.
 */
export async function addAction(params: ApiParams): Promise<Action> {
  try {
    const { state, mutex, requestParams, snap } = params;
    const {
      chainId,
      value,
      senderAddress,
      contractAddress,
      encodedFunction,
      functionFragment,
    } = requestParams as AddActionRequestParams;

    if (!ethers.utils.isAddress(senderAddress)) {
      throw new Error(`The given sender address is invalid: ${senderAddress}`);
    }

    if (!ethers.utils.isAddress(contractAddress)) {
      throw new Error(
        `The given contract address is invalid: ${contractAddress}`,
      );
    }

    const action: Action = {
      id: uuidv4(),
      value: getValidNumber(value, 0, 0),
      senderAddress,
      contractAddress,
      encodedFunction,
      functionFragment,
      createdAt: Date.now(),
    };
    await insertAction(action, chainId, snap, mutex, state);

    console.log(`addAction:\naction: ${JSON.stringify(action)}`);
    return action;
  } catch (err) {
    console.error(`Problem found: ${err}`);
    throw err;
  }
}
