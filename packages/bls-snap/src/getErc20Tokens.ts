/* eslint-disable jsdoc/require-jsdoc */
import { ApiParams, GetErc20TokensRequestParams } from './types/snapApi';
import * as snapUtils from './utils/snapUtils';

export async function getErc20Tokens(params: ApiParams) {
  try {
    const { state, requestParams } = params;
    const { chainId } = requestParams as GetErc20TokensRequestParams;

    const network = snapUtils.getNetworkByChainId(state, chainId);
    const erc20Tokens = snapUtils.getErc20Tokens(state, network.chainId);
    console.log(
      `getErc20Tokens: erc20Tokens:\n${JSON.stringify(erc20Tokens, null, 2)}`,
    );

    return erc20Tokens;
  } catch (err) {
    console.error(`Problem found: ${err}`);
    throw err;
  }
}
