/* eslint-disable import/no-named-as-default-member */
import { expect } from 'chai';
import { Mutex } from 'async-mutex';
import sinon from 'sinon';

import { ApiParams, RemoveActionRequestParams } from '../src/types/snapApi';
import { removeAction } from '../src/removeAction';
import { SnapState } from '../src/types/snapState';
import * as snapUtils from '../src/utils/snapUtils';
import { WalletMock } from './utils/wallet.mock';
import {
  TEST_CHAIN_ID_UNKNOWN,
  TEST_CHAIN_ID_ZERO,
  TEST_NETWORK_ZERO,
  ACTION_ZERO,
  ACTION_ONE,
} from './utils/constants';

describe('removeAction', () => {
  const walletStub = new WalletMock();

  const state: SnapState = {
    [TEST_CHAIN_ID_ZERO]: {
      ...TEST_NETWORK_ZERO,
      actions: [ACTION_ZERO, ACTION_ONE],
    },
  };
  const apiParams: ApiParams = {
    state,
    requestParams: {},
    snap: walletStub,
    mutex: new Mutex(),
  };

  afterEach(() => {
    walletStub.reset();
  });

  it('should insert action correctly', async () => {
    const requestObject: RemoveActionRequestParams = {
      chainId: TEST_CHAIN_ID_ZERO,
      id: ACTION_ZERO.id,
    };
    apiParams.requestParams = requestObject;

    const result = await removeAction(apiParams);

    expect(result).to.be.eq(ACTION_ZERO);
  });

  it('should throw error when action not found', async () => {
    const requestObject: RemoveActionRequestParams = {
      chainId: TEST_CHAIN_ID_UNKNOWN,
      id: 'unknown',
    };
    apiParams.requestParams = requestObject;

    await expect(removeAction(apiParams)).to.be.rejectedWith(
      'Action not found',
    );
  });

  it('should throw error if removeActions failed', async () => {
    sinon.stub(snapUtils, 'removeActions').throws(new Error('error'));
    const requestObject: RemoveActionRequestParams = {
      chainId: TEST_CHAIN_ID_ZERO,
      id: ACTION_ONE.id,
    };
    apiParams.requestParams = requestObject;

    await expect(removeAction(apiParams)).to.be.rejectedWith('error');
  });
});
