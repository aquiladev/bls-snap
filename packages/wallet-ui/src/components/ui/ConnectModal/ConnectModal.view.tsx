import { useBLSSnap } from '../../../services/useBLSSnap';
import {
  ConnectButton,
  Description,
  DescriptionCentered,
  FlaskIcon,
  Title,
  WhatIsSnap,
  WhatIsSnapDiv,
  Wrapper,
} from './ConnectModal.style';

export const ConnectModalView = () => {
  const { connectToSnap } = useBLSSnap();

  return (
    <Wrapper>
      <Title>
        Connect to MetaMask<br></br> BLS Snap
      </Title>
      <DescriptionCentered>
        If you do not have the BLS snap installed you will be prompted to
        install it.
      </DescriptionCentered>
      <WhatIsSnapDiv>
        <WhatIsSnap>What is a snap?</WhatIsSnap>
        <Description>
          Snaps extend the capabilities of MetaMask by adding new
          functionalities.
        </Description>
      </WhatIsSnapDiv>
      <ConnectButton customIconLeft={<FlaskIcon />} onClick={connectToSnap}>
        Connect with MetaMask Flask
      </ConnectButton>
    </Wrapper>
  );
};
