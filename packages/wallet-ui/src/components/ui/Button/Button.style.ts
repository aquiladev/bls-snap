import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Variant, VariantOptions } from '../../../config/theme';

type IButtonProps = {
  variant?: Variant;
  enabled?: boolean;
  backgroundTransparent?: boolean;
  borderVisible?: boolean;
};

type ITextWrapper = {
  fontSize?: string;
  upperCaseOnly?: boolean;
  hasIcons: boolean;
};

export const Wrapper = styled.button<IButtonProps>`
  opacity: ${(props) => (props.disabled ? '50%' : '100%')};
  border-radius: 100px;
  border-width: 2px;
  border-style: ${(props) => (props.borderVisible ? 'solid' : 'none')};
  cursor: ${(props) => (props.disabled ? 'initial' : 'pointer')};
  height: 44px;
  min-width: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0px 26px;
  transition: 0.1s all;
  margin: ${(props) => props.theme.spacing.tiny};

  :active {
    opacity: 0.5;
  }
`;

export const TextWrapper = styled.span<ITextWrapper>`
  font-size: ${(props) => props.fontSize || props.theme.typography.p2.fontSize};
  margin-left: ${(props) => props.theme.spacing.tiny2};
  margin-right: ${(props) => props.theme.spacing.tiny2};
`;

export const LeftIcon = styled(FontAwesomeIcon)`
  font-size: ${(props) => props.theme.typography.i3.fontSize};
`;

export const RightIcon = styled(FontAwesomeIcon)`
  font-size: ${(props) => props.theme.typography.i3.fontSize};
`;
