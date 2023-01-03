import { OnRpcRequestHandler } from '@metamask/snap-types';
import { Mutex } from 'async-mutex';

import { addOperation } from './addOperation';
import { getOperations } from './getOperations';
import { createAccount } from './createAccount';
import { getErc20TokenBalance } from './getErc20TokenBalance';
import { getErc20Tokens } from './getErc20Tokens';
import { getNetworks } from './getNetworks';
import { getBundles } from './getBundles';
import { recoverAccounts } from './recoverAccounts';
import { sendBundle } from './sendBundle';
import { ApiParams, ApiRequestParams } from './types/snapApi';
import { ARBITRUM_GOERLI_NETWORK } from './utils/constants';
import { addTestToken, upsertNetwork } from './utils/snapUtils';
import { getBundle } from './getBundle';

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

  await upsertNetwork(ARBITRUM_GOERLI_NETWORK, wallet, mutex, state);
  await addTestToken(ARBITRUM_GOERLI_NETWORK, wallet, mutex, state);

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
    case 'hello':
      return wallet.request({
        method: 'snap_confirm',
        params: [
          {
            prompt: getMessage(origin),
            description:
              'This custom confirmation is just for display purposes.',
            textAreaContent:
              'But you can edit the snap source code to make it do something, if you want to!',
          },
        ],
      });
    case 'bls_getNetworks':
      return getNetworks(apiParams);
    case 'bls_recoverAccounts':
      return recoverAccounts(apiParams);
    case 'bls_createAccount':
      return createAccount(apiParams);
    case 'bls_getErc20Tokens':
      return getErc20Tokens(apiParams);
    case 'bls_getErc20TokenBalance':
      return getErc20TokenBalance(apiParams);
    case 'bls_addOperation':
      return addOperation(apiParams);
    case 'bls_getOperations':
      return getOperations(apiParams);
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
