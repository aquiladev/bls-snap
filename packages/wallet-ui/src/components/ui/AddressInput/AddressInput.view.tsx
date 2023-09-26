import { ethers } from 'ethers';
import {
  ChangeEvent,
  Dispatch,
  InputHTMLAttributes,
  SetStateAction,
  useRef,
  useState,
} from 'react';
import { HelperText } from '../HelperText';
import { Label } from '../Label';
import {
  Icon,
  Input,
  InputContainer,
  Left,
  RowWrapper,
  Wrapper,
} from './AddressInput.style';

type Props = {
  label?: string;
  setIsValidAddress?: Dispatch<SetStateAction<boolean>>;
} & InputHTMLAttributes<HTMLInputElement>;

export const AddressInputView = ({
  disabled,
  onChange,
  label,
  setIsValidAddress,
  ...otherProps
}: Props) => {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const [valid, setValid] = useState(false);

  const displayIcon = () => {
    return valid || error !== '';
  };

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    // Check if valid address
    onChange?.(event);

    if (!inputRef.current) {
      return;
    }
    const isValid =
      inputRef.current.value !== '' &&
      ethers.utils.isAddress(inputRef.current.value);
    if (isValid) {
      setValid(true);
      setError('');
    } else {
      setValid(false);
      setError('Invalid address format');
    }

    if (setIsValidAddress) {
      setIsValidAddress(isValid);
    }
  };

  return (
    <Wrapper>
      <RowWrapper>
        <Label error={Boolean(error)}>{label}</Label>
      </RowWrapper>

      <InputContainer
        error={Boolean(error)}
        disabled={disabled}
        focused={focused}
        withIcon={displayIcon()}
      >
        <Left>
          {displayIcon() && (
            <Icon
              icon={error ? ['fas', 'times-circle'] : ['fas', 'check-circle']}
              error={error}
            />
          )}
          <Input
            error={Boolean(error)}
            disabled={disabled}
            focused={focused}
            withIcon={displayIcon()}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            ref={inputRef}
            onChange={(event) => handleOnChange(event)}
            {...otherProps}
          />
        </Left>
      </InputContainer>
      {error && <HelperText>{error}</HelperText>}
    </Wrapper>
  );
};
