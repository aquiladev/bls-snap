import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { hideNewAccountDetailsInfoModal } from '../../../slices/UISlice';
import { Button } from '../Button';
import {
  AddressCopy,
  ModalWrapper,
  InfoRow,
  InfoDiv,
  Wrapper,
} from './NewAccountDetailsInfoModal.style';

type Props = {
  address: string;
};

export const NewAccountDetailsInfoModalView = ({ address }: Props) => {
  const networks = useAppSelector((state) => state.networks);
  const dispatch = useAppDispatch();

  return (
    <ModalWrapper>
      <Wrapper>
        <InfoDiv>
          <InfoRow>Network:</InfoRow>
          <InfoRow>{networks?.items[networks?.activeNetwork]?.name}</InfoRow>
        </InfoDiv>

        <InfoDiv>
          <InfoRow>Bls account:</InfoRow>
          <InfoRow>
            <AddressCopy address={address} />
          </InfoRow>
        </InfoDiv>

        <InfoDiv>
          <InfoRow>Info:</InfoRow>
          <InfoRow>
            This account was generated with your MetaMask Secret Recovery Phrase
          </InfoRow>
        </InfoDiv>

        <Button onClick={() => dispatch(hideNewAccountDetailsInfoModal())}>
          OK
        </Button>
      </Wrapper>
    </ModalWrapper>
  );
};
