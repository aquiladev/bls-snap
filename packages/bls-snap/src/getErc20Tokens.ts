import { ApiParams, GetErc20TokensRequestParams } from './types/snapApi';
import { Erc20Token } from './types/snapState';
import * as snapUtils from './utils/snapUtils';

/**
 * Returns list of ERC20 tokens for the specific network.
 *
 * @param params - The request handler args as object.
 * @param params.requestParams.chainId - Id of the supported network.
 * @returns The list of ERC20 tokens.
 */
export async function getErc20Tokens(params: ApiParams): Promise<Erc20Token[]> {
  try {
    const { state, requestParams } = params;
    const { chainId } = requestParams as GetErc20TokensRequestParams;

    const erc20Tokens = snapUtils.getErc20Tokens(chainId, state);
    console.log(`getErc20Tokens:\n${JSON.stringify(erc20Tokens, null, 2)}`);

    return erc20Tokens || [];
  } catch (err) {
    console.error(`Problem found: ${err}`);
    throw err;
  }
}
