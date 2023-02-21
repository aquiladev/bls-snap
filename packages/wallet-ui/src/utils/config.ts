type Network = {
  name: string;
  chainId: number;
  rpcUrl: string;
  explorerUrl: string;
  aggregatorUrl: string;
};

const ARBITRUM_GOERLI_NETWORK: Network = {
  name: 'Arbitrum-Goerli',
  chainId: 421613,
  rpcUrl: 'https://goerli-rollup.arbitrum.io/rpc',
  explorerUrl: 'https://goerli.arbiscan.io',
  aggregatorUrl: 'https://arbitrum-goerli.blswallet.org',
};

const OPTIMISM_GOERLI_NETWORK: Network = {
  name: 'Optimism-Goerli',
  chainId: 420,
  rpcUrl: 'https://goerli.optimism.io',
  explorerUrl: 'https://goerli-optimism.etherscan.io',
  aggregatorUrl: 'https://optimism-goerli.blswallet.org',
};

export const getNetworks = (): Network[] => [
  ARBITRUM_GOERLI_NETWORK,
  OPTIMISM_GOERLI_NETWORK,
];

export const getNetwork = (chainId: number): Network | undefined => {
  return getNetworks().find((network) => network.chainId === chainId);
};
