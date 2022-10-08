import styled from 'styled-components';

type IDiv = {
  connected?: boolean;
  size?: number;
};

export const Wrapper = styled.div<IDiv>`
  width: fit-content;
  border: 2px;
  height: ${(props) => (props.size ? `${props.size}px` : '40px')};
  border-radius: 50px;
  padding: 2px;
  transform: translateX(-8px);
`;
