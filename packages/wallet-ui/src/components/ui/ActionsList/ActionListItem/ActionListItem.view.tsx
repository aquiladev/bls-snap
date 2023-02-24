import { Action } from '@aquiladev/bls-snap/src/types/snapState';
import { useBLSSnap } from '../../../../services/useBLSSnap';
import {
  shortenAddress,
  getDate,
  getFunctionName,
} from '../../../../utils/utils';
import {
  Column,
  Description,
  Wrapper,
  IconStyled,
  Right,
} from './ActionListItem.style';

type Props = {
  action: Action;
  postponeCheckbox?: boolean;
};

export const ActionListItemView = ({ action, postponeCheckbox }: Props) => {
  const {
    id,
    value,
    contractAddress,
    createdAt,
    functionFragment,
    postpone = false,
  } = action;
  const { updatePostponeAction } = useBLSSnap();
  return (
    <Wrapper
      onClick={async () => {
        if (postponeCheckbox) {
          await updatePostponeAction(id, !postpone || false);
        }
      }}
    >
      {postponeCheckbox && (
        <Column>
          <IconStyled
            icon={['fas', `${postpone ? 'square' : 'square-check'}`]}
          />
        </Column>
      )}
      <Column>
        <div style={{ marginBottom: 8 }}>
          <Description>
            <span style={{ fontSize: 18 }}>
              {/* {functionFragment ? getFunctionName(functionFragment) : 'Send'} */}
              {getFunctionName('fragment')}
            </span>
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
        <span>-{value}&nbsp;ETH</span>
      </Right>
    </Wrapper>
  );
};
