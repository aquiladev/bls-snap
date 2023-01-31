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
  ACTION_ZERO,
  TEST_CHAIN_ID_ZERO,
  TEST_NETWORK_ZERO,
  ZERO_ADDRESS,
} from './utils/constants';
import { WalletMock } from './utils/wallet.mock';

describe('getActions', function () {
  const walletStub = new WalletMock();

  const state: SnapState = {
    [TEST_CHAIN_ID_ZERO]: {
      ...TEST_NETWORK_ZERO,
      actions: [ACTION_ZERO],
    },
  };
  const apiParams: ApiParams = {
    state,
    requestParams: {},
    wallet: walletStub,
    mutex: new Mutex(),
  };

  afterEach(function () {
    walletStub.reset();
  });

  it('should get the ERC20 tokens', async () => {
    const requestObject: GetActionsRequestParams = {
      chainId: TEST_CHAIN_ID_ZERO,
      senderAddress: ACCOUNT_ZERO.address,
    };
    apiParams.requestParams = requestObject;

    const result = await getActions(apiParams);

    expect(walletStub.rpcStubs.snap_manageState).not.to.have.been.called;
    expect(result).to.be.eql(state[TEST_CHAIN_ID_ZERO].actions);
  });

  it('should throw error if getActions failed', async function () {
    sinon.stub(snapUtils, 'getActions').throws(new Error());
    const requestObject: GetActionsRequestParams = {
      chainId: TEST_CHAIN_ID_ZERO,
      senderAddress: ZERO_ADDRESS,
    };
    apiParams.requestParams = requestObject;

    await expect(getActions(apiParams)).to.be.rejected;
  });
});
