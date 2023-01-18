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
  TEST_CHAIN_ID_ZERO,
  TEST_NETWORK_ZERO,
  ZERO_ADDRESS,
} from './utils/constants';
import { WalletMock } from './utils/wallet.mock';

describe('getBundles', function () {
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

  it('should throw error if getBundles failed', async function () {
    sinon.stub(snapUtils, 'getBundles').throws(new Error());
    const requestObject: GetBundlesRequestParams = {
      chainId: TEST_CHAIN_ID_ZERO,
      senderAddress: ZERO_ADDRESS,
    };
    apiParams.requestParams = requestObject;

    await expect(getBundles(apiParams)).to.be.rejected;
  });
});
