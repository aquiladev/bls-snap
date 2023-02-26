import { ApiParams, GetBundleRequestParams } from './types/snapApi';
import { Bundle } from './types/snapState';
import * as snapUtils from './utils/snapUtils';

/**
 * Gets bundle from the specific network.
 *
 * @param params - The request handler args as object.
 * @param params.requestParams.chainId - Id of the supported network.
 * @param params.requestParams.bundleHash - Hash of the bundle.
 * @returns The bundle.
 */
export async function getBundle(params: ApiParams): Promise<Bundle> {
  try {
    const { state, mutex, requestParams, snap } = params;
    const { bundleHash, chainId } = requestParams as GetBundleRequestParams;

    const bundle = await snapUtils.getBundle(
      bundleHash,
      chainId,
      snap,
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
