/* eslint-disable import/no-named-as-default-member */
import { expect } from 'chai';
import { Mutex } from 'async-mutex';
import sinon from 'sinon';

import { ApiParams, GetActionsRequestParams } from '../src/types/snapApi';
import { SnapState } from '../src/types/snapState';
import { getActions } from '../src/getActions';
import * as snapUtils from '../src/utils/snapUtils';
import {
  ACCOUNT_ZERO,
  ACTION_ONE,
  ACTION_ZERO,
  TEST_CHAIN_ID_ONE,
  TEST_CHAIN_ID_ZERO,
  TEST_NETWORK_ONE,
  TEST_NETWORK_ZERO,
  ZERO_ADDRESS,
} from './utils/constants';
import { WalletMock } from './utils/wallet.mock';

describe('getActions', () => {
  const walletStub = new WalletMock();

  const state: SnapState = {
    [TEST_CHAIN_ID_ZERO]: {
      ...TEST_NETWORK_ZERO,
      actions: [ACTION_ZERO],
    },
    [TEST_CHAIN_ID_ONE]: {
      ...TEST_NETWORK_ONE,
      actions: [ACTION_ONE],
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

  it('should get actions', async () => {
    const requestObject: GetActionsRequestParams = {
      chainId: TEST_CHAIN_ID_ZERO,
      senderAddress: ACCOUNT_ZERO.address,
    };
    apiParams.requestParams = requestObject;

    const result = await getActions(apiParams);

    expect(walletStub.rpcStubs.snap_manageState).not.to.have.been.called;
    expect(result).to.be.eql(state[TEST_CHAIN_ID_ZERO].actions);
  });

  it('should get actions 1', async () => {
    const requestObject: GetActionsRequestParams = {
      chainId: TEST_CHAIN_ID_ONE,
      senderAddress: ACCOUNT_ZERO.address,
    };
    apiParams.requestParams = requestObject;

    const result = await getActions(apiParams);

    expect(walletStub.rpcStubs.snap_manageState).not.to.have.been.called;
    expect(result).to.be.eql(state[TEST_CHAIN_ID_ONE].actions);
  });

  it('should get no actions for unknown sender', async () => {
    const requestObject: GetActionsRequestParams = {
      chainId: TEST_CHAIN_ID_ONE,
      senderAddress: ZERO_ADDRESS,
    };
    apiParams.requestParams = requestObject;

    const result = await getActions(apiParams);

    expect(walletStub.rpcStubs.snap_manageState).not.to.have.been.called;
    expect(result).to.be.eql([]);
  });

  it('should throw error if getActions failed', async () => {
    sinon.stub(snapUtils, 'getActions').throws(new Error());
    const requestObject: GetActionsRequestParams = {
      chainId: TEST_CHAIN_ID_ZERO,
      senderAddress: ZERO_ADDRESS,
    };
    apiParams.requestParams = requestObject;

    await expect(getActions(apiParams)).to.be.rejected;
  });
});
