/* eslint-disable consistent-return */
import Toastr from 'toastr2';
import semver from 'semver/preload';
import { Erc20Token, Bundle } from '@aquiladev/bls-snap/src/types/snapState';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import * as ws from '../slices/walletSlice';
import {
  Account,
  Erc20TokenBalance,
  Network,
  SelectableAction,
} from '../types';
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
  const { erc20TokenBalances, accounts } = useAppSelector(
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
    const accounts = (await ethereum.request({
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
    return accounts;
  };

  const createAccount = async (chainId: number) => {
    dispatch(enableLoadingWithMessage('Creating account...'));
    const newAccount = (await ethereum.request({
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
    return newAccount;
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
    })) as SelectableAction[];
    dispatch(ws.setActions(data));
    return data;
  };

  const removeActions = async (id: string, chainId: number) => {
    dispatch(ws.removeActions({ id }));
    const action = await ethereum.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId,
        request: {
          method: 'bls_removeAction',
          params: {
            id,
            chainId,
          },
        },
      },
    });
    return action;
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

  const sendBundle = async (
    senderAddress: string,
    actions: SelectableAction[],
    chainId: number,
  ) => {
    const data = await ethereum.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId,
        request: {
          method: 'bls_sendBundle',
          params: {
            senderAddress,
            chainId,
            actionIds: actions.map((action) => action.id),
          },
        },
      },
    });
    dispatch(ws.addBundle({ bundleHash: data.bundleHash }));
    dispatch(ws.removeActions(actions));
    return data;
  };

  const addERC20Token = async (
    tokenAddress: string,
    tokenName: string,
    tokenSymbol: string,
    tokenDecimals: number,
    chainId: number,
  ) => {
    const data = (await ethereum.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId,
        request: {
          method: 'bls_addErc20Token',
          params: {
            tokenAddress,
            tokenName,
            tokenSymbol,
            tokenDecimals,
            chainId,
          },
        },
      },
    })) as Erc20Token[];
    return data;
  };

  const removeERC20Token = async (tokenAddress: string, chainId: number) => {
    const data = (await ethereum.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId,
        request: {
          method: 'bls_removeErc20Token',
          params: {
            tokenAddress,
            chainId,
          },
        },
      },
    })) as Erc20Token[];
    return data;
  };

  const initAccounts = async (
    chainId: number,
  ): Promise<Account[] | Account> => {
    let account: Account[] | Account = await recoverAccounts(chainId);
    if (!account || account.length === 0 || !account[0].address) {
      // eslint-disable-next-line require-atomic-updates
      account = await createAccount(chainId);
    }
    dispatch(ws.setAccounts(account));
    return account;
  };

  const loadAccountData = async (account: Account, chainId: number) => {
    const tokens = await getTokens(chainId);
    const tokenBalances = await Promise.all(
      tokens.map(async (token) => {
        return await getTokenBalance(token.address, account.address, chainId);
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
    dispatch(ws.setErc20TokenBalances(tokensWithBalances));

    if (tokensWithBalances.length > 0) {
      setErc20TokenBalance(tokensWithBalances[0]);
    }

    await getActions(account.address, chainId);
    await getBundles(account.address, chainId);
  };

  const selectAccount = async (account: Account) => {
    if (!loader.isLoading) {
      dispatch(enableLoadingWithMessage('Loading data...'));
    }
    const networks = await getNetworks();
    const { chainId } = networks[activeNetwork];

    await loadAccountData(account, chainId);

    dispatch(ws.setActiveAccount(account.index));
    dispatch(disableLoading());
  };

  const loadNetworkData = async (chainId: number) => {
    if (!loader.isLoading) {
      dispatch(enableLoadingWithMessage('Getting network data ...'));
    }

    const accounts = await initAccounts(chainId);
    const account = Array.isArray(accounts) ? accounts[0] : accounts;
    await loadAccountData(account, chainId);

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
      dispatch(setNetworks(networks));
      await loadNetworkData(chainId);
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
    recoverAccounts,
    createAccount,
    selectAccount,
    initSnap,
    satisfiesVersion: oldVersionDetected,
    loadNetworkData,
    loadAccountData,
    setErc20TokenBalance,
    refreshTokensUSDPrice,
    updateTokenBalance,
    addAction,
    getActions,
    removeActions,
    getBundle,
    getBundles,
    sendBundle,
    addERC20Token,
    removeERC20Token,
  };
};
