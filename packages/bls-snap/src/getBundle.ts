/* eslint-disable jsdoc/require-jsdoc */
import { ApiParams, GetBundleRequestParams } from './types/snapApi';
import { Bundle } from './types/snapState';
import * as snapUtils from './utils/snapUtils';

export async function getBundle(params: ApiParams): Promise<Bundle> {
  try {
    const { state, mutex, requestParams, wallet } = params;
    const { bundleHash, chainId } = requestParams as GetBundleRequestParams;

    const bundle = await snapUtils.getBundle(
      bundleHash,
      chainId,
      wallet,
      mutex,
      state,
    );
    console.log(`getBundle:\n${JSON.stringify(bundle, null, 2)}`);

    return bundle;
  } catch (err) {
    console.error(`Problem found: ${err}`);
    throw err;
  }
}
