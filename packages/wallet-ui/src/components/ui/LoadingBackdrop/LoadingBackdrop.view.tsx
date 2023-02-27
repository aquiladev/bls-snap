import { ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Backdrop } from '../Backdrop';
import { Wrapper } from './LoadingBackdrop.style';

type Props = {
  children?: ReactNode;
};

export const LoadingBackdropView = ({ children }: Props) => {
  return (
    <>
      <Backdrop />
      <Wrapper>
        <FontAwesomeIcon icon="spinner" pulse style={{ fontSize: 36 }} />
        <h3 style={{ margin: 4 }}>{children}</h3>
      </Wrapper>
    </>
  );
};
