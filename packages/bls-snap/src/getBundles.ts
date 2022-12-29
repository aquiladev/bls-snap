/* eslint-disable jsdoc/require-jsdoc */
import { ApiParams, GetBundlesRequestParams } from './types/snapApi';
import * as snapUtils from './utils/snapUtils';

export async function getBundles(params: ApiParams) {
  try {
    const { state, requestParams } = params;
    const { senderAddress, chainId } = requestParams as GetBundlesRequestParams;

    const bundles = snapUtils.getBundles(senderAddress, chainId, state);
    console.log(`getBundles:\n${JSON.stringify(bundles, null, 2)}`);

    return bundles || [];
  } catch (err) {
    console.error(`Problem found: ${err}`);
    throw err;
  }
}
