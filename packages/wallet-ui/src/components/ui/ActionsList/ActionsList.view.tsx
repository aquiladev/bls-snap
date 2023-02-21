import { FC } from 'react';
import { Action } from '@aquiladev/bls-snap/src/types/snapState';
import { useAppSelector } from '../../../hooks/redux';
import { IListProps } from '../List/List.view';
import { Wrapper } from './ActionsList.style';
import { ActionListItem } from './ActionListItem';

type Props = {
  actions?: Action[];
};

export const ActionsListView = ({ actions }: Props) => {
  const wallet = useAppSelector((state) => state.wallet);

  return (
    <Wrapper<FC<IListProps<Action>>>
      data={actions || wallet.actions || []}
      render={(action) => <ActionListItem action={action} />}
      keyExtractor={(action) => action.id}
    />
  );
};
