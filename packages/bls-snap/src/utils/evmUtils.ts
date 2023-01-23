/* eslint-disable jsdoc/require-jsdoc */
import { providers } from 'ethers';
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
