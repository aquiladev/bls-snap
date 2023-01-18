/* eslint-disable import/no-named-as-default-member */
import { expect } from 'chai';
import { Mutex } from 'async-mutex';
import sinon from 'sinon';
import { BigNumber } from 'ethers';

import {
  ApiParams,
  GetErc20TokenBalanceRequestParams,
} from '../src/types/snapApi';
import { SnapState } from '../src/types/snapState';
import { getErc20TokenBalance } from '../src/getErc20TokenBalance';
import * as snapConstants from '../src/utils/constants';
import * as evmUtils from '../src/utils/evmUtils';
import {
  ERC20_TOKEN_ZERO,
  TEST_CHAIN_ID_ZERO,
  TEST_NETWORK_ZERO,
  ZERO_ADDRESS,
} from './utils/constants';
import { WalletMock } from './utils/wallet.mock';

describe('getErc20TokenBalance', function () {
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

  it('should get the ERC20 token balance', async () => {
    sinon
      .stub(snapConstants, 'ARBITRUM_GOERLI_NETWORK')
      .value(TEST_NETWORK_ZERO);

    sinon
      .stub(evmUtils, 'callContract')
      .resolves(
        '0x0000000000000000000000000000000000000000000000000000000000000001',
      );

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

  it('should throw error if callContract failed', async function () {
    sinon.stub(evmUtils, 'callContract').throws(new Error());
    const requestObject: GetErc20TokenBalanceRequestParams = {
      chainId: TEST_CHAIN_ID_ZERO,
      tokenAddress: ERC20_TOKEN_ZERO.address,
      userAddress: ZERO_ADDRESS,
    };
    apiParams.requestParams = requestObject;

    await expect(getErc20TokenBalance(apiParams)).to.be.rejected;
  });
});
