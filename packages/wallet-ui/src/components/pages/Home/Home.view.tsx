import { useAppSelector } from '../../../hooks/redux';
import { Header } from '../../ui/Header';
import { SideBar } from '../../ui/SideBar';
import { TransactionsList } from '../../ui/TransactionsList';
import { RightPart, Wrapper } from './Home.style';

type Props = {
  address: string;
};

export const HomeView = ({ address }: Props) => {
  const { erc20TokenBalanceSelected } = useAppSelector((state) => state.wallet);
  return (
    <Wrapper>
      <SideBar address={address} />
      <RightPart>
        {Object.keys(erc20TokenBalanceSelected).length > 0 && (
          <Header address={address} />
        )}
        <TransactionsList transactions={[]} />
      </RightPart>
    </Wrapper>
  );
};
