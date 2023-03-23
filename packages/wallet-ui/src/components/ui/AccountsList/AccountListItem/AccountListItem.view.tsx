import { Account } from '../../../../types';
import { useBLSSnap } from '../../../../services/useBLSSnap';

import { Wrapper, Row, HighlightedRow } from './AccountListItem.style';

type Props = {
  account: Account;
};

export const AccountListItemView = ({ account }: Props) => {
  const { selectAccount } = useBLSSnap();
  const { index, name, selected } = account;

  return (
    <Wrapper>
      {selected ? (
        <div>
          <HighlightedRow>
            <span>{name}</span>
          </HighlightedRow>
        </div>
      ) : (
        <div
          onClick={(e) => {
            e.stopPropagation();
            selectAccount(index);
          }}
        >
          <Row>
            <span>{name}</span>
          </Row>
        </div>
      )}
    </Wrapper>
  );
};
