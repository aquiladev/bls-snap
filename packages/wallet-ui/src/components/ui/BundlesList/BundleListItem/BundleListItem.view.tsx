import { useState } from 'react';
import { Bundle } from '@aquiladev/bls-snap/src/types/snapState';
import { ActionsList } from '../../ActionsList';
import { shortenAddress } from '../../../../utils/utils';
import ArrowIcon from '../../../../assets/icon_arrow.svg';
import { Wrapper } from './BundleListItem.style';
import { getBundleStatus } from './types';

type Props = {
  bundle: Bundle;
};

export const BundleListItemView = (props) => {
  const { bundle } = props;
  const [showActions, setShowActions] = useState(false);
  const status = getBundleStatus(bundle);
  const statusColor = status.toLowerCase() === 'pending' ? 'orange' : 'green';
  console.log(props);

  return (
    <>
      <Wrapper
        onClick={() => {
          setShowActions(!showActions);
        }}
      >
        <img
          src={ArrowIcon}
          style={
            showActions
              ? { transform: 'rotate(90deg)' }
              : { transform: 'rotate(0deg)' }
          }
          alt="icon arrow"
        />
        <span style={{ paddingLeft: 20, color: statusColor }}>
          {shortenAddress(bundle.bundleHash)}
        </span>
        <span style={{ paddingLeft: 20, color: statusColor }}>{status}</span>
        <span style={{ paddingLeft: 20 }}>{bundle.blockNumber}</span>
        {bundle.transactionHash && (
          <a
            href={`https://blockscout.com/optimism/goerli/tx/${bundle.transactionHash}`}
            style={{ paddingLeft: 20, textDecoration: 'none' }}
            rel="noopener noreferrer"
            target="_blank"
          >
            {shortenAddress(bundle.transactionHash)}
          </a>
        )}
      </Wrapper>
      {showActions && <ActionsList actions={bundle.actions} />}
    </>
  );
};
