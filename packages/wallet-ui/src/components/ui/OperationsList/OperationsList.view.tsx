import { FC, useEffect, useRef } from 'react';
import { Operation } from 'bls-snap/src/types/snapState';
import { useAppSelector } from '../../../hooks/redux';
import { useBLSSnap } from '../../../services/useBLSSnap';
import { TRANSACTIONS_REFRESH_FREQUENCY } from '../../../utils/constants';
import { IListProps } from '../List/List.view';
import { Wrapper } from './OperationsList.style';
import { OperationListItem } from './OperationListItem';

type Props = {
  operations: Operation[];
};

export const OperationsListView = ({ operations }: Props) => {
  const { getOperations } = useBLSSnap();
  const networks = useAppSelector((state) => state.networks);
  const wallet = useAppSelector((state) => state.wallet);
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const timeoutHandle = useRef(setTimeout(() => {}));

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    const chain = networks.items[networks.activeNetwork]?.chainId;
    const address = wallet.accounts?.[0] as unknown as string;
    if (chain && address) {
      clearTimeout(timeoutHandle.current); // cancel the timeout that was in-flight
      timeoutHandle.current = setTimeout(
        () => getOperations(),
        TRANSACTIONS_REFRESH_FREQUENCY,
      );
      return () => clearTimeout(timeoutHandle.current);
    }
  }, [wallet.operations]);

  return (
    <Wrapper<FC<IListProps<Operation>>>
      data={operations.length > 0 ? operations : wallet.operations}
      render={(op) => <OperationListItem operation={op} />}
      keyExtractor={(op) => op.contractAddress + op.encodedFunction}
    />
  );
};
