import { useState } from 'react';
import { Bundle } from '@aquiladev/bls-snap/src/types/snapState';
import { useAppSelector } from '../../../../hooks/redux';
import { ActionsList } from '../../ActionsList';
import { shortenAddress } from '../../../../utils/utils';
import {
  Content,
  IconStyled,
  Link,
  Right,
  Wrapper,
} from './BundleListItem.style';
import { getBundleStatus } from './types';

type Props = {
  bundle: Bundle;
};

export const BundleListItemView = ({ bundle }: Props) => {
  const networks = useAppSelector((state) => state.networks);
  const explorerUrl = networks.items[networks.activeNetwork]?.explorerUrl;
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
        <span>{shortenAddress(bundle.bundleHash)}</span>
        <span style={{ paddingLeft: 20, color: statusColor }}>{status}</span>
        <span style={{ paddingLeft: 20 }}>{bundle.blockNumber}</span>
        {bundle.transactionHash && (
          <Link
            href={`${explorerUrl}/tx/${bundle.transactionHash}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            {shortenAddress(bundle.transactionHash)}
            <IconStyled
              icon={['fas', 'arrow-up-right-from-square']}
              style={{
                paddingLeft: 5,
              }}
            />
          </Link>
        )}
        <Right>
          <IconStyled
            icon={['fas', 'chevron-right']}
            style={{
              transform: showActions ? 'rotate(90deg)' : 'rotate(0deg)',
            }}
          />
        </Right>
      </Wrapper>
      {showActions && (
        <Content>
          <ActionsList actions={bundle.actions} />
        </Content>
      )}
    </>
  );
};
