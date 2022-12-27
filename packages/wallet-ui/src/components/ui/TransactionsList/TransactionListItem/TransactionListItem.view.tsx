import { Bundle } from 'bls-snap/src/types/snapState';
import { Wrapper } from './TransactionListItem.style';
import { getBundleStatus } from './types';

type Props = {
  transaction: Bundle;
};

export const TransactionListItemView = ({ transaction }: Props) => {
  const status = getBundleStatus(transaction);
  const statusColor = status.toLowerCase() === 'pending' ? 'orange' : 'green';

  return (
    <Wrapper>
      {transaction.bundleHash}
      <span style={{ paddingLeft: 20, color: statusColor }}>{status}</span>
      <span style={{ paddingLeft: 20 }}>{transaction.blockNumber}</span>
    </Wrapper>
  );
};
