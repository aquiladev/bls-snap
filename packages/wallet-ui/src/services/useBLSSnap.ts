/* eslint-disable consistent-return */
import { ethers } from 'ethers';
import Toastr from 'toastr2';
import semver from 'semver/preload';
import { Erc20Token, Transaction } from 'bls-snap/src/types/snapState';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import {
  setForceReconnect,
  setWalletConnection,
  setErc20TokenBalanceSelected,
  setAccounts,
  setErc20TokenBalances,
  upsertErc20TokenBalance,
  addWalletOp,
  setTransactions,
  cleanWalletOp,
  addTransaction,
} from '../slices/walletSlice';
import { Account, Erc20TokenBalance, Network, Operation } from '../types';
import { disableLoading, enableLoadingWithMessage } from '../slices/UISlice';
import { setNetworks } from '../slices/networkSlice';
import { addMissingPropertiesToToken } from '../utils/utils';
import { getAssetPriceUSD } from './coinGecko';

export const useBLSSnap = () => {
  const dispatch = useAppDispatch();
  const { activeNetwork } = useAppSelector((state) => state.networks);
  const { erc20TokenBalances, transactions } = useAppSelector(
    (state) => state.wallet,
  );
  const { loader } = useAppSelector((state) => state.UI);

  const { ethereum } = window as any;
  const snapId = process.env.REACT_APP_SNAP_ID
    ? process.env.REACT_APP_SNAP_ID
    : 'local:http://localhost:8080/';
  const snapVersion = process.env.REACT_APP_SNAP_VERSION
    ? process.env.REACT_APP_SNAP_VERSION
    : '*';
  const minSnapVersion = process.env.REACT_APP_MIN_SNAP_VERSION
    ? process.env.REACT_APP_MIN_SNAP_VERSION
    : '0.1.0';

  const connectToSnap = () => {
    dispatch(enableLoadingWithMessage('Connecting...'));
    ethereum
      .request({
        method: 'wallet_enable',
        params: [
          {
            wallet_snap: { [snapId]: { version: snapVersion } },
          },
        ],
      })
      .then(() => {
        dispatch(setWalletConnection(true));
        dispatch(setForceReconnect(false));
      })
      .catch(() => {
        dispatch(setWalletConnection(false));
        dispatch(disableLoading());
      });
  };

  const checkConnection = () => {
    dispatch(enableLoadingWithMessage('Connecting...'));
    ethereum
      .request({
        method: 'wallet_invokeSnap',
        params: [
          snapId,
          {
            method: 'ping',
          },
        ],
      })
      .then(() => {
        dispatch(setWalletConnection(true));
      })
      .catch((err: any) => {
        dispatch(setWalletConnection(false));
        dispatch(disableLoading());
        // eslint-disable-next-line no-console
        console.log(err);
      });
  };

  const getNetworks = async () => {
    const data = (await ethereum.request({
      method: 'wallet_invokeSnap',
      params: [
        snapId,
        {
          method: 'bls_getStoredNetworks',
        },
      ],
    })) as Network[];
    return data;
  };

  const oldVersionDetected = async () => {
    const snaps = await ethereum.request({ method: 'wallet_getSnaps' });
    if (typeof snaps[snapId]?.version !== 'undefined') {
      return semver.lt(snaps[snapId]?.version, minSnapVersion);
    }
    return false;
  };

  const addAccount = async (chainId: string) => {
    dispatch(enableLoadingWithMessage('Creating account...'));
    const data = (await ethereum.request({
      method: 'wallet_invokeSnap',
      params: [
        snapId,
        {
          method: 'bls_createAccount',
          params: {
            chainId,
          },
        },
      ],
    })) as Account;
    return data;
  };

  const getTokens = async (chainId: string) => {
    const tokens = (await ethereum.request({
      method: 'wallet_invokeSnap',
      params: [
        snapId,
        {
          method: 'bls_getStoredErc20Tokens',
          params: {
            chainId,
          },
        },
      ],
    })) as Erc20Token[];
    return tokens;
  };

  const getTokenBalance = async (
    tokenAddress: string,
    userAddress: string,
    chainId: string,
  ) => {
    const response = await ethereum.request({
      method: 'wallet_invokeSnap',
      params: [
        snapId,
        {
          method: 'bls_getErc20TokenBalance',
          params: {
            tokenAddress,
            userAddress,
            chainId,
          },
        },
      ],
    });
    return response;
  };

  const setErc20TokenBalance = (erc20TokenBalance: Erc20TokenBalance) => {
    dispatch(setErc20TokenBalanceSelected(erc20TokenBalance));
  };

  const getWalletData = async (chainId: string, networks?: Network[]) => {
    if (!loader.isLoading && !networks) {
      dispatch(enableLoadingWithMessage('Getting network data ...'));
    }
    // let acc: Account[] | Account = await recoverAccounts(chainId);
    // if (!acc || acc.length === 0 || !acc[0].address) {
    //   acc = await addAccount(chainId);
    // }

    const acc: Account = await addAccount(chainId);
    dispatch(setAccounts(acc));

    const tokens = await getTokens(chainId);
    console.log('Tokens', tokens);
    const tokenBalances = await Promise.all(
      tokens.map(async (token) => {
        const accountAddr = Array.isArray(acc) ? acc[0].address : acc.address;
        return await getTokenBalance(token.address, accountAddr, chainId);
      }),
    );

    const tokenUSDPrices = await Promise.all(
      tokens.map(async (token) => {
        return await getAssetPriceUSD(token);
      }),
    );

    const tokensWithBalances = tokens.map((token, index): Erc20TokenBalance => {
      return addMissingPropertiesToToken(
        token,
        tokenBalances[index],
        tokenUSDPrices[index],
      );
    });
    if (networks) {
      dispatch(setNetworks(networks));
    }
    dispatch(setErc20TokenBalances(tokensWithBalances));

    if (tokensWithBalances.length > 0) {
      setErc20TokenBalance(tokensWithBalances[0]);
    }

    // if (!Array.isArray(acc)) {
    //   dispatch(setInfoModalVisible(true));
    // }
    dispatch(disableLoading());
  };

  const initSnap = async () => {
    if (await oldVersionDetected()) {
      dispatch(disableLoading());
      return;
    }

    if (!loader.isLoading) {
      dispatch(enableLoadingWithMessage('Initializing wallet...'));
    }

    try {
      const nets = await getNetworks();
      if (nets.length === 0) {
        return;
      }
      const { chainId } = nets[activeNetwork];
      await getWalletData(chainId, nets);
    } catch (err: any) {
      if (err.code && err.code === 4100) {
        const toastr = new Toastr();
        toastr.error('Snap is unaccessible or unauthorized');
        dispatch(setWalletConnection(false));
      }
      // eslint-disable-next-line no-console
      console.error('Error while Initializing wallet', err);
    } finally {
      dispatch(disableLoading());
    }
  };

  const refreshTokensUSDPrice = async () => {
    if (erc20TokenBalances.length > 0) {
      const tokenUSDPrices = await Promise.all(
        erc20TokenBalances.map(async (token) => {
          return await getAssetPriceUSD(token);
        }),
      );

      const tokensRefreshed = erc20TokenBalances.map(
        (token, index): Erc20TokenBalance => {
          return {
            ...token,
            usdPrice: tokenUSDPrices[index],
          };
        },
      );
      dispatch(setErc20TokenBalances(tokensRefreshed));
    }
  };

  const updateTokenBalance = async (
    tokenAddress: string,
    accountAddress: string,
    chainId: string,
  ) => {
    const foundTokenWithBalance = erc20TokenBalances.find(
      (tokenBalance) =>
        ethers.BigNumber.from(tokenBalance.address).eq(
          ethers.BigNumber.from(tokenAddress),
        ) &&
        ethers.BigNumber.from(tokenBalance.chainId).eq(
          ethers.BigNumber.from(chainId),
        ),
    );
    if (foundTokenWithBalance) {
      const tokenBalance = await getTokenBalance(
        tokenAddress,
        accountAddress,
        chainId,
      );
      const usdPrice = await getAssetPriceUSD(foundTokenWithBalance);
      const tokenWithBalance: Erc20TokenBalance = addMissingPropertiesToToken(
        foundTokenWithBalance,
        tokenBalance,
        usdPrice,
      );
      dispatch(upsertErc20TokenBalance(tokenWithBalance));
    }
  };

  async function addOp(address: string) {
    const provider = new ethers.providers.JsonRpcProvider(
      'https://goerli-rollup.arbitrum.io/rpc',
    );
    const erc20Address = '0x5081a39b8A5f0E35a8D959395a630b68B74Dd30f';
    const erc20Abi = ['function mint(address to, uint amount) returns (bool)'];
    const erc20 = new ethers.Contract(erc20Address, erc20Abi, provider);

    const response = await ethereum.request({
      method: 'wallet_invokeSnap',
      params: [
        snapId,
        {
          method: 'bls_addOp',
          params: {
            contractAddress: erc20Address,
            encodedFunction: erc20.interface.encodeFunctionData('mint', [
              address,
              ethers.utils.parseUnits('1', 18),
            ]),
          },
        },
      ],
    });
    dispatch(addWalletOp(response));
    return response;
  }

  const getOps = async () => {
    const data = (await ethereum.request({
      method: 'wallet_invokeSnap',
      params: [
        snapId,
        {
          method: 'bls_getOps',
        },
      ],
    })) as Operation[];
    return data;
  };

  const getTransactions = async (
    senderAddress: string,
    contractAddress: string,
    pageSize: number,
    txnsInLastNumOfDays: number,
    chainId: string,
    showLoading = true,
    onlyFromState = false,
  ) => {
    if (showLoading) {
      dispatch(enableLoadingWithMessage('Retrieving transactions...'));
    }

    try {
      const data = await ethereum.request({
        method: 'wallet_invokeSnap',
        params: [
          snapId,
          {
            method: 'bls_getTransactions',
            params: {
              senderAddress,
              contractAddress,
              pageSize,
              txnsInLastNumOfDays,
              onlyFromState,
              withDeployTxn: true,
              chainId,
            },
          },
        ],
      });

      let storedTxns = data;
      if (onlyFromState) {
        // Filter out stored txns that are not found in the retrieved txns
        const filteredTxns = transactions.filter((txn: Transaction) => {
          return !storedTxns.find((storedTxn: Transaction) =>
            ethers.BigNumber.from(storedTxn.txHash).eq(
              ethers.BigNumber.from(txn.txHash),
            ),
          );
        });

        // // sort in timestamp descending order
        // storedTxns = [...storedTxns, ...filteredTxns].sort(
        //   (a: Transaction, b: Transaction) => b.timestamp - a.timestamp,
        // );
        storedTxns = [...storedTxns, ...filteredTxns];
      }

      dispatch(setTransactions(storedTxns));

      if (showLoading) {
        dispatch(disableLoading());
      }
      return data;
    } catch (err) {
      dispatch(disableLoading());
      dispatch(setTransactions([]));
      console.error(err);
    }
  };

  const sendBundle = async () => {
    const data = await ethereum.request({
      method: 'wallet_invokeSnap',
      params: [
        snapId,
        {
          method: 'bls_sendBundle',
        },
      ],
    });
    console.log('sendBundle', data);
    dispatch(cleanWalletOp());
    dispatch(addTransaction({ txHash: data.hash }));
    return data;
  };

  return {
    connectToSnap,
    getNetworks,
    checkConnection,
    initSnap,
    satisfiesVersion: oldVersionDetected,
    getWalletData,
    setErc20TokenBalance,
    refreshTokensUSDPrice,
    updateTokenBalance,
    addOp,
    getOps,
    getTransactions,
    sendBundle,
  };
};
