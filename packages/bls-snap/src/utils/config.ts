import { validateConfig } from 'bls-wallet-clients';
import { Network } from '../types/snapState';
import arbitrumGoerliConfig from '../networks/arbitrum-goerli.json';
import optimismGoerliConfig from '../networks/optimism-goerli.json';

const ARBITRUM_GOERLI_NETWORK: Network = {
  name: 'Arbitrum-Goerli',
  chainId: 421613,
  rpcUrl: 'https://goerli-rollup.arbitrum.io/rpc',
  aggregator: 'https://arbitrum-goerli.blswallet.org',
  config: validateConfig(arbitrumGoerliConfig),
};

const OPTIMISM_GOERLI_NETWORK: Network = {
  name: 'Optimism-Goerli',
  chainId: 420,
  rpcUrl: 'https://goerli.optimism.io',
  aggregator: 'https://optimism-goerli.blswallet.org',
  config: validateConfig(optimismGoerliConfig),
};

export const getNetworks = (): Network[] => [
  ARBITRUM_GOERLI_NETWORK,
  OPTIMISM_GOERLI_NETWORK,
];

export const getNetwork = (chainId: number): Network | undefined => {
  return getNetworks().find((network) => network.chainId === chainId);
};
