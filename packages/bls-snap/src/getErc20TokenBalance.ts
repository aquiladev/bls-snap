/* eslint-disable jsdoc/require-jsdoc */
import { ethers, utils, BigNumber } from 'ethers';
import { ApiParams, GetErc20TokenBalanceRequestParams } from './types/snapApi';
import * as config from './utils/config';
import { callContract } from './utils/evmUtils';

export async function getErc20TokenBalance(params: ApiParams) {
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

    const ABI = 'function balanceOf(address owner)';

    const iface = new utils.Interface([ABI]);
    const calldata = iface.encodeFunctionData('balanceOf', [
      userAddress.toLowerCase(),
    ]);

    const result = await callContract(network, tokenAddress, calldata);
    const [balance] = utils.defaultAbiCoder.decode(['uint256'], result);
    console.log(`getErc20Balance:\nresp: ${JSON.stringify(balance)}`);

    return BigNumber.from(balance).toHexString();
  } catch (err) {
    console.error(`Problem found: ${err}`);
    throw err;
  }
}
