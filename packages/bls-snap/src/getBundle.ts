/* eslint-disable jsdoc/require-jsdoc */
import { ApiParams, GetBundleRequestParams } from './types/snapApi';
import * as snapUtils from './utils/snapUtils';

export async function getBundle(params: ApiParams) {
  try {
    const { state, mutex, requestParams } = params;
    const { bundleHash, chainId } = requestParams as GetBundleRequestParams;

    const bundles = await snapUtils.getBundle(
      bundleHash,
      chainId,
      wallet,
      mutex,
      state,
    );
    console.log(`getBundle:\n${JSON.stringify(bundles, null, 2)}`);

    return bundles || [];
  } catch (err) {
    console.error(`Problem found: ${err}`);
    throw err;
  }
}
