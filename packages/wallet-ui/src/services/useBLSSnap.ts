import Toastr from 'toastr2';
import semver from 'semver/preload';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setForceReconnect, setWalletConnection } from '../slices/walletSlice';
import { Network } from '../types';
import { disableLoading, enableLoadingWithMessage } from '../slices/UISlice';

export const useBLSSnap = () => {
  const dispatch = useAppDispatch();
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

  const initSnap = async () => {
    if (await oldVersionDetected()) {
      dispatch(disableLoading());
      return;
    }

    if (!loader.isLoading) {
      dispatch(enableLoadingWithMessage('Initializing wallet ...'));
    }

    try {
      const nets = await getNetworks();
      if (nets.length === 0) {
        return;
      }
      console.log(nets);
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

  return {
    connectToSnap,
    getNetworks,
    checkConnection,
    initSnap,
    satisfiesVersion: oldVersionDetected,
  };
};
