import { NetworkConfig } from 'bls-wallet-clients';

export type SnapState = {
  networks: Network[];
  accounts: BlsAccount[];
  erc20Tokens: Erc20Token[];
  ops: Operation[];
  transactions: Transaction[];
};

export type Network = {
  name: string;
  chainId: number;
  rpcUrl: string;
  aggregator: string;
  config: NetworkConfig;
};

export type BlsAccount = {
  address: string;
  chainId: number;
};

export type Erc20Token = {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  chainId: number;
};

export type Operation = {
  ethValue: number;
  contractAddress: string;
  encodedFunction: string;
};

export type Transaction = {
  txHash: string;
  chainId: number;
  transactionIndex: string;
  blockHash: string;
  blockNumber: string;
};
