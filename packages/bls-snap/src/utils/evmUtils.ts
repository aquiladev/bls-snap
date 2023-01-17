/* eslint-disable jsdoc/require-jsdoc */
import { ethers } from 'ethers';
import { Network } from '../types/snapState';

export async function callContract(
  network: Network,
  to: string,
  data: string,
): Promise<string> {
  const provider = getProvider(network);
  return provider.call({ to, data });
}

export function getProvider(
  network: Network,
): ethers.providers.JsonRpcProvider {
  return new ethers.providers.JsonRpcProvider(network.rpcUrl, {
    name: network.name,
    chainId: network.chainId,
  });
}
