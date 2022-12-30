import { FC } from 'react';
import { Operation } from 'bls-snap/src/types/snapState';
import { useAppSelector } from '../../../hooks/redux';
import { IListProps } from '../List/List.view';
import { Wrapper } from './OperationsList.style';
import { OperationListItem } from './OperationListItem';

export const OperationsListView = () => {
  const wallet = useAppSelector((state) => state.wallet);

  return (
    <Wrapper<FC<IListProps<Operation>>>
      data={wallet.operations || []}
      render={(op) => <OperationListItem operation={op} />}
      keyExtractor={(op) => op.id}
    />
  );
};
