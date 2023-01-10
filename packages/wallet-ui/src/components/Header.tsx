import styled, { useTheme } from 'styled-components';
import { getThemePreference } from '../utils';
import { SnapLogo } from './SnapLogo';
import { Toggle } from './Toggle';

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
      </RightContainer>
    </HeaderWrapper>
  );
};
