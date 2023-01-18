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
  TEST_CHAIN_ID_ZERO,
  TEST_NETWORK_ZERO,
} from './utils/constants';
import { WalletMock } from './utils/wallet.mock';

describe('getErc20Tokens', function () {
  const walletStub = new WalletMock();

  const state: SnapState = {
    [TEST_CHAIN_ID_ZERO]: {
      ...TEST_NETWORK_ZERO,
      erc20Tokens: [ERC20_TOKEN_ZERO],
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
    const requestObject: GetErc20TokensRequestParams = {
      chainId: TEST_CHAIN_ID_ZERO,
    };
    apiParams.requestParams = requestObject;

    const result = await getErc20Tokens(apiParams);

    expect(walletStub.rpcStubs.snap_manageState).not.to.have.been.called;
    expect(Object.keys(result).length).to.be.eq(1);
    expect(result).to.be.eql([ERC20_TOKEN_ZERO]);
  });

  it('should throw error if getErc20Tokens failed', async function () {
    sinon.stub(snapUtils, 'getErc20Tokens').throws(new Error());
    const requestObject: GetErc20TokensRequestParams = {
      chainId: TEST_CHAIN_ID_ZERO,
    };
    apiParams.requestParams = requestObject;

    await expect(getErc20Tokens(apiParams)).to.be.rejected;
  });
});
