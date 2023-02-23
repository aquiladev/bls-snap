/* eslint-disable import/no-named-as-default-member */
import { expect } from 'chai';
import { Mutex } from 'async-mutex';
import sinon from 'sinon';

import { ApiParams, GetErc20TokensRequestParams } from '../src/types/snapApi';
import { SnapState } from '../src/types/snapState';
import { getErc20Tokens } from '../src/getErc20Tokens';
import * as snapUtils from '../src/utils/snapUtils';
import {
  ERC20_TOKEN_ZERO,
  TEST_CHAIN_ID_ONE,
  TEST_CHAIN_ID_ZERO,
  TEST_NETWORK_ONE,
  TEST_NETWORK_ZERO,
} from './utils/constants';
import { WalletMock } from './utils/wallet.mock';

describe('getErc20Tokens', () => {
  const walletStub = new WalletMock();

  const state: SnapState = {
    [TEST_CHAIN_ID_ZERO]: {
      ...TEST_NETWORK_ZERO,
      erc20Tokens: [ERC20_TOKEN_ZERO],
    },
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

  it('should get the ERC20 tokens', async () => {
    const requestObject: GetErc20TokensRequestParams = {
      chainId: TEST_CHAIN_ID_ZERO,
    };
    apiParams.requestParams = requestObject;

    const result = await getErc20Tokens(apiParams);

    expect(walletStub.rpcStubs.snap_manageState).not.to.have.been.called;
    expect(Object.keys(result).length).to.be.eq(1);
    expect(result).to.be.eql([ERC20_TOKEN_ZERO]);
  });

  it('should get no ERC20 tokens', async () => {
    const requestObject: GetErc20TokensRequestParams = {
      chainId: TEST_CHAIN_ID_ONE,
    };
    apiParams.requestParams = requestObject;

    const result = await getErc20Tokens(apiParams);

    expect(walletStub.rpcStubs.snap_manageState).not.to.have.been.called;
    expect(Object.keys(result).length).to.be.eq(0);
    expect(result).to.be.eql([]);
  });

  it('should throw error if getErc20Tokens failed', async () => {
    sinon.stub(snapUtils, 'getErc20Tokens').throws(new Error('error'));
    const requestObject: GetErc20TokensRequestParams = {
      chainId: TEST_CHAIN_ID_ZERO,
    };
    apiParams.requestParams = requestObject;

    await expect(getErc20Tokens(apiParams)).to.be.rejectedWith('error');
  });
});
