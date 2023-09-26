import { ButtonHTMLAttributes, ReactNode } from 'react';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { CSSProperties } from 'styled-components';
import { Variant } from '../../../config/theme';
import { LeftIcon, RightIcon, TextWrapper, Wrapper } from './Button.style';

type Props = {
  onClick?: (e: MouseEvent) => void;
  enabled?: boolean;
  variant?: Variant;
  iconLeft?: IconName;
  iconRight?: IconName;
  backgroundTransparent?: boolean;
  fontSize?: string;
  borderVisible?: boolean;
  upperCaseOnly?: boolean;
  textStyle?: CSSProperties;
  iconStyle?: CSSProperties;
  customIconLeft?: ReactNode;
  customIconRight?: ReactNode;
  onlyIcon?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const ButtonView = ({
  // eslint-disable-next-line no-void
  onClick = () => void 0,
  enabled = true,
  variant,
  iconLeft,
  iconRight,
  customIconLeft,
  customIconRight,
  backgroundTransparent,
  children,
  fontSize,
  borderVisible,
  upperCaseOnly = true,
  textStyle,
  iconStyle,
  onlyIcon,
  ...otherProps
}: Props) => {
  const hasIcons = iconRight !== undefined || iconLeft !== undefined;
  return (
    <Wrapper
      onClick={onClick}
      disabled={!enabled}
      backgroundTransparent={backgroundTransparent}
      borderVisible={borderVisible}
      {...otherProps}
    >
      {customIconLeft}
      {iconLeft && <LeftIcon icon={['fas', iconLeft]} style={iconStyle} />}
      {!onlyIcon && (
        <TextWrapper
          hasIcons={hasIcons}
          fontSize={fontSize}
          upperCaseOnly={upperCaseOnly}
          style={textStyle}
        >
          {children}
        </TextWrapper>
      )}
      {iconRight && <RightIcon icon={['fas', iconRight]} style={iconStyle} />}
      {customIconRight}
    </Wrapper>
  );
};
