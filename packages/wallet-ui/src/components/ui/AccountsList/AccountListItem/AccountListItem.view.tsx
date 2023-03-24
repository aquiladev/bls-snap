import { Account, ActiveAccount } from '../../../../types';
import { useBLSSnap } from '../../../../services/useBLSSnap';

import { Wrapper, Row, HighlightedRow } from './AccountListItem.style';

type Props = {
  account: Account;
  activeAccount: ActiveAccount;
};

export const AccountListItemView = ({ account, activeAccount }: Props) => {
  const { selectAccount } = useBLSSnap();
  const { index, name } = account;

  return (
    <Wrapper>
      {index === activeAccount ? (
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
