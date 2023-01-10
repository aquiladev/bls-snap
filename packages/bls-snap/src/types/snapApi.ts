import { Mutex } from 'async-mutex';
import { SnapState } from './snapState';

export type ApiParams = {
  state: SnapState;
  requestParams: ApiRequestParams;
  mutex: Mutex;
  wallet: any;
  keyDeriver?: any;
};

export type BaseRequestParams = {
  chainId: number;
};

export type GetNetworksRequestParams = Omit<BaseRequestParams, 'chainId'>;

export type RecoverAccountsRequestParams = BaseRequestParams;

export type CreateAccountRequestParams = {
  addressIndex?: string | number;
} & BaseRequestParams;

export type GetErc20TokensRequestParams = BaseRequestParams;

export type GetErc20TokenBalanceRequestParams = {
  tokenAddress: string;
  userAddress: string;
} & BaseRequestParams;

export type GetOperationsRequestParams = {
  senderAddress: string;
} & BaseRequestParams;

export type AddOperationRequestParams = {
  senderAddress: string;
  contractAddress: string;
  encodedFunction: string;
} & BaseRequestParams;

export type GetBundleRequestParams = {
  bundleHash: string;
} & BaseRequestParams;

export type GetBundlesRequestParams = {
  senderAddress: string;
  contractAddress?: string;
  bundleHash?: string;
} & BaseRequestParams;

export type SendBundleRequestParams = {
  senderAddress: string;
} & BaseRequestParams;

export type ApiRequestParams =
  | GetNetworksRequestParams
  | RecoverAccountsRequestParams
  | CreateAccountRequestParams
  | GetErc20TokensRequestParams
  | GetErc20TokenBalanceRequestParams
  | GetOperationsRequestParams
  | AddOperationRequestParams
  | GetBundleRequestParams
  | GetBundlesRequestParams
  | SendBundleRequestParams;
