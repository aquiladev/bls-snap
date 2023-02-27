import { useTheme } from 'styled-components';

import {
  ConnectButton,
  DescriptionCentered,
  Title,
  Wrapper,
} from './NoFlaskModal.style';

export const NoFlaskModalView = () => {
  const theme = useTheme();

  return (
    <Wrapper>
      <Title>You don't have the MetaMask Flask extension</Title>
      <DescriptionCentered>
        {
          'You need to install MetaMask Flask extension in order to use the BLS Wallet Snap.'
        }
      </DescriptionCentered>
      <a
        href="https://metamask.io/flask"
        target="_blank"
        rel="noreferrer noopener"
      >
        <ConnectButton>Download MetaMask Flask</ConnectButton>
      </a>
    </Wrapper>
  );
};
