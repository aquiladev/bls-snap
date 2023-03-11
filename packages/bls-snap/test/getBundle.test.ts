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
  BUNDLE_RECEIPT_ZERO,
  BUNDLE_ZERO,
  TEST_CHAIN_ID_UNKNOWN,
  TEST_CHAIN_ID_ZERO,
  TEST_NETWORK_ZERO,
} from './utils/constants';
import { WalletMock } from './utils/wallet.mock';

describe('getBundle', () => {
  const walletStub = new WalletMock();

  const state: SnapState = {
    [TEST_CHAIN_ID_ZERO]: {
      ...TEST_NETWORK_ZERO,
      bundles: [{ ...BUNDLE_ZERO }],
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

  it('should get bundle', async () => {
    sinon.stub(blsUtils, 'getBundleReceipt').resolves(BUNDLE_RECEIPT_ZERO);
    const requestObject: GetBundleRequestParams = {
      chainId: TEST_CHAIN_ID_ZERO,
      bundleHash: BUNDLE_ZERO.bundleHash,
    };
    apiParams.requestParams = requestObject;

    const result = await getBundle(apiParams);

    expect(walletStub.rpcStubs.snap_manageState).to.have.been.called;
    expect(result).to.be.eql({
      ...BUNDLE_ZERO,
      ...BUNDLE_RECEIPT_ZERO,
    });
  });

  it('should throw error if bundle not found', async () => {
    const requestObject: GetBundleRequestParams = {
      chainId: TEST_CHAIN_ID_UNKNOWN,
      bundleHash: BUNDLE_ZERO.bundleHash,
    };
    apiParams.requestParams = requestObject;

    await expect(getBundle(apiParams)).to.be.rejectedWith(
      'The bundle not found',
    );
  });

  it('should throw error if getBundle failed', async () => {
    sinon.stub(snapUtils, 'getBundle').throws(new Error('error'));
    const requestObject: GetBundleRequestParams = {
      chainId: TEST_CHAIN_ID_ZERO,
      bundleHash: BUNDLE_ZERO.bundleHash,
    };
    apiParams.requestParams = requestObject;

    await expect(getBundle(apiParams)).to.be.rejectedWith('error');
  });
});
