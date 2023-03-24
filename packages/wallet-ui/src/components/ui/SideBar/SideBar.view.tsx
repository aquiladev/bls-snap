import { useRef, useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { AccountAddress } from '../AccountAddress';
import { AccountDetailsModal } from '../AccountDetailsModal';
import { AssetsList } from '../AssetsList';
import { setAddTokenModalVisible } from '../../../slices/UISlice';
import { useBLSSnap } from '../../../services/useBLSSnap';
import { AccountsList } from '../AccountsList';

import {
  AccountDetailButton,
  AccountDetails,
  AccountDetailsContent,
  AccountImageStyled,
  AccountLabel,
  AddTokenButton,
  CreateAccountButton,
  DivList,
  PopInStyled,
  RowDiv,
  Wrapper,
} from './SideBar.style';

type Props = {
  address: string;
  accountName: string;
};

export const SideBarView = ({ address, accountName }: Props) => {
  const [accountDetailsOpen, setAccountDetailsOpen] = useState(false);
  const wallet = useAppSelector((state) => state.wallet);
  const dispatch = useAppDispatch();
  const { createAccount } = useBLSSnap();
  const networks = useAppSelector((state) => state.networks);
  const chainId = networks.items[networks.activeNetwork]?.chainId;

  const ref = useRef<HTMLDivElement>();

  return (
    <Wrapper>
      <PopInStyled
        isOpen={accountDetailsOpen}
        setIsOpen={setAccountDetailsOpen}
      >
        <AccountDetailsModal address={address} accountName={accountName} />
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
              style={{ paddingLeft: '8px' }}
              onClick={() => setAccountDetailsOpen(true)}
            >
              Account details
            </AccountDetailButton>
            <AccountsList />
            <CreateAccountButton
              backgroundTransparent
              onClick={() => createAccount(chainId)}
            >
              + Create account
            </CreateAccountButton>
          </AccountDetailsContent>
        }
      >
        <AccountImageStyled address={address} connected={wallet.connected} />
      </AccountDetails>

      <AccountLabel>{accountName}</AccountLabel>
      <RowDiv>
        <AccountAddress address={address} />
      </RowDiv>
      <DivList ref={ref as any}>
        <AssetsList />
      </DivList>
      <AddTokenButton
        backgroundTransparent
        onClick={() => dispatch(setAddTokenModalVisible(true))}
      >
        Add token
      </AddTokenButton>
    </Wrapper>
  );
};
