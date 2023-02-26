import { ApiParams, RemoveErc20TokenRequestParams } from './types/snapApi';
import { Erc20Token } from './types/snapState';
import * as snapUtils from './utils/snapUtils';

/**
 * Removes ERC20 token from the specific network.
 *
 * @param params - The request handler args as object.
 * @param params.requestParams.chainId - Id of the supported network.
 * @param params.requestParams.tokenAddress - Address of the ERC20 token.
 * @returns The removed ERC20 token.
 */
export async function removeErc20Token(params: ApiParams): Promise<Erc20Token> {
  try {
    const { state, snap, mutex, requestParams } = params;
    const requestParamsObj = requestParams as RemoveErc20TokenRequestParams;

    if (!requestParamsObj.tokenAddress) {
      throw new Error(
        `The given token address need to be non-empty string, got: ${JSON.stringify(
          requestParamsObj,
        )}`,
      );
    }

    const erc20Token = snapUtils.getErc20Token(
      requestParamsObj.tokenAddress,
      requestParamsObj.chainId,
      state,
    );
    if (!erc20Token) {
      throw new Error(`Token not found: ${JSON.stringify(requestParamsObj)}`);
    }

    if (erc20Token.isInternal) {
      throw new Error(`The token is internal, not possible to remove`);
    }

    await snapUtils.removeErc20Token(
      erc20Token,
      requestParamsObj.chainId,
      snap,
      mutex,
      state,
    );

    console.log(`removeErc20Token:\nerc20Token: ${JSON.stringify(erc20Token)}`);
    return erc20Token;
  } catch (err) {
    console.error(`Problem found: ${err}`);
    throw err;
  }
}
