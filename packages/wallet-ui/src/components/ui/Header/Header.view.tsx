import { ethers } from 'ethers';
import { useEffect, useRef, useState } from 'react';
import { TOKEN_BALANCE_REFRESH_FREQUENCY } from '../../../utils/constants';
// import { TransactionStatus } from 'types';
import { AssetQuantity } from '../AssetQuantity';
import { PopIn } from '../PopIn';
import { Button } from '../Button';
import { useAppSelector } from '../../../hooks/redux';
import { getAmountPrice } from '../../../utils/utils';
import { useBLSSnap } from '../../../services/useBLSSnap';
import { ReceiveModal } from './ReceiveModal';
import { SendModal } from './SendModal';
import { Buttons, Wrapper } from './Header.style';

type Props = {
  address: string;
};

export const HeaderView = ({ address }: Props) => {
  const [receiveOpen, setReceiveOpen] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);
  const networks = useAppSelector((state) => state.networks);
  const wallet = useAppSelector((state) => state.wallet);
  const { updateTokenBalance, addOperation } = useBLSSnap();
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const timeoutHandle = useRef(setTimeout(() => {}));

  const getUSDValue = (amount: number) => {
    return wallet.erc20TokenBalanceSelected.usdPrice
      ? getAmountPrice(wallet.erc20TokenBalanceSelected, amount, false)
      : '';
  };

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    const chainId = networks.items[networks.activeNetwork]?.chainId;
    if (chainId && address) {
      clearTimeout(timeoutHandle.current); // cancel the timeout that was in-flight
      timeoutHandle.current = setTimeout(async () => {
        await updateTokenBalance(
          wallet.erc20TokenBalanceSelected.address,
          address,
          chainId,
        );
      }, TOKEN_BALANCE_REFRESH_FREQUENCY);
      return () => clearTimeout(timeoutHandle.current);
    }
  }, [wallet.erc20TokenBalanceSelected]);

  const handleSendClick = () => {
    setSendOpen(true);
  };

  const handleMintClick = async () => {
    const { chainId } = networks.items[networks.activeNetwork];
    await addOperation(wallet.accounts[0].address, chainId);
  };

  const asset = wallet.erc20TokenBalanceSelected;
  const amount = ethers.utils.formatUnits(asset.amount, asset.decimals);
  return (
    <Wrapper>
      <AssetQuantity
        USDValue={getUSDValue(parseFloat(amount))}
        currencyValue={amount.toString()}
        currency={wallet.erc20TokenBalanceSelected.symbol}
        size="big"
        centered
      />
      <Buttons>
        <Button onClick={() => setReceiveOpen(true)}>Receive</Button>
        <Button
          onClick={() => handleSendClick()}
          backgroundTransparent
          borderVisible
        >
          Send
        </Button>
        <Button
          onClick={() => handleMintClick()}
          backgroundTransparent
          borderVisible
        >
          Mint 1 token
        </Button>
      </Buttons>
      <PopIn isOpen={receiveOpen} setIsOpen={setReceiveOpen}>
        <ReceiveModal address={address} />
      </PopIn>
      <PopIn isOpen={sendOpen} setIsOpen={setSendOpen}>
        <SendModal closeModal={() => setSendOpen(false)} />
      </PopIn>
    </Wrapper>
  );
};
