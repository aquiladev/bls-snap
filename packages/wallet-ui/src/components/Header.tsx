import { useCallback } from 'react';
import styled, { useTheme } from 'styled-components';
import { useAppDispatch } from '../hooks/redux';
import { resetNetwork } from '../slices/networkSlice';
import {
  resetWallet,
  setForceReconnect,
  setWalletConnection,
} from '../slices/walletSlice';
import { getThemePreference } from '../utils';
import { SnapLogo } from './SnapLogo';
import { Toggle } from './Toggle';
import { Button } from './ui/Button';
import { PopperTooltip } from './ui/PopperTooltip';
import { AccountDetailButton } from './ui/SideBar/SideBar.style';

const HeaderWrapper = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: ${(props) => props.theme.spacing.small};
`;

const Title = styled.p`
  font-size: ${(props) => props.theme.fontSizes.title};
  font-weight: bold;
  margin: 0;
  margin-left: 1.2rem;
  ${({ theme }) => theme.mediaQueries.small} {
    display: none;
  }
`;

const LogoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const RightContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const Header = ({
  handleToggleClick,
}: {
  handleToggleClick(): void;
}) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const disconnect = useCallback(() => {
    dispatch(setWalletConnection(false));
    dispatch(setForceReconnect(true));
    dispatch(resetWallet());
    dispatch(resetNetwork());
  }, []);

  return (
    <HeaderWrapper>
      <LogoWrapper>
        <SnapLogo color={theme.colors.icon.default} size={36} />
        <Title>BLS Snap</Title>
      </LogoWrapper>
      <RightContainer>
        <Toggle
          onToggle={handleToggleClick}
          defaultChecked={getThemePreference()}
        />
        <PopperTooltip
          arrowVisible={false}
          closeTrigger="click"
          offSet={[0, 0]}
          content={
            <AccountDetailButton
              backgroundTransparent
              iconLeft="right-to-bracket"
              onClick={disconnect}
            >
              Disconnect
            </AccountDetailButton>
          }
        >
          <Button iconLeft="bars" onlyIcon />
        </PopperTooltip>
      </RightContainer>
    </HeaderWrapper>
  );
};
