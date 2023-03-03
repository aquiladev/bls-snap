import { FC } from 'react';
import { useAppSelector } from '../../../hooks/redux';
import { IListProps } from '../List/List.view';
import { SelectableAction } from '../../../types';
import { Wrapper } from './ActionsList.style';
import { ActionListItem } from './ActionListItem';

type Props = {
  actions?: SelectableAction[];
  isSelectable?: boolean;
};

export const ActionsListView = ({ actions, isSelectable = true }: Props) => {
  const wallet = useAppSelector((state) => state.wallet);
  const networks = useAppSelector((state) => state.networks);
  const chainId = networks.items[networks.activeNetwork]?.chainId;

  return (
    <Wrapper<FC<IListProps<SelectableAction>>>
      data={actions || wallet.actions || []}
      render={(action) => (
        <ActionListItem
          action={action}
          isSelectable={isSelectable}
          chainId={chainId}
        />
      )}
      keyExtractor={(action) => action.id}
    />
  );
};
