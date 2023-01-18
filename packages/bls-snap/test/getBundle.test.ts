/* eslint-disable import/no-named-as-default-member */
import { expect } from 'chai';
import { Mutex } from 'async-mutex';
import sinon from 'sinon';

import { ApiParams, GetBundleRequestParams } from '../src/types/snapApi';
import { SnapState } from '../src/types/snapState';
import { getBundle } from '../src/getBundle';
import * as snapUtils from '../src/utils/snapUtils';
import * as blsUtils from '../src/utils/blsUtils';
import {
  AGGREGATOR_MOCK,
  BUNDLE_ZERO,
  TEST_CHAIN_ID_ZERO,
  TEST_NETWORK_ZERO,
} from './utils/constants';
import { WalletMock } from './utils/wallet.mock';

describe('getBundle', function () {
  const walletStub = new WalletMock();

  const state: SnapState = {
    [TEST_CHAIN_ID_ZERO]: {
      ...TEST_NETWORK_ZERO,
      bundles: [BUNDLE_ZERO],
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

  it('should get bundle', async () => {
    sinon.stub(blsUtils, 'getAggregator').returns(AGGREGATOR_MOCK);
    const requestObject: GetBundleRequestParams = {
      chainId: TEST_CHAIN_ID_ZERO,
      bundleHash: BUNDLE_ZERO.bundleHash,
    };
    apiParams.requestParams = requestObject;

    const result = await getBundle(apiParams);

    expect(walletStub.rpcStubs.snap_manageState).not.to.have.been.called;
    expect(result).to.be.eql(BUNDLE_ZERO);
  });

  it('should throw error if getBundle failed', async function () {
    sinon.stub(snapUtils, 'getBundle').throws(new Error());
    const requestObject: GetBundleRequestParams = {
      chainId: TEST_CHAIN_ID_ZERO,
      bundleHash: BUNDLE_ZERO.bundleHash,
    };
    apiParams.requestParams = requestObject;

    await expect(getBundle(apiParams)).to.be.rejected;
  });
});
