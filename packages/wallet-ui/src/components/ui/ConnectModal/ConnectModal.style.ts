import styled from 'styled-components';
import foxIconSrc from '../../../assets/flask_fox.svg';
import { Button } from '../Button';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.colors.card.default};
  padding: 20px;
  padding-top: 40px;
  border-radius: 8px;
  align-items: center;
`;

export const Title = styled.div`
  text-align: center;
  margin-bottom: 8px;
`;

export const Description = styled.div`
  color: ${(props) => props.theme.colors.text.default}};
`;

export const DescriptionCentered = styled(Description)`
  text-align: center;
  width: 264px;
`;

export const WhatIsSnapDiv = styled.div`
  margin-top: 32px;
  margin-bottom: 24px;
  padding: 24px;
  width: 100%;
  align-items: center;
  display: flex;
  flex-direction: column;
`;

export const WhatIsSnap = styled.div`
  margin-bottom: 12px;
`;

export const ReadMore = styled.div`
  margin-top: 12px;
  cursor: pointer;
`;

export const ConnectButton = styled(Button).attrs(() => ({
  textStyle: {
    fontWeight: 900,
  },
  upperCaseOnly: false,
  backgroundTransparent: true,
}))`
  box-shadow: 0px 14px 24px -6px rgba(106, 115, 125, 0.2);
  padding-top: 16px;
  padding-bottom: 16px;
`;

export const FlaskIcon = styled.img.attrs(() => ({
  src: foxIconSrc,
}))`
  margin-right: 8px;
`;
