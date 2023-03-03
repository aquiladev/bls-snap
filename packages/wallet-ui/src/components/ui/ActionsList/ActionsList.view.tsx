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

  return (
    <Wrapper<FC<IListProps<SelectableAction>>>
      data={actions || wallet.actions || []}
      render={(action) => (
        <ActionListItem action={action} isSelectable={isSelectable} />
      )}
      keyExtractor={(action) => action.id}
    />
  );
};
