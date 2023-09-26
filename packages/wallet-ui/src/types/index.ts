import * as Types from '@aquiladev/bls-snap/src/types/snapState';
import { BigNumber } from 'ethers';

export type Network = Pick<Types.Network, 'name' | 'chainId' | 'explorerUrl'>;
export type Account = Types.Account;

export type SelectableAction = Types.Action & {
  selected: boolean;
};

export type Erc20TokenBalance = Types.Erc20Token & {
  amount: BigNumber;
  chainId: number;
  usdPrice?: number;
};
