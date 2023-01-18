/* eslint-disable import/no-named-as-default-member */
import { expect } from 'chai';
import { Mutex } from 'async-mutex';
import sinon from 'sinon';

import { ApiParams, GetOperationsRequestParams } from '../src/types/snapApi';
import { SnapState } from '../src/types/snapState';
import { getOperations } from '../src/getOperations';
import * as snapUtils from '../src/utils/snapUtils';
import {
  ACCOUNT_ZERO,
  OPERATION_ZERO,
  TEST_CHAIN_ID_ZERO,
  TEST_NETWORK_ZERO,
  ZERO_ADDRESS,
} from './utils/constants';
import { WalletMock } from './utils/wallet.mock';

describe('getOperations', function () {
  const walletStub = new WalletMock();

  const state: SnapState = {
    [TEST_CHAIN_ID_ZERO]: {
      ...TEST_NETWORK_ZERO,
      operations: [OPERATION_ZERO],
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
    const requestObject: GetOperationsRequestParams = {
      chainId: TEST_CHAIN_ID_ZERO,
      senderAddress: ACCOUNT_ZERO.address,
    };
    apiParams.requestParams = requestObject;

    const result = await getOperations(apiParams);

    expect(walletStub.rpcStubs.snap_manageState).not.to.have.been.called;
    expect(result).to.be.eql(state[TEST_CHAIN_ID_ZERO].operations);
  });

  it('should throw error if getOperations failed', async function () {
    sinon.stub(snapUtils, 'getOperations').throws(new Error());
    const requestObject: GetOperationsRequestParams = {
      chainId: TEST_CHAIN_ID_ZERO,
      senderAddress: ZERO_ADDRESS,
    };
    apiParams.requestParams = requestObject;

    await expect(getOperations(apiParams)).to.be.rejected;
  });
});
