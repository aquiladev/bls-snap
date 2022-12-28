/* eslint-disable jsdoc/require-jsdoc */
import { ApiParams, GetBundlesRequestParams } from './types/snapApi';
import * as snapUtils from './utils/snapUtils';

export async function getBundles(params: ApiParams) {
  try {
    const { state, mutex, requestParams } = params;
    const { chainId } = requestParams as GetBundlesRequestParams;

    const bundles = snapUtils.getBundles(chainId, wallet, mutex, state);
    console.log(`getNetworks: networks:\n${JSON.stringify(bundles, null, 2)}`);

    return bundles || [];
  } catch (err) {
    console.error(`Problem found: ${err}`);
    throw err;
  }
}
