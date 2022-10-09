import { Transaction } from 'bls-snap/src/types/snapState';
import { Wrapper } from './TransactionListItem.style';
import { getTxnStatus } from './types';

type Props = {
  transaction: Transaction;
};

export const TransactionListItemView = ({ transaction }: Props) => {
  const status = getTxnStatus(transaction);
  const statusColor = status.toLowerCase() === 'pending' ? 'orange' : 'green';

  return (
    <Wrapper>
      {transaction.txHash}
      <span style={{ paddingLeft: 20, color: statusColor }}>{status}</span>
      <span style={{ paddingLeft: 20 }}>{transaction.blockNumber}</span>
    </Wrapper>
  );
};
