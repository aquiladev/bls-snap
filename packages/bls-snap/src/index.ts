import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { Mutex } from 'async-mutex';

import { addAction } from './addAction';
import { getActions } from './getActions';
import { createAccount } from './createAccount';
import { addErc20Token } from './addErc20Token';
import { getErc20TokenBalance } from './getErc20TokenBalance';
import { getErc20Tokens } from './getErc20Tokens';
import { getNetworks } from './getNetworks';
import { getBundles } from './getBundles';
import { recoverAccounts } from './recoverAccounts';
import { sendBundle } from './sendBundle';
import { ApiParams, ApiRequestParams } from './types/snapApi';
import * as config from './utils/config';
import { addTestToken, upsertNetwork } from './utils/snapUtils';
import { getBundle } from './getBundle';
import { getAddressKeyDeriver } from './utils/crypto';
import { removeErc20Token } from './removeErc20Token';

declare const snap;
const mutex = new Mutex();

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns `null` if the request succeeded.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  // Switch statement for methods not requiring state to speed things up a bit
  if (request.method === 'ping') {
    console.log('pong');
    return 'pong';
  }

  let state = await snap.request({
    method: 'snap_manageState',
    params: {
      operation: 'get',
    },
  });

  if (!state) {
    state = {};

    // initialize state if empty and set default data
    await snap.request({
      method: 'snap_manageState',
      params: {
        operation: 'update',
        newState: state,
      },
    });
  }

  const networks = config.getNetworks();
  for (const network of networks) {
    await upsertNetwork(network, snap, mutex, state);
    await addTestToken(network, snap, mutex, state);
  }

  const requestParams = request?.params as unknown as ApiRequestParams;
  console.log(
    `${request.method}:\nrequestParams: ${JSON.stringify(requestParams)}`,
  );

  const apiParams: ApiParams = {
    state,
    requestParams,
    snap,
    mutex,
  };

  switch (request.method) {
    case 'bls_getNetworks':
      return getNetworks(apiParams);
    case 'bls_recoverAccounts':
      return recoverAccounts(apiParams);
    case 'bls_createAccount':
      apiParams.keyDeriver = await getAddressKeyDeriver(snap);
      return createAccount(apiParams);
    case 'bls_addErc20Token':
      return addErc20Token(apiParams);
    case 'bls_getErc20Tokens':
      return getErc20Tokens(apiParams);
    case 'bls_removeErc20Token':
      return removeErc20Token(apiParams);
    case 'bls_getErc20TokenBalance':
      return getErc20TokenBalance(apiParams);
    case 'bls_addAction':
      return addAction(apiParams);
    case 'bls_getActions':
      return getActions(apiParams);
    case 'bls_getBundles':
      return getBundles(apiParams);
    case 'bls_getBundle':
      return getBundle(apiParams);
    case 'bls_sendBundle':
      return sendBundle(apiParams);
    default:
      throw new Error('Method not found.');
  }
};
