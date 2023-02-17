/* eslint-disable jsdoc/require-jsdoc */
import { ApiParams, AddErc20TokenRequestParams } from './types/snapApi';
import { Erc20Token } from './types/snapState';
import {
  DEFAULT_DECIMALS,
  getValidNumber,
  upsertErc20Token,
  validateAddErc20TokenParams,
} from './utils/snapUtils';

export async function addErc20Token(params: ApiParams): Promise<Erc20Token> {
  try {
    const { state, snap, mutex, requestParams } = params;
    const requestParamsObj = requestParams as AddErc20TokenRequestParams;

    if (
      !requestParamsObj.tokenAddress ||
      !requestParamsObj.tokenName ||
      !requestParamsObj.tokenSymbol
    ) {
      throw new Error(
        `The given token address, name, and symbol need to be non-empty string, got: ${JSON.stringify(
          requestParamsObj,
        )}`,
      );
    }

    validateAddErc20TokenParams(requestParamsObj);

    const erc20Token: Erc20Token = {
      address: requestParamsObj.tokenAddress,
      name: requestParamsObj.tokenName,
      symbol: requestParamsObj.tokenSymbol,
      decimals: getValidNumber(
        requestParamsObj.tokenDecimals,
        DEFAULT_DECIMALS,
        0,
      ),
      isInternal: false,
    };

    await upsertErc20Token(
      erc20Token,
      requestParamsObj.chainId,
      snap,
      mutex,
      state,
    );

    console.log(`addErc20Token:\nerc20Token: ${JSON.stringify(erc20Token)}`);
    return erc20Token;
  } catch (err) {
    console.error(`Problem found: ${err}`);
    throw err;
  }
}
