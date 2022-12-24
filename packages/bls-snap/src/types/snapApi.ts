import { Mutex } from 'async-mutex';
import { SnapState } from './snapState';

export type ApiParams = {
  state: Partial<SnapState>;
  requestParams: ApiRequestParams;
  mutex: Mutex;
  wallet: any;
};

export type BaseRequestParams = {
  chainId: number;
};

export type RecoverAccountRequestParams = BaseRequestParams;

export type CreateAccountRequestParams = BaseRequestParams;

export type GetNetworksRequestParams = Omit<BaseRequestParams, 'chainId'>;

export type GetErc20TokensRequestParams = BaseRequestParams;

export type GetErc20TokenBalanceRequestParams = {
  tokenAddress: string;
  userAddress: string;
} & BaseRequestParams;

export type AddOperationRequestParams = {
  contractAddress: string;
  encodedFunction: string;
} & BaseRequestParams;

export type GetOperationsRequestParams = BaseRequestParams;

export type GetBundlesRequestParams = {
  senderAddress?: string;
  contractAddress?: string;
  bundleHash?: string;
} & BaseRequestParams;

export type SendBundleRequestParams = {
  senderAddress: string;
} & BaseRequestParams;

export type ApiRequestParams =
  | RecoverAccountRequestParams
  | CreateAccountRequestParams
  | GetNetworksRequestParams
  | GetErc20TokensRequestParams
  | GetErc20TokenBalanceRequestParams
  | AddOperationRequestParams
  | GetOperationsRequestParams
  | GetBundlesRequestParams
  | SendBundleRequestParams;
