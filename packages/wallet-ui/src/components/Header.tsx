import { useCallback } from 'react';
import styled, { useTheme } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { resetNetwork, setActiveNetwork } from '../slices/networkSlice';
import {
  resetWallet,
  setForceReconnect,
  setWalletConnection,
} from '../slices/walletSlice';
import { getThemePreference } from '../utils';
import { MenuItem, Select } from './Select';
import { PopperTooltip } from './ui/PopperTooltip';
import { AccountDetailButton } from './ui/SideBar/SideBar.style';

const HeaderWrapper = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: ${(props) => props.theme.spacing.small};
  padding-bottom: ${(props) => props.theme.spacing.small};
`;

const Title = styled.p`
  font-size: ${(props) => props.theme.fontSizes.title};
  font-weight: bold;
  margin: 0;
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
  const networks = useAppSelector((state) => state.networks);

  const disconnect = useCallback(() => {
    dispatch(setWalletConnection(false));
    dispatch(setForceReconnect(true));
    dispatch(resetWallet());
    dispatch(resetNetwork());
  }, []);

  return (
    <HeaderWrapper>
      <LogoWrapper>
        <Title>BLS Snap</Title>
      </LogoWrapper>
      <RightContainer>
        <Select
          labelId="network-select-label"
          id="network-select"
          value={networks.activeNetwork}
          onChange={(event) => {
            dispatch(setActiveNetwork(event.target.value));
          }}
        >
          {networks.items.map((network, index) => (
            <MenuItem key={index} value={index}>
              {network.name}
            </MenuItem>
          ))}
        </Select>
        <PopperTooltip
          arrowVisible={false}
          closeTrigger="click"
          offSet={[0, 0]}
          content={
            <>
              {getThemePreference() ? (
                <AccountDetailButton
                  backgroundTransparent
                  iconRight="sun"
                  onClick={handleToggleClick}
                >
                  Light theme
                </AccountDetailButton>
              ) : (
                <AccountDetailButton
                  backgroundTransparent
                  iconRight="moon"
                  onClick={handleToggleClick}
                >
                  Dark theme
                </AccountDetailButton>
              )}
              <AccountDetailButton
                backgroundTransparent
                iconRight="right-to-bracket"
                onClick={disconnect}
              >
                Disconnect
              </AccountDetailButton>
            </>
          }
        >
          <FontAwesomeIcon
            icon="bars"
            style={{ fontSize: 24, cursor: 'pointer' }}
          />
        </PopperTooltip>
      </RightContainer>
    </HeaderWrapper>
  );
};
