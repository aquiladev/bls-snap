import { FC } from 'react';
import { useAppSelector } from '../../../hooks/redux';
import { IListProps } from '../List/List.view';
import { Account } from '../../../types';
import { Wrapper } from './AccountsList.style';
import { AccountListItem } from './AccountListItem';

export const AccountsListView = () => {
  const { accounts, activeAccount } = useAppSelector((state) => state.wallet);

  return (
    <Wrapper<FC<IListProps<Account>>>
      data={accounts || []}
      render={(account) => (
        <AccountListItem account={account} activeAccount={activeAccount} />
      )}
      keyExtractor={(account) => account.address}
    />
  );
};
