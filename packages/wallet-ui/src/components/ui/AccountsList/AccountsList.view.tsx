import { FC } from 'react';
import { useAppSelector } from '../../../hooks/redux';
import { IListProps } from '../List/List.view';
import { SelectableAccount } from '../../../types';
import { Wrapper } from './AccountsList.style';
import { AccountListItem } from './AccountListItem';

type Props = {
  accounts?: SelectableAccount[];
  isSelectable?: boolean;
};

export const AccountsListView = ({ accounts, isSelectable = true }: Props) => {
  const wallet = useAppSelector((state) => state.wallet);
  console.log('wallet:', wallet);
  console.log('accounts:', accounts);

  return (
    <Wrapper<FC<IListProps<SelectableAccount>>>
      data={accounts || wallet.accounts || []}
      // data={[{ address: '12345', name: '123', index: 2 }]}
      render={(account) => (
        <AccountListItem account={account} isSelectable={isSelectable} />
      )}
      keyExtractor={(account) => account.address + account.index}
    />
  );
};
