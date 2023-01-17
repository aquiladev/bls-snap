import { useRef, useState } from 'react';
import { useAppSelector } from '../../../hooks/redux';
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

  const ref = useRef<HTMLDivElement>();

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
