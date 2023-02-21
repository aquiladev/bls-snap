import { useState } from 'react';
import { Bundle } from '@aquiladev/bls-snap/src/types/snapState';
import { useAppSelector } from '../../../../hooks/redux';
import { ActionsList } from '../../ActionsList';
import { shortenAddress } from '../../../../utils/utils';
import { getNetwork } from '../../../../utils/config';
import ArrowIcon from '../../../../assets/icon_arrow.svg';
import { Wrapper } from './BundleListItem.style';
import { getBundleStatus } from './types';

type Props = {
  bundle: Bundle;
};

export const BundleListItemView = ({ bundle }: Props) => {
  const networks = useAppSelector((state) => state.networks);
  const chainId = networks.items[networks.activeNetwork]?.chainId;
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
        <img
          src={ArrowIcon}
          style={
            showActions
              ? { transform: 'rotate(90deg)' }
              : { transform: 'rotate(0deg)' }
          }
          alt="icon arrow"
        />
        <span style={{ paddingLeft: 20 }}>
          {shortenAddress(bundle.bundleHash)}
        </span>
        <span style={{ paddingLeft: 20, color: statusColor }}>{status}</span>
        <span style={{ paddingLeft: 20 }}>{bundle.blockNumber}</span>
        {bundle.transactionHash && (
          <a
            href={`${getNetwork(chainId).explorerUrl}/tx/${
              bundle.transactionHash
            }`}
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
