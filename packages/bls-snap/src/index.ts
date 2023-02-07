import { OnRpcRequestHandler } from '@metamask/snap-types';
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

const mutex = new Mutex();

/**
 * Get a message from the origin. For demonstration purposes only.
 *
 * @param originString - The origin string.
 * @returns A message based on the origin.
 */
export const getMessage = (originString: string): string =>
  `Hello, ${originString}!`;

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns `null` if the request succeeded.
 * @throws If the request method is not valid for this snap.
 * @throws If the `snap_confirm` call failed.
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

  let state = await wallet.request({
    method: 'snap_manageState',
    params: ['get'],
  });

  if (!state) {
    state = {};

    // initialize state if empty and set default data
    await wallet.request({
      method: 'snap_manageState',
      params: ['update', state],
    });
  }

  const networks = config.getNetworks();
  for (const network of networks) {
    await upsertNetwork(network, wallet, mutex, state);
    await addTestToken(network, wallet, mutex, state);
  }

  const requestParams = request?.params as unknown as ApiRequestParams;
  console.log(
    `${request.method}:\nrequestParams: ${JSON.stringify(requestParams)}`,
  );

  const apiParams: ApiParams = {
    state,
    requestParams,
    wallet,
    mutex,
  };

  switch (request.method) {
    case 'bls_getNetworks':
      return getNetworks(apiParams);
    case 'bls_recoverAccounts':
      return recoverAccounts(apiParams);
    case 'bls_createAccount':
      apiParams.keyDeriver = await getAddressKeyDeriver(wallet);
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
