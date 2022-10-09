/* eslint-disable jsdoc/require-jsdoc */
import { ApiParams } from './types/snapApi';
import * as snapUtils from './utils/snapUtils';

export async function getTransactions(params: ApiParams) {
  try {
    const { state, mutex } = params;
    return snapUtils.getTransactions(wallet, mutex, state);
  } catch (err) {
    console.error(`Problem found: ${err}`);
    throw err;
  }
}
