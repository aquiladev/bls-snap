import { useAppDispatch } from '../../../../hooks/redux';
import { SelectableAction } from '../../../../types';
import {
  shortenAddress,
  getDate,
  humanizeFragment,
} from '../../../../utils/utils';
import * as ws from '../../../../slices/walletSlice';
import { useBLSSnap } from '../../../../services/useBLSSnap';
import {
  Column,
  Description,
  Wrapper,
  IconStyled,
  Right,
} from './ActionListItem.style';

type Props = {
  action: SelectableAction;
  isSelectable?: boolean;
};

export const ActionListItemView = ({ action, isSelectable }: Props) => {
  const dispatch = useAppDispatch();
  const { value, contractAddress, createdAt, functionFragment, selected } =
    action;
  const { removeActions } = useBLSSnap();

  const title = humanizeFragment(functionFragment) || 'Send';
  return (
    <Wrapper>
      {isSelectable && (
        <Column
          onClick={() => {
            dispatch(
              ws.updateAction({ ...action, selected: !action.selected }),
            );
          }}
          style={{ cursor: 'pointer' }}
        >
          <IconStyled
            icon={['fas', `${selected ? 'square-check' : 'square'}`]}
            style={{
              fontSize: 22,
            }}
          />
        </Column>
      )}
      <Column>
        <div style={{ marginBottom: 8 }}>
          <Description>
            <span style={{ fontSize: 18 }}>{title}</span>
          </Description>
        </div>
        <Description>
          <span style={{ color: 'green' }}>
            {getDate(createdAt)}&nbsp;&#183;
          </span>
          <span style={{ paddingLeft: 10, paddingRight: 4 }}>To:</span>
          <span style={{ color: 'slateGray' }}>
            {shortenAddress(contractAddress)}
          </span>
        </Description>
      </Column>
      <Right>
        <span>-{value} ETH</span>
        {isSelectable && (
          <IconStyled
            icon={['fas', 'trash']}
            style={{ fontSize: 18, paddingLeft: 20, cursor: 'pointer' }}
            onClick={() => {
              removeActions(action.id);
            }}
          />
        )}
      </Right>
    </Wrapper>
  );
};
