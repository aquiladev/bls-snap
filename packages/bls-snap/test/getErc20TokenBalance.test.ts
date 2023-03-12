/* eslint-disable import/no-named-as-default-member */
import { expect } from 'chai';
import { Mutex } from 'async-mutex';
import { BigNumber } from 'ethers';
import sinon from 'sinon';

import {
  ApiParams,
  GetErc20TokenBalanceRequestParams,
} from '../src/types/snapApi';
import { SnapState } from '../src/types/snapState';
import { getErc20TokenBalance } from '../src/getErc20TokenBalance';
import * as config from '../src/utils/config';
import * as evmUtils from '../src/utils/evmUtils';
import {
  ERC20_TOKEN_ZERO,
  TEST_CHAIN_ID_UNKNOWN,
  TEST_CHAIN_ID_ZERO,
  TEST_NETWORK_ZERO,
  ZERO_ADDRESS,
} from './utils/constants';
import { WalletMock } from './utils/wallet.mock';

describe('getErc20TokenBalance', () => {
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
    snap: walletStub,
    mutex: new Mutex(),
  };

  afterEach(() => {
    walletStub.reset();
  });

  it('should get the ERC20 token balance', async () => {
    sinon.stub(config, 'getNetwork').returns(TEST_NETWORK_ZERO);
    sinon.stub(evmUtils, 'getErc20TokenBalance').resolves(BigNumber.from(1));

    const requestObject: GetErc20TokenBalanceRequestParams = {
      chainId: TEST_CHAIN_ID_ZERO,
      tokenAddress: ERC20_TOKEN_ZERO.address,
      userAddress: ZERO_ADDRESS,
    };
    apiParams.requestParams = requestObject;

    const result = await getErc20TokenBalance(apiParams);

    expect(walletStub.rpcStubs.snap_manageState).not.to.have.been.called;
    expect(result).to.be.eql(BigNumber.from(1).toHexString());
  });

  it('should throw error when unknown chainId', async () => {
    const requestObject: GetErc20TokenBalanceRequestParams = {
      chainId: TEST_CHAIN_ID_UNKNOWN,
      tokenAddress: ERC20_TOKEN_ZERO.address,
      userAddress: ZERO_ADDRESS,
    };
    apiParams.requestParams = requestObject;

    await expect(getErc20TokenBalance(apiParams)).to.be.rejectedWith(
      'The network is not supported',
    );
  });

  it('should throw error if callContract failed', async () => {
    sinon.stub(config, 'getNetwork').returns(TEST_NETWORK_ZERO);
    sinon.stub(evmUtils, 'getErc20TokenBalance').throws(new Error('error'));
    const requestObject: GetErc20TokenBalanceRequestParams = {
      chainId: TEST_CHAIN_ID_ZERO,
      tokenAddress: ERC20_TOKEN_ZERO.address,
      userAddress: ZERO_ADDRESS,
    };
    apiParams.requestParams = requestObject;

    await expect(getErc20TokenBalance(apiParams)).to.be.rejectedWith('error');
  });
});
