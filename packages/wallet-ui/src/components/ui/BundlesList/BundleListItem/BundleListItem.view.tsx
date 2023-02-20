import { useState } from 'react';
import { Bundle } from '@aquiladev/bls-snap/src/types/snapState';
import { ActionsList } from '../../ActionsList';
import { Wrapper } from './BundleListItem.style';
import { getBundleStatus } from './types';

type Props = {
  bundle: Bundle;
};

export const BundleListItemView = ({ bundle }: Props) => {
  const [showActions, setShowActions] = useState(false);
  const status = getBundleStatus(bundle);
  const statusColor = status.toLowerCase() === 'pending' ? 'orange' : 'green';

  return (
    <>
      <Wrapper
        onClick={() => {
          setShowActions(!showActions);
        }}
      >
        <span style={{ paddingRight: 20, fontWeight: 900 }}>
          {showActions ? '-' : '+'}
        </span>
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
      {showActions && <ActionsList actions={bundle.actions} />}
    </>
  );
};
