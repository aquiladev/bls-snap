/* eslint-disable import/no-named-as-default-member */
import { expect } from 'chai';
import { Mutex } from 'async-mutex';
import { NetworkConfig } from 'bls-wallet-clients';
import sinon from 'sinon';

import { ApiParams, GetNetworksRequestParams } from '../src/types/snapApi';
import { getNetworks } from '../src/getNetworks';
import { SnapState } from '../src/types/snapState';
import * as snapUtils from '../src/utils/snapUtils';
import { WalletMock } from './utils/wallet.mock';

describe('getNetworks', function () {
  const walletStub = new WalletMock();

  const state: SnapState = {
    212: {
      name: 'Testnet',
      chainId: 212,
      rpcUrl: 'https://testnet-rpc.com',
      aggregator: 'https://testnet-aggregator.com',
      config: {} as NetworkConfig,
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

  it('should get the networks', async () => {
    const requestObject: GetNetworksRequestParams = {};
    apiParams.requestParams = requestObject;

    const result = await getNetworks(apiParams);

    expect(walletStub.rpcStubs.snap_manageState).not.to.have.been.called;
    expect(Object.keys(result).length).to.be.eq(1);
    expect(result).to.be.eql(state);
  });

  it('should throw error if getNetworks failed', async function () {
    sinon.stub(snapUtils, 'getNetworks').throws(new Error());
    const requestObject: GetNetworksRequestParams = {};
    apiParams.requestParams = requestObject;

    await expect(getNetworks(apiParams)).to.be.rejected;
    expect(walletStub.rpcStubs.snap_manageState).not.to.have.been.called;
  });
});
