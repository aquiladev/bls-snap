import { ethers } from 'ethers';
import { useEffect, useRef, useState } from 'react';
import { TOKEN_BALANCE_REFRESH_FREQUENCY } from '../../../utils/constants';
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
  const [isLoading, setIsLoading] = useState(false);

  const networks = useAppSelector((state) => state.networks);
  const wallet = useAppSelector((state) => state.wallet);
  const { updateTokenBalance, addAction } = useBLSSnap();
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
        const activeAddress = wallet.accounts[wallet.activeAccount]?.address;
        await updateTokenBalance(
          wallet.erc20TokenBalanceSelected.address,
          activeAddress,
          chainId,
        );
      }, TOKEN_BALANCE_REFRESH_FREQUENCY);
      return () => clearTimeout(timeoutHandle.current);
    }
  }, [wallet.erc20TokenBalanceSelected, wallet.activeAccount]);

  const handleSendClick = () => {
    setSendOpen(true);
  };

  const handleMintClick = async () => {
    setIsLoading(true);

    try {
      const { chainId } = networks.items[networks.activeNetwork];
      const senderAddress = wallet.accounts[wallet.activeAccount].address;
      const contractAddress = wallet.erc20TokenBalanceSelected.address;

      const erc20Abi = [
        'function mint(address to, uint amount) returns (bool)',
      ];
      const erc20Contract = new ethers.Contract(contractAddress, erc20Abi);
      const encodedFunction = erc20Contract.interface.encodeFunctionData(
        'mint',
        [senderAddress, ethers.utils.parseUnits('0.5', 18)],
      );
      const functionFragment = erc20Contract.interface
        .getFunction('mint')
        .format('minimal');

      await addAction(
        senderAddress,
        contractAddress,
        encodedFunction,
        functionFragment,
        chainId,
      );
    } finally {
      setIsLoading(false);
    }
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
          disabled={isLoading}
          onClick={() => handleSendClick()}
          backgroundTransparent
          borderVisible
        >
          Send
        </Button>
        {wallet.erc20TokenBalanceSelected.isInternal && (
          <Button
            variant="secondary"
            disabled={isLoading}
            onClick={() => handleMintClick()}
          >
            (Faucet) Mint 0.5 tokens
          </Button>
        )}
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
