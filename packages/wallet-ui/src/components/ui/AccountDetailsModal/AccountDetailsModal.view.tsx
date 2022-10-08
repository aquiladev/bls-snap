import {
  AccountImageDiv,
  AccountImageStyled,
  AddressCopy,
  AddressQrCode,
  Title,
  TitleDiv,
  Wrapper,
} from './AccountDetailsModal.style';

type Props = {
  address: string;
};

export const AccountDetailsModalView = ({ address }: Props) => {
  return (
    <div>
      <AccountImageDiv>
        <AccountImageStyled size={64} address={address} />
      </AccountImageDiv>
      <Wrapper>
        <TitleDiv>
          <Title>My account</Title>
          {/* <ModifyIcon /> */}
        </TitleDiv>
        <AddressQrCode value={address} />
        <AddressCopy address={address} />
      </Wrapper>
    </div>
  );
};
