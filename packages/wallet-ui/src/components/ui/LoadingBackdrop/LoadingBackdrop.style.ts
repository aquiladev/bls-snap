import styled from 'styled-components';

export const Wrapper = styled.div`
  color: ${(props) => props.theme.colors.text.default}};
  font-size: ${(props) => props.theme.fontSizes.xLarge};
  font-weight: 900;
  line-height: 67.2px;
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  white-space: nowrap;
`;
