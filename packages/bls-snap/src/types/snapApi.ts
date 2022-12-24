import { Mutex } from 'async-mutex';
import { SnapState } from './snapState';

export type ApiParams = {
  state: Partial<SnapState>;
  requestParams: ApiRequestParams;
  mutex: Mutex;
  wallet: any;
};

export type BaseRequestParams = {
  chainId?: number;
  isDev?: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export type CreateAccountRequestParams = BaseRequestParams;

// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/ban-types
export type GetStoredNetworksRequestParams = Omit<BaseRequestParams, 'chainId'>;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export type GetStoredErc20TokensRequestParams = BaseRequestParams;

export type GetErc20TokenBalanceRequestParams = {
  tokenAddress: string;
  userAddress: string;
} & BaseRequestParams;

export type AddOperationRequestParams = {
  contractAddress: string;
  encodedFunction: string;
} & BaseRequestParams;

export type GetOperationsRequestParams = BaseRequestParams;

export type GetTransactionsRequestParams = {
  senderAddress?: string;
  contractAddress?: string;
  txHash?: string;
} & BaseRequestParams;

export type ApiRequestParams =
  | CreateAccountRequestParams
  | GetStoredNetworksRequestParams
  | GetStoredErc20TokensRequestParams
  | GetErc20TokenBalanceRequestParams
  | AddOperationRequestParams
  | GetOperationsRequestParams
  | GetTransactionsRequestParams;
