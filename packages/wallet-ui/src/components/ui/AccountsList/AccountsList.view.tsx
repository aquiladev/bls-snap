import { FC } from 'react';
import { useAppSelector } from '../../../hooks/redux';
import { IListProps } from '../List/List.view';
import { Account } from '../../../types';
import { Wrapper } from './AccountsList.style';
import { AccountListItem } from './AccountListItem';

type Props = {
  accounts?: Account[];
};

export const AccountsListView = ({ accounts }: Props) => {
  const wallet = useAppSelector((state) => state.wallet);

  return (
    <Wrapper<FC<IListProps<Account>>>
      data={accounts || wallet.accounts || []}
      render={(account) => <AccountListItem account={account} />}
      keyExtractor={(account) => account.address + account.index}
    />
  );
};
