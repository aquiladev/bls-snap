/* eslint-disable import/no-named-as-default-member */
import { expect } from 'chai';
import { Mutex } from 'async-mutex';
import sinon from 'sinon';

import { RemoveErc20TokenRequestParams, ApiParams } from '../src/types/snapApi';
import { SnapState } from '../src/types/snapState';
import { removeErc20Token } from '../src/removeErc20Token';
import * as config from '../src/utils/config';
import { WalletMock } from './utils/wallet.mock';
import {
  ERC20_TOKEN_ONE,
  ERC20_TOKEN_ZERO,
  TEST_CHAIN_ID_ONE,
  TEST_CHAIN_ID_ZERO,
  TEST_NETWORK_ONE,
  TEST_NETWORK_ZERO,
} from './utils/constants';

describe('removeErc20Token', () => {
  const walletStub = new WalletMock();

  const state: SnapState = {
    [TEST_CHAIN_ID_ZERO]: {
      ...TEST_NETWORK_ZERO,
      erc20Tokens: [ERC20_TOKEN_ZERO, ERC20_TOKEN_ONE],
    },
    [TEST_CHAIN_ID_ONE]: TEST_NETWORK_ONE,
  };
  const apiParams: ApiParams = {
    state,
    requestParams: {},
    snap: walletStub,
    mutex: new Mutex(),
  };

  beforeEach(() => {
    walletStub.rpcStubs.snap_manageState.resolves(state);
  });

  afterEach(() => {
    walletStub.reset();
  });

  it('should insert asset correctly', async () => {
    sinon.stub(config, 'getNetwork').returns(TEST_NETWORK_ZERO);
    const requestObject: RemoveErc20TokenRequestParams = {
      chainId: TEST_CHAIN_ID_ZERO,
      tokenAddress: ERC20_TOKEN_ZERO.address,
    };
    apiParams.requestParams = requestObject;

    const result = await removeErc20Token(apiParams);

    expect(result).to.be.eql(ERC20_TOKEN_ZERO);
    expect(walletStub.rpcStubs.snap_manageState).to.have.been.called;
  });

  it('should throw error when token address is empty', async () => {
    sinon.stub(config, 'getNetwork').returns(TEST_NETWORK_ZERO);
    const requestObject: RemoveErc20TokenRequestParams = {
      chainId: TEST_CHAIN_ID_ZERO,
    } as RemoveErc20TokenRequestParams;
    apiParams.requestParams = requestObject;

    await expect(removeErc20Token(apiParams)).to.be.rejectedWith(
      'The given token address need to be non-empty string',
    );
  });

  it('should throw error when token not found', async () => {
    sinon.stub(config, 'getNetwork').returns(TEST_NETWORK_ZERO);
    const requestObject: RemoveErc20TokenRequestParams = {
      chainId: TEST_CHAIN_ID_ONE,
      tokenAddress: ERC20_TOKEN_ZERO.address,
    };
    apiParams.requestParams = requestObject;

    await expect(removeErc20Token(apiParams)).to.be.rejectedWith(
      'Token not found',
    );
  });

  it('should throw error when token is internal', async () => {
    sinon.stub(config, 'getNetwork').returns(TEST_NETWORK_ZERO);
    const requestObject: RemoveErc20TokenRequestParams = {
      chainId: TEST_CHAIN_ID_ZERO,
      tokenAddress: ERC20_TOKEN_ONE.address,
    };
    apiParams.requestParams = requestObject;

    await expect(removeErc20Token(apiParams)).to.be.rejectedWith(
      'The token is internal, not possible to remove',
    );
  });
});
