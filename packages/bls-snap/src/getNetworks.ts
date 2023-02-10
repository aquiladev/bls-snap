/* eslint-disable jsdoc/require-jsdoc */
import { ApiParams } from './types/snapApi';
import { SnapState } from './types/snapState';
import * as snapUtils from './utils/snapUtils';

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
