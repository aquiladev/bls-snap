/* eslint-disable jsdoc/require-jsdoc */
import { ApiParams, RemoveErc20TokenRequestParams } from './types/snapApi';
import { Erc20Token } from './types/snapState';
import { deleteErc20Token, getErc20Token } from './utils/snapUtils';

export async function removeErc20Token(params: ApiParams): Promise<Erc20Token> {
  try {
    const { state, wallet, mutex, requestParams } = params;
    const requestParamsObj = requestParams as RemoveErc20TokenRequestParams;

    if (!requestParamsObj.tokenAddress) {
      throw new Error(
        `The given token address need to be non-empty string, got: ${JSON.stringify(
          requestParamsObj,
        )}`,
      );
    }

    const _erc20Token = getErc20Token(
      requestParamsObj.tokenAddress,
      requestParamsObj.chainId,
      state,
    );
    if (!_erc20Token) {
      throw new Error(`Token not found: ${JSON.stringify(requestParamsObj)}`);
    }

    if (_erc20Token.isInternal) {
      throw new Error(`The token is internal, not possible to remove`);
    }

    await deleteErc20Token(
      _erc20Token,
      requestParamsObj.chainId,
      wallet,
      mutex,
      state,
    );

    console.log(
      `removeErc20Token:\nerc20Token: ${JSON.stringify(_erc20Token)}`,
    );
    return _erc20Token;
  } catch (err) {
    console.error(`Problem found: ${err}`);
    throw err;
  }
}
