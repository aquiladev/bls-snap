import { Transaction } from 'bls-snap/src/types/snapState';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../../hooks/redux';
import { AssetQuantity } from '../../AssetQuantity';
import {
  Column,
  Description,
  IconStyled,
  Label,
  Left,
  LeftIcon,
  Middle,
  Right,
  Status,
  Wrapper,
} from './TransactionListItem.style';
import {
  getIcon,
  getTxnDate,
  getTxnName,
  getTxnStatus,
  getTxnToFromLabel,
  getTxnValues,
} from './types';

type Props = {
  transaction: Transaction;
};

export const TransactionListItemView = ({ transaction }: Props) => {
  const wallet = useAppSelector((state) => state.wallet);
  const [currencySymbol, setCurrencySymbol] = useState('N/A');
  const [txnValue, setTxnValue] = useState('0');
  const [txnUsdValue, setTxnUsdValue] = useState('0.00');

  useEffect(() => {
    const fetchData = async () => {
      const foundToken = wallet.erc20TokenBalances.find((token) =>
        ethers.BigNumber.from(token.address).eq(
          ethers.BigNumber.from(transaction.contractAddress),
        ),
      );
      if (foundToken) {
        const txnValues = getTxnValues(
          transaction,
          foundToken.decimals,
          foundToken.usdPrice,
        );
        setTxnValue(txnValues.txnValue);
        setTxnUsdValue(txnValues.txnUsdValue);
        setCurrencySymbol(foundToken.symbol);
      }
    };
    fetchData();
  }, []);

  const txnName = getTxnName(transaction);
  const txnDate = getTxnDate(transaction);
  const txnStatus = getTxnStatus(transaction);
  const txnToFromLabel = getTxnToFromLabel(transaction);

  return (
    <Wrapper>
      <Left>
        <LeftIcon>
          <IconStyled transactionname={txnName} icon={getIcon(txnName)} />
        </LeftIcon>
        <Column>
          <Label>{txnName}</Label>
          <Description>
            {txnDate}
            <Status status={txnStatus}> . {txnStatus}</Status>
          </Description>
        </Column>
      </Left>
      <Middle>{txnToFromLabel} </Middle>
      <Right>
        {txnName !== 'Deploy' && (
          <AssetQuantity
            currency={currencySymbol}
            currencyValue={txnValue}
            USDValue={txnUsdValue}
          />
        )}
      </Right>
    </Wrapper>
  );
};
