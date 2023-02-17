/* eslint-disable import/no-named-as-default-member */
import { expect } from 'chai';
import { Mutex } from 'async-mutex';
import sinon from 'sinon';

import { ApiParams, GetNetworksRequestParams } from '../src/types/snapApi';
import { getNetworks } from '../src/getNetworks';
import { SnapState } from '../src/types/snapState';
import * as snapUtils from '../src/utils/snapUtils';
import { WalletMock } from './utils/wallet.mock';
import {
  TEST_CHAIN_ID_ONE,
  TEST_CHAIN_ID_ZERO,
  TEST_NETWORK_ONE,
  TEST_NETWORK_ZERO,
} from './utils/constants';

describe('getNetworks', () => {
  const walletStub = new WalletMock();

  const state: SnapState = {
    [TEST_CHAIN_ID_ZERO]: TEST_NETWORK_ZERO,
    [TEST_CHAIN_ID_ONE]: TEST_NETWORK_ONE,
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

  it('should get networks', async () => {
    const requestObject: GetNetworksRequestParams = {};
    apiParams.requestParams = requestObject;

    const result = await getNetworks(apiParams);

    expect(walletStub.rpcStubs.snap_manageState).not.to.have.been.called;
    expect(Object.keys(result).length).to.be.eq(2);
    expect(result).to.be.eql(state);
  });

  it('should throw error if getNetworks failed', async () => {
    sinon.stub(snapUtils, 'getNetworks').throws(new Error());
    const requestObject: GetNetworksRequestParams = {};
    apiParams.requestParams = requestObject;

    await expect(getNetworks(apiParams)).to.be.rejected;
    expect(walletStub.rpcStubs.snap_manageState).not.to.have.been.called;
  });
});
