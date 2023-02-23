/* eslint-disable consistent-return */
import Toastr from 'toastr2';
import semver from 'semver/preload';
import { Erc20Token, Bundle } from '@aquiladev/bls-snap/src/types/snapState';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import * as ws from '../slices/walletSlice';
import { Account, Erc20TokenBalance, Network, Action } from '../types';
import {
  disableLoading,
  enableLoadingWithMessage,
  setInfoModalVisible,
} from '../slices/UISlice';
import { setNetworks } from '../slices/networkSlice';
import { addMissingPropertiesToToken } from '../utils/utils';
import { getAssetPriceUSD } from './coinGecko';

export const useBLSSnap = () => {
  const dispatch = useAppDispatch();
  const { activeNetwork } = useAppSelector((state) => state.networks);
  const { erc20TokenBalances, actions } = useAppSelector(
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
        method: 'wallet_requestSnaps',
        params: {
          [snapId]: { version: snapVersion },
        },
      })
      .then(() => {
        dispatch(ws.setWalletConnection(true));
        dispatch(ws.setForceReconnect(false));
      })
      .catch(() => {
        dispatch(ws.setWalletConnection(false));
        dispatch(disableLoading());
      });
  };

  const checkConnection = () => {
    dispatch(enableLoadingWithMessage('Connecting...'));
    ethereum
      .request({
        method: 'wallet_invokeSnap',
        params: {
          snapId,
          request: {
            method: 'ping',
          },
        },
      })
      .then(() => {
        dispatch(ws.setWalletConnection(true));
      })
      .catch((err: any) => {
        dispatch(ws.setWalletConnection(false));
        dispatch(disableLoading());
        // eslint-disable-next-line no-console
        console.log(err);
      });
  };

  const getNetworks = async () => {
    const data = (await ethereum.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId,
        request: {
          method: 'bls_getNetworks',
        },
      },
    })) as Record<number, Network>;

    return Object.values(data);
  };

  const oldVersionDetected = async () => {
    const snaps = await ethereum.request({ method: 'wallet_getSnaps' });
    if (typeof snaps[snapId]?.version !== 'undefined') {
      return semver.lt(snaps[snapId]?.version, minSnapVersion);
    }
    return false;
  };

  const recoverAccounts = async (chainId: number) => {
    dispatch(enableLoadingWithMessage('Recovering accounts...'));
    const data = (await ethereum.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId,
        request: {
          method: 'bls_recoverAccounts',
          params: {
            chainId,
          },
        },
      },
    })) as Account[];
    console.log('RecoverAccounts', data);
    return data;
  };

  const createAccount = async (chainId: number) => {
    dispatch(enableLoadingWithMessage('Creating account...'));
    const data = (await ethereum.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId,
        request: {
          method: 'bls_createAccount',
          params: {
            chainId,
          },
        },
      },
    })) as Account;
    console.log('CreateAccount', data);
    return data;
  };

  const getTokens = async (chainId: number) => {
    const tokens = (await ethereum.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId,
        request: {
          method: 'bls_getErc20Tokens',
          params: {
            chainId,
          },
        },
      },
    })) as Erc20Token[];
    return tokens;
  };

  const getTokenBalance = async (
    tokenAddress: string,
    userAddress: string,
    chainId: number,
  ) => {
    const response = await ethereum.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId,
        request: {
          method: 'bls_getErc20TokenBalance',
          params: {
            tokenAddress,
            userAddress,
            chainId,
          },
        },
      },
    });
    return response;
  };

  const setErc20TokenBalance = (erc20TokenBalance: Erc20TokenBalance) => {
    dispatch(ws.setErc20TokenBalanceSelected(erc20TokenBalance));
  };

  const refreshTokensUSDPrice = async () => {
    if (erc20TokenBalances.length > 0) {
      const tokenUSDPrices = await Promise.all(
        erc20TokenBalances.map(async (token) => {
          return await getAssetPriceUSD(token);
        }),
      );

      const networks = await getNetworks();
      const { chainId } = networks[activeNetwork];
      const tokensRefreshed = erc20TokenBalances.map(
        (token, index): Erc20TokenBalance => {
          return {
            ...token,
            chainId,
            usdPrice: tokenUSDPrices[index],
          };
        },
      );
      dispatch(ws.setErc20TokenBalances(tokensRefreshed));
    }
  };

  const updateTokenBalance = async (
    tokenAddress: string,
    accountAddress: string,
    chainId: number,
  ) => {
    const foundTokenWithBalance = erc20TokenBalances.find(
      (tokenBalance) =>
        tokenBalance.address.toLowerCase() === tokenAddress.toLowerCase() &&
        tokenBalance.chainId === chainId,
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
        chainId,
        tokenBalance,
        usdPrice,
      );
      dispatch(ws.upsertErc20TokenBalance(tokenWithBalance));
    }
  };

  const addAction = async (
    senderAddress: string,
    contractAddress: string,
    encodedFunction: string,
    functionFragment: string,
    chainId: number,
  ) => {
    const response = await ethereum.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId,
        request: {
          method: 'bls_addAction',
          params: {
            senderAddress,
            contractAddress,
            encodedFunction,
            functionFragment,
            chainId,
          },
        },
      },
    });
    dispatch(ws.addAction(response));
    return response;
  };

  const getActions = async (address: string, chainId: number) => {
    const data = (await ethereum.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId,
        request: {
          method: 'bls_getActions',
          params: {
            senderAddress: address,
            chainId,
          },
        },
      },
    })) as Action[];
    dispatch(ws.setActions(data));
    return data;
  };

  const updatePostponeAction = async (id: string, postpone: boolean) => {
    const data = {
      id,
      postpone,
    };
    dispatch(ws.updatePostponeAction(data));
    return data;
  };

  const getBundles = async (
    senderAddress: string,
    chainId: number,
    contractAddress?: string,
  ) => {
    const data = (await ethereum.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId,
        request: {
          method: 'bls_getBundles',
          params: {
            senderAddress,
            contractAddress,
            chainId,
          },
        },
      },
    })) as Bundle[];
    dispatch(ws.setBundles(data));
    return data;
  };

  const getBundle = async (
    bundleHash: string,
    chainId: number,
    showLoading = true,
  ) => {
    if (showLoading) {
      dispatch(enableLoadingWithMessage('Retrieving bundles...'));
    }

    try {
      const data = (await ethereum.request({
        method: 'wallet_invokeSnap',
        params: {
          snapId,
          request: {
            method: 'bls_getBundle',
            params: {
              bundleHash,
              chainId,
            },
          },
        },
      })) as Bundle | undefined;

      if (data) {
        dispatch(ws.updateBundle(data));
      }

      if (showLoading) {
        dispatch(disableLoading());
      }
      return data;
    } catch (err) {
      dispatch(disableLoading());
      console.error(err);
    }
  };

  const sendBundle = async (senderAddress: string, chainId: number) => {
    const data = await ethereum.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId,
        request: {
          method: 'bls_sendBundle',
          params: {
            senderAddress,
            chainId,
          },
        },
      },
    });
    dispatch(ws.addBundle({ bundleHash: data.bundleHash }));
    dispatch(ws.removeActions(actions));
    return data;
  };

  const getWalletData = async (chainId: number, networks?: Network[]) => {
    if (!loader.isLoading && !networks) {
      dispatch(enableLoadingWithMessage('Getting network data ...'));
    }

    let account: Account[] | Account = await recoverAccounts(chainId);
    if (!account || account.length === 0 || !account[0].address) {
      // eslint-disable-next-line require-atomic-updates
      account = await createAccount(chainId);
    }
    dispatch(ws.setAccounts(account));
    const accountAddr = Array.isArray(account)
      ? account[0].address
      : account.address;

    const tokens = await getTokens(chainId);
    console.log('Tokens', tokens);
    const tokenBalances = await Promise.all(
      tokens.map(async (token) => {
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
        chainId,
        tokenBalances[index],
        tokenUSDPrices[index],
      );
    });
    if (networks) {
      dispatch(setNetworks(networks));
    }
    dispatch(ws.setErc20TokenBalances(tokensWithBalances));

    if (tokensWithBalances.length > 0) {
      setErc20TokenBalance(tokensWithBalances[0]);
    }

    await getActions(accountAddr, chainId);
    await getBundles(accountAddr, chainId);

    dispatch(disableLoading());
    if (!Array.isArray(account)) {
      dispatch(setInfoModalVisible(true));
    }
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
      const networks = await getNetworks();
      console.log('Networks', networks);
      if (!networks) {
        return;
      }
      const { chainId } = networks[activeNetwork];
      await getWalletData(chainId, networks);
    } catch (err: any) {
      if (err.code && err.code === 4100) {
        const toastr = new Toastr();
        toastr.error('Snap is unaccessible or unauthorized');
        dispatch(ws.setWalletConnection(false));
      }
      // eslint-disable-next-line no-console
      console.error('Error while Initializing wallet', err);
    } finally {
      dispatch(disableLoading());
    }
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
    addAction,
    getActions,
    updatePostponeAction,
    getBundle,
    getBundles,
    sendBundle,
  };
};
