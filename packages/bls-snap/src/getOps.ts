/* eslint-disable jsdoc/require-jsdoc */
import { ApiParams } from './types/snapApi';
import * as snapUtils from './utils/snapUtils';

export async function getOps(params: ApiParams) {
  try {
    const { state } = params;
    return snapUtils.getOperations(state);
  } catch (err) {
    console.error(`Problem found: ${err}`);
    throw err;
  }
}
