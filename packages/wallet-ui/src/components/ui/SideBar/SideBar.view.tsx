import { useCallback, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { resetNetwork } from '../../../slices/networkSlice';
import {
  resetWallet,
  setForceReconnect,
  setWalletConnection,
} from '../../../slices/walletSlice';
import { AccountAddress } from '../AccountAddress';
import { AccountDetailsModal } from '../AccountDetailsModal';
import { AssetsList } from '../AssetsList';

import {
  AccountDetailButton,
  AccountDetails,
  AccountDetailsContent,
  AccountImageStyled,
  AccountLabel,
  DivList,
  PopInStyled,
  RowDiv,
  Wrapper,
} from './SideBar.style';

type Props = {
  address: string;
};

export const SideBarView = ({ address }: Props) => {
  const [accountDetailsOpen, setAccountDetailsOpen] = useState(false);
  const wallet = useAppSelector((state) => state.wallet);
  const dispatch = useAppDispatch();

  const ref = useRef<HTMLDivElement>();

  const disconnect = useCallback(() => {
    dispatch(setWalletConnection(false));
    dispatch(setForceReconnect(true));
    dispatch(resetWallet());
    dispatch(resetNetwork());
  }, []);

  return (
    <Wrapper>
      <PopInStyled
        isOpen={accountDetailsOpen}
        setIsOpen={setAccountDetailsOpen}
      >
        <AccountDetailsModal address={address} />
      </PopInStyled>
      <AccountDetails
        arrowVisible={false}
        closeTrigger="click"
        offSet={[60, 0]}
        content={
          <AccountDetailsContent>
            <AccountDetailButton
              backgroundTransparent
              iconLeft="qrcode"
              onClick={() => setAccountDetailsOpen(true)}
            >
              Account details
            </AccountDetailButton>
            <AccountDetailButton
              backgroundTransparent
              iconLeft="right-to-bracket"
              onClick={() => disconnect()}
            >
              Disconnect
            </AccountDetailButton>
          </AccountDetailsContent>
        }
      >
        <AccountImageStyled address={address} connected={wallet.connected} />
      </AccountDetails>

      <AccountLabel>My account</AccountLabel>
      <RowDiv>
        <AccountAddress address={address} />
      </RowDiv>
      <DivList ref={ref as any}>
        <AssetsList />
      </DivList>
    </Wrapper>
  );
};
