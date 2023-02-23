/* eslint-disable jsdoc/require-jsdoc */
import { ethers, BigNumber } from 'ethers';
import { ApiParams, GetErc20TokenBalanceRequestParams } from './types/snapApi';
import * as config from './utils/config';
import * as evmUtils from './utils/evmUtils';

export async function getErc20TokenBalance(params: ApiParams): Promise<string> {
  try {
    const { requestParams } = params;
    const { tokenAddress, userAddress, chainId } =
      requestParams as GetErc20TokenBalanceRequestParams;

    if (!tokenAddress || !userAddress) {
      throw new Error(
        `The given token address and user address need to be non-empty string, got: ${JSON.stringify(
          requestParams,
        )}`,
      );
    }

    if (!ethers.utils.isAddress(tokenAddress)) {
      throw new Error(`The given token address is invalid: ${tokenAddress}`);
    }

    if (!ethers.utils.isAddress(userAddress)) {
      throw new Error(`The given user address is invalid: ${userAddress}`);
    }

    const network = config.getNetwork(chainId);
    if (!network) {
      throw new Error(`ChainId not supported: ${chainId}`);
    }

    console.log(
      `getErc20Balance:\nerc20Address: ${tokenAddress}\nuserAddress: ${userAddress}`,
    );

    const balance = await evmUtils.getErc20TokenBalance(
      network,
      tokenAddress,
      userAddress,
    );
    console.log(`getErc20Balance:\nresp: ${JSON.stringify(balance)}`);

    return BigNumber.from(balance).toHexString();
  } catch (err) {
    console.error(`Problem found: ${err}`);
    throw err;
  }
}
