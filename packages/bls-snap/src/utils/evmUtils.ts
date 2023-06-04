/* eslint-disable jsdoc/require-jsdoc */
import { BigNumber, providers, utils } from 'ethers';
import { Network } from '../types/snapState';

export async function callContract(
  network: Network,
  to: string,
  data: string,
): Promise<string> {
  const provider = getProvider(network);
  return provider.call({ to, data });
}

export function getProvider(network: Network): providers.JsonRpcProvider {
  return new providers.JsonRpcProvider(network.rpcUrl, {
    name: network.name,
    chainId: network.chainId,
  });
}

export async function getErc20TokenBalance(
  network: Network,
  tokenAddress: string,
  account: string,
): Promise<BigNumber> {
  const iface = new utils.Interface(['function balanceOf(address owner)']);
  const calldata = iface.encodeFunctionData('balanceOf', [account]);

  const result = await callContract(network, tokenAddress, calldata);
  const [balance] = utils.defaultAbiCoder.decode(['uint256'], result);
  return balance;
}

export async function getBalance(
  network: Network,
  account: string,
): Promise<BigNumber> {
  const provider = getProvider(network);
  return provider.getBalance(account);
}
