import { ApiParams, GetBundlesRequestParams } from './types/snapApi';
import { Bundle } from './types/snapState';
import * as snapUtils from './utils/snapUtils';

/**
 * Gets bundles from the specific network.
 *
 * @param params - The request handler args as object.
 * @param params.requestParams.chainId - Id of the supported network.
 * @param params.requestParams.senderAddress - Address of the sender.
 * @returns The bundles.
 */
export async function getBundles(params: ApiParams): Promise<Bundle[]> {
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
