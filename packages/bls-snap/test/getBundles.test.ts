/* eslint-disable import/no-named-as-default-member */
import { expect } from 'chai';
import { Mutex } from 'async-mutex';
import sinon from 'sinon';

import { ApiParams, GetBundlesRequestParams } from '../src/types/snapApi';
import { SnapState } from '../src/types/snapState';
import { getBundles } from '../src/getBundles';
import * as snapUtils from '../src/utils/snapUtils';
import {
  ACCOUNT_ZERO,
  BUNDLE_ZERO,
  TEST_CHAIN_ID_ONE,
  TEST_CHAIN_ID_UNKNOWN,
  TEST_CHAIN_ID_ZERO,
  TEST_NETWORK_ONE,
  TEST_NETWORK_ZERO,
  ZERO_ADDRESS,
} from './utils/constants';
import { WalletMock } from './utils/wallet.mock';

describe('getBundles', () => {
  const walletStub = new WalletMock();

  const state: SnapState = {
    [TEST_CHAIN_ID_ZERO]: {
      ...TEST_NETWORK_ZERO,
      bundles: [BUNDLE_ZERO],
    },
    [TEST_CHAIN_ID_ONE]: {
      ...TEST_NETWORK_ONE,
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

  it('should get bundles', async () => {
    const requestObject: GetBundlesRequestParams = {
      chainId: TEST_CHAIN_ID_ZERO,
      senderAddress: ACCOUNT_ZERO.address,
    };
    apiParams.requestParams = requestObject;

    const result = await getBundles(apiParams);

    expect(walletStub.rpcStubs.snap_manageState).not.to.have.been.called;
    expect(result).to.be.eql([BUNDLE_ZERO]);
  });

  it('should get no bundles', async () => {
    const requestObject: GetBundlesRequestParams = {
      chainId: TEST_CHAIN_ID_ONE,
      senderAddress: ACCOUNT_ZERO.address,
    };
    apiParams.requestParams = requestObject;

    const result = await getBundles(apiParams);

    expect(walletStub.rpcStubs.snap_manageState).not.to.have.been.called;
    expect(result).to.be.eql([]);
  });

  it('should get no bundles when unknown chainId', async () => {
    const requestObject: GetBundlesRequestParams = {
      chainId: TEST_CHAIN_ID_UNKNOWN,
      senderAddress: ACCOUNT_ZERO.address,
    };
    apiParams.requestParams = requestObject;

    const result = await getBundles(apiParams);

    expect(walletStub.rpcStubs.snap_manageState).not.to.have.been.called;
    expect(result).to.be.eql([]);
  });

  it('should throw error if getBundles failed', async () => {
    sinon.stub(snapUtils, 'getBundles').throws(new Error('error'));
    const requestObject: GetBundlesRequestParams = {
      chainId: TEST_CHAIN_ID_ZERO,
      senderAddress: ZERO_ADDRESS,
    };
    apiParams.requestParams = requestObject;

    await expect(getBundles(apiParams)).to.be.rejectedWith('error');
  });
});
