/* eslint-disable jsdoc/require-jsdoc */
import { ethers, utils, BigNumber } from 'ethers';
import { ApiParams, GetErc20TokenBalanceRequestParams } from './types/snapApi';
import { ARBITRUM_GOERLI_NETWORK } from './utils/constants';

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

    if (chainId !== ARBITRUM_GOERLI_NETWORK.chainId) {
      throw new Error(`ChainId not supported: ${chainId}`);
    }

    console.log(
      `getErc20Balance:\nerc20Address: ${tokenAddress}\nuserAddress: ${userAddress}`,
    );

    const ABI = 'function balanceOf(address owner)';

    const iface = new utils.Interface([ABI]);
    const callData = iface.encodeFunctionData('balanceOf', [
      userAddress.toLowerCase(),
    ]);

    const provider = new ethers.providers.JsonRpcProvider(
      ARBITRUM_GOERLI_NETWORK.rpcUrl,
      { name: '', chainId },
    );
    const result = await provider.call({
      to: tokenAddress,
      data: callData,
    });
    const [balance] = utils.defaultAbiCoder.decode(['uint256'], result);

    console.log(`getErc20Balance:\nresp: ${JSON.stringify(balance)}`);

    return BigNumber.from(balance).toHexString();
  } catch (err) {
    console.error(`Problem found: ${err}`);
    throw err;
  }
}
