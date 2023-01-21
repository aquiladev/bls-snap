import { Bundle } from 'bls-snap/src/types/snapState';
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
    </Wrapper>
  );
};
