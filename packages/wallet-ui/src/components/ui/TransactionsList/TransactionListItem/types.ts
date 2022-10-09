import { Transaction } from 'bls-snap/src/types/snapState';

export const getTxnStatus = (transaction: Transaction): string => {
  return transaction.blockNumber ? 'Completed' : 'Pending';
};
