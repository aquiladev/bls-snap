import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { theme, Variant } from '../../../config/theme';

type NewType = boolean;

type Idiv = {
  variant: Variant;
  isMultiline: NewType;
};

export const Wrapper = styled.div<Idiv>`
  display: flex;
  align-items: ${(props) => (props.isMultiline ? 'flex-start' : 'center')};
  background-color: ${(props) => {
    switch (props.variant) {
      case 'success':
        return theme.palette.success.light;

      case 'error':
        return theme.palette.error.light;

      case 'info':
        return theme.palette.info.light;

      default:
        return theme.palette.warning.light;
    }
  }};
  border-radius: 4px;
  width: 90%;
  padding: 0rem 0.75rem;
  color: ${(props) => {
    switch (props.variant) {
      case 'success':
        return theme.palette.success.dark;

      case 'error':
        return theme.palette.error.main;

      case 'info':
        return theme.palette.info.dark;

      default:
        return theme.palette.warning.main;
    }
  }};
  margin: 0rem auto;
  padding-top: 12px;
  padding-bottom: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Parag = styled.p`
  margin-left: 1rem;
  font-style: normal;
  font-weight: 400;
  font-size: ${(props) => props.theme.fontSizes.small};
  line-height: 140%;
  margin-top: 0;
  margin-bottom: 0;
`;

export const Icon = styled(FontAwesomeIcon)`
  font-size: ${(props) => props.theme.typography.i3.fontSize};
`;
