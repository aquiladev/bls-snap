import { ApiParams } from './types/snapApi';
import { SnapState } from './types/snapState';
import * as snapUtils from './utils/snapUtils';

/**
 * Returns list of supported networks with their configurations.
 *
 * @param params - The request handler args as object.
 * @returns The list of supported networks.
 */
export async function getNetworks(params: ApiParams): Promise<SnapState> {
  try {
    const { state } = params;

    const networks = snapUtils.getNetworks(state);
    console.log(`getNetworks:\n${JSON.stringify(networks, null, 2)}`);

    return networks;
  } catch (err) {
    console.error(`Problem found: ${err}`);
    throw err;
  }
}
