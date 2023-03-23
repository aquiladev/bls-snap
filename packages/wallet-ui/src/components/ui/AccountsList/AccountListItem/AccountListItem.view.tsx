import { SelectableAccount } from '../../../../types';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import * as ws from '../../../../slices/walletSlice';

import { Description, Wrapper } from './AccountListItem.style';

type Props = {
  account: SelectableAccount;
  isSelectable?: boolean;
};

export const AccountListItemView = ({ account, isSelectable }: Props) => {
  const dispatch = useAppDispatch();
  const { address, index, name } = account;

  return (
    <Wrapper>
      <div
        style={{ marginBottom: 8 }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Description>
          <span>{name}</span>
        </Description>
      </div>
    </Wrapper>
  );
};
