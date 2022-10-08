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
import { Buttons, HeaderButton, Wrapper } from './Header.style';

type Props = {
  address: string;
};

export const HeaderView = ({ address }: Props) => {
  const [receiveOpen, setReceiveOpen] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);
  const networks = useAppSelector((state) => state.networks);
  const wallet = useAppSelector((state) => state.wallet);
  const { updateTokenBalance, addOp } = useBLSSnap();
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const timeoutHandle = useRef(setTimeout(() => {}));

  const getUSDValue = () => {
    const amountFloat = parseFloat(
      ethers.utils.formatUnits(
        wallet.erc20TokenBalanceSelected.amount,
        wallet.erc20TokenBalanceSelected.decimals,
      ),
    );
    if (wallet.erc20TokenBalanceSelected.usdPrice) {
      return getAmountPrice(
        wallet.erc20TokenBalanceSelected,
        amountFloat,
        false,
      );
    }
    return '';
  };

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    const chain = networks.items[networks.activeNetwork]?.chainId;
    if (chain && address) {
      clearTimeout(timeoutHandle.current); // cancel the timeout that was in-flight
      timeoutHandle.current = setTimeout(async () => {
        await updateTokenBalance(
          wallet.erc20TokenBalanceSelected.address,
          address,
          chain,
        );
      }, TOKEN_BALANCE_REFRESH_FREQUENCY);
      return () => clearTimeout(timeoutHandle.current);
    }
  }, [wallet.erc20TokenBalanceSelected]);

  const handleSendClick = () => {
    setSendOpen(true);
  };

  const handleMintClick = async () => {
    await addOp(wallet.accounts[0].address);
  };

  return (
    <Wrapper>
      <AssetQuantity
        USDValue={getUSDValue()}
        currencyValue={wallet.erc20TokenBalanceSelected.name}
        currency={wallet.erc20TokenBalanceSelected.symbol}
        size="big"
        centered
      />
      <Buttons>
        <HeaderButton onClick={() => setReceiveOpen(true)}>
          Receive
        </HeaderButton>
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
          style={{ backgroundColor: 'grey', paddingLeft: 10 }}
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
