import { BigNumber } from 'ethers';
import { Account } from '../../../../types';
import { useBLSSnap } from '../../../../services/useBLSSnap';

import {
  Wrapper,
  Row,
  ActiveRow,
  ActiveIcon,
  AccountImageStyled,
} from './AccountListItem.style';

type Props = {
  account: Account;
  activeAccount: number;
};

export const AccountListItemView = ({ account, activeAccount }: Props) => {
  const { selectAccount } = useBLSSnap();
  const { index, name, address } = account;

  return (
    <Wrapper>
      {index === activeAccount ? (
        <ActiveRow>
          <ActiveIcon />
          <AccountImageStyled
            size={18}
            address={BigNumber.from(address).toString()}
          />
          <span>{name}</span>
        </ActiveRow>
      ) : (
        <Row
          onClick={(e) => {
            e.stopPropagation();
            selectAccount(account);
          }}
        >
          <AccountImageStyled
            size={18}
            address={BigNumber.from(address).toString()}
          />
          <span>{name}</span>
        </Row>
      )}
    </Wrapper>
  );
};
