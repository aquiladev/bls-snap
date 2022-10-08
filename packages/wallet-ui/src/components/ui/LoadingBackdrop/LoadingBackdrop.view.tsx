import React, { ReactNode } from 'react';
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
        <FontAwesomeIcon icon="spinner" pulse />
        <h3>{children}</h3>
      </Wrapper>
    </>
  );
};
