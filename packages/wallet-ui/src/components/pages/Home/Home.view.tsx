import { useAppSelector } from '../../../hooks/redux';
import { useBLSSnap } from '../../../services/useBLSSnap';
import { Header } from '../../ui/Header';
import { Buttons, HeaderButton } from '../../ui/Header/Header.style';
import { Separator } from '../../ui/Header/SendModal/SendModal.style';
import { OperationsList } from '../../ui/OperationsList';
import { SideBar } from '../../ui/SideBar';
import { TransactionsList } from '../../ui/TransactionsList';
import { RightPart, Wrapper } from './Home.style';

type Props = {
  address: string;
};

export const HomeView = ({ address }: Props) => {
  const { erc20TokenBalanceSelected, operations: ops } = useAppSelector(
    (state) => state.wallet,
  );
  const { sendBundle } = useBLSSnap();

  const handleSendBundle = async () => {
    await sendBundle(address, erc20TokenBalanceSelected.chainId);
  };

  return (
    <Wrapper>
      <SideBar address={address} />
      <RightPart>
        {Object.keys(erc20TokenBalanceSelected).length > 0 && (
          <Header address={address} />
        )}
        <div>
          <div style={{ padding: 4 }}>Operations</div>
          <OperationsList operations={[]} />
          {Boolean(ops.length) && (
            <Buttons style={{ textAlign: 'center' }}>
              <HeaderButton onClick={() => handleSendBundle()}>
                Send Bundle
              </HeaderButton>
            </Buttons>
          )}
        </div>
        <Separator />
        <div>
          <div style={{ padding: 4 }}>Bundles</div>
          <TransactionsList transactions={[]} />
        </div>
      </RightPart>
    </Wrapper>
  );
};
