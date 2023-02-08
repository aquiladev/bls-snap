import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { setInfoModalVisible } from '../../../slices/UISlice';
import { Button } from '../Button';
import { Wrapper, Normal, Bold } from './NewAccountDetailsInfoModal.style';

type Props = {
  address: string;
};

export const NewAccountDetailsInfoModalView = ({ address }: Props) => {
  const networks = useAppSelector((state) => state.networks);
  const dispatch = useAppDispatch();

  return (
    <Wrapper>
      <div>
        <Normal>Network</Normal>
        <Bold>{networks?.items[networks?.activeNetwork]?.name}</Bold>
      </div>

      <div>
        <Normal>Bls account</Normal>
        <Bold>{address}</Bold>
      </div>

      <div>
        <Normal>Info</Normal>
        <Normal>
          This account was generated with your MetaMask Secret Recovery Phrase
        </Normal>
      </div>

      <Button onClick={() => dispatch(setInfoModalVisible(false))}>OK</Button>
    </Wrapper>
  );
};
