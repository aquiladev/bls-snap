import { Network } from '../types/snapState';

export const ARBITRUM_GOERLI_NETWORK: Network = {
  name: 'Arbitrum-Goerli',
  chainId: '421613',
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  config: require('../networks/arbitrum-goerli.json'),
};
