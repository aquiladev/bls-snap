import { Network } from '../types/snapState';
import config from '../networks/arbitrum-goerli.json';

export const ARBITRUM_GOERLI_NETWORK: Network = {
  name: 'Arbitrum-Goerli',
  chainId: 421613,
  rpcUrl: 'https://goerli-rollup.arbitrum.io/rpc',
  aggregator: 'https://arbitrum-goerli.blswallet.org',
  config,
};
