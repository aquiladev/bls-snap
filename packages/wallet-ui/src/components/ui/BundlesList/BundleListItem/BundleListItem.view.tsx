import { Bundle } from '@aquiladev/bls-snap/src/types/snapState';
import { Wrapper } from './BundleListItem.style';
import { getBundleStatus } from './types';

type Props = {
  bundle: Bundle;
};

export const BundleListItemView = ({ bundle }: Props) => {
  const status = getBundleStatus(bundle);
  const statusColor = status.toLowerCase() === 'pending' ? 'orange' : 'green';

  return (
    <Wrapper>
      {bundle.bundleHash}
      <span style={{ paddingLeft: 20, color: statusColor }}>{status}</span>
      <span style={{ paddingLeft: 20 }}>{bundle.blockNumber}</span>
      {bundle.transactionHash && (
        <a
          href={`https://blockscout.com/optimism/goerli/tx/${bundle.transactionHash}`}
          style={{ paddingLeft: 20, textDecoration: 'none' }}
          rel="noopener noreferrer"
          target="_blank"
        >
          View on explorer
        </a>
      )}
    </Wrapper>
  );
};
