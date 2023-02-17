/* eslint-disable jsdoc/require-jsdoc */
import { ethers } from 'ethers';
import { v4 as uuidv4 } from 'uuid';
import { ApiParams, AddActionRequestParams } from './types/snapApi';
import { Action } from './types/snapState';
import { getValidNumber, insertAction } from './utils/snapUtils';

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
