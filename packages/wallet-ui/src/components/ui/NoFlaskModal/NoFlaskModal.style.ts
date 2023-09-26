import styled from 'styled-components';

import { Button } from '../Button';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.colors.background.default};
  width: ${(props) => props.theme.modal.base};
  padding: ${(props) => props.theme.spacing.base};
  padding-top: 40px;
  border-radius: 8px;
  align-items: center;
  a {
    all: unset;
  }
`;

export const Title = styled.div`
  text-align: center;
  font-size: ${(props) => props.theme.typography.h3.fontSize};
  font-weight: ${(props) => props.theme.typography.h3.fontWeight};
  line-height: ${(props) => props.theme.typography.h3.lineHeight};
  margin-top: 16px;
  margin-bottom: 8px;
`;

const Description = styled.div`
  font-size: ${(props) => props.theme.typography.p2.fontSize};
  color: ${(props) => props.theme.palette.grey.grey1};
`;

export const DescriptionCentered = styled(Description)`
  text-align: center;
  margin-bottom: 20px;
  width: 264px;
`;

export const ConnectButton = styled(Button).attrs((props) => ({
  textStyle: {
    fontSize: props.theme.typography.p1.fontSize,
    fontWeight: 900,
  },
  upperCaseOnly: false,
  backgroundTransparent: true,
}))`
  box-shadow: 0px 14px 24px -6px rgba(106, 115, 125, 0.2);
  padding-top: 16px;
  padding-bottom: 16px;
`;
