/* eslint-disable import/no-named-as-default-member */
import { expect } from 'chai';
import { Mutex } from 'async-mutex';
import sinon from 'sinon';

import { AddErc20TokenRequestParams, ApiParams } from '../src/types/snapApi';
import { SnapState } from '../src/types/snapState';
import { addErc20Token } from '../src/addErc20Token';
import * as config from '../src/utils/config';
import * as snapUtils from '../src/utils/snapUtils';
import { WalletMock } from './utils/wallet.mock';
import {
  ERC20_TOKEN_ZERO,
  TEST_CHAIN_ID_ZERO,
  TEST_NETWORK_ZERO,
} from './utils/constants';

describe('addErc20Token', () => {
  const walletStub = new WalletMock();

  const state: SnapState = {
    [TEST_CHAIN_ID_ZERO]: TEST_NETWORK_ZERO,
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
    const requestObject: AddErc20TokenRequestParams = {
      chainId: TEST_CHAIN_ID_ZERO,
      tokenAddress: ERC20_TOKEN_ZERO.address,
      tokenName: ERC20_TOKEN_ZERO.name,
      tokenSymbol: ERC20_TOKEN_ZERO.symbol,
    };
    apiParams.requestParams = requestObject;

    const result = await addErc20Token(apiParams);

    expect(result).to.be.eql(ERC20_TOKEN_ZERO);
    expect(walletStub.rpcStubs.snap_manageState).to.have.been.called;
  });

  it('should insert asset with default decimals', async () => {
    sinon.stub(config, 'getNetwork').returns(TEST_NETWORK_ZERO);
    const requestObject: AddErc20TokenRequestParams = {
      chainId: TEST_CHAIN_ID_ZERO,
      tokenAddress: ERC20_TOKEN_ZERO.address,
      tokenName: ERC20_TOKEN_ZERO.name,
      tokenSymbol: ERC20_TOKEN_ZERO.symbol,
      tokenDecimals: -1,
    };
    apiParams.requestParams = requestObject;

    const result = await addErc20Token(apiParams);

    expect(result).to.be.eql(ERC20_TOKEN_ZERO);
  });

  it('should insert asset with provided decimals', async () => {
    sinon.stub(config, 'getNetwork').returns(TEST_NETWORK_ZERO);
    const requestObject: AddErc20TokenRequestParams = {
      chainId: TEST_CHAIN_ID_ZERO,
      tokenAddress: ERC20_TOKEN_ZERO.address,
      tokenName: ERC20_TOKEN_ZERO.name,
      tokenSymbol: ERC20_TOKEN_ZERO.symbol,
      tokenDecimals: 2,
    };
    apiParams.requestParams = requestObject;

    const result = await addErc20Token(apiParams);

    expect(result).to.be.eql({ ...ERC20_TOKEN_ZERO, decimals: 2 });
  });

  it('should throw error when token address is empty', async () => {
    sinon.stub(config, 'getNetwork').returns(TEST_NETWORK_ZERO);
    const requestObject: AddErc20TokenRequestParams = {
      chainId: TEST_CHAIN_ID_ZERO,
    } as AddErc20TokenRequestParams;
    apiParams.requestParams = requestObject;

    await expect(addErc20Token(apiParams)).to.be.rejectedWith(
      'The given token address, name, and symbol need to be non-empty string',
    );
  });

  it('should throw error when token name is empty', async () => {
    sinon.stub(config, 'getNetwork').returns(TEST_NETWORK_ZERO);
    const requestObject: AddErc20TokenRequestParams = {
      chainId: TEST_CHAIN_ID_ZERO,
      tokenAddress: ERC20_TOKEN_ZERO.address,
    } as AddErc20TokenRequestParams;
    apiParams.requestParams = requestObject;

    await expect(addErc20Token(apiParams)).to.be.rejectedWith(
      'The given token address, name, and symbol need to be non-empty string',
    );
  });

  it('should throw error when token symbol is empty', async () => {
    sinon.stub(config, 'getNetwork').returns(TEST_NETWORK_ZERO);
    const requestObject: AddErc20TokenRequestParams = {
      chainId: TEST_CHAIN_ID_ZERO,
      tokenAddress: ERC20_TOKEN_ZERO.address,
      tokenName: ERC20_TOKEN_ZERO.name,
    } as AddErc20TokenRequestParams;
    apiParams.requestParams = requestObject;

    await expect(addErc20Token(apiParams)).to.be.rejectedWith(
      'The given token address, name, and symbol need to be non-empty string',
    );
  });

  it('should throw error when token address is invalid', async () => {
    sinon.stub(config, 'getNetwork').returns(TEST_NETWORK_ZERO);
    const requestObject: AddErc20TokenRequestParams = {
      chainId: TEST_CHAIN_ID_ZERO,
      tokenAddress: 'aaaa',
      tokenName: ERC20_TOKEN_ZERO.name,
      tokenSymbol: ERC20_TOKEN_ZERO.symbol,
    } as AddErc20TokenRequestParams;
    apiParams.requestParams = requestObject;

    await expect(addErc20Token(apiParams)).to.be.rejectedWith(
      'The given token address is invalid',
    );
  });

  it('should throw error when token name is invalid', async () => {
    sinon.stub(config, 'getNetwork').returns(TEST_NETWORK_ZERO);
    const requestObject: AddErc20TokenRequestParams = {
      chainId: TEST_CHAIN_ID_ZERO,
      tokenAddress: ERC20_TOKEN_ZERO.address,
      tokenName: '*#\n1',
      tokenSymbol: ERC20_TOKEN_ZERO.symbol,
    } as AddErc20TokenRequestParams;
    apiParams.requestParams = requestObject;

    await expect(addErc20Token(apiParams)).to.be.rejectedWith(
      'The given token name is invalid, needs to be in ASCII chars, not all spaces, and has length larger than 64',
    );
  });

  it('should throw error when token symbol is invalid', async () => {
    sinon.stub(config, 'getNetwork').returns(TEST_NETWORK_ZERO);
    const requestObject: AddErc20TokenRequestParams = {
      chainId: TEST_CHAIN_ID_ZERO,
      tokenAddress: ERC20_TOKEN_ZERO.address,
      tokenName: ERC20_TOKEN_ZERO.name,
      tokenSymbol: '*#\n1',
    } as AddErc20TokenRequestParams;
    apiParams.requestParams = requestObject;

    await expect(addErc20Token(apiParams)).to.be.rejectedWith(
      'The given token symbol is invalid, needs to be in ASCII chars, not all spaces, and has length larger than 16',
    );
  });

  it('should throw error when chain id is unknown', async () => {
    const requestObject: AddErc20TokenRequestParams = {
      chainId: TEST_CHAIN_ID_ZERO,
      tokenAddress: ERC20_TOKEN_ZERO.address,
      tokenName: ERC20_TOKEN_ZERO.name,
      tokenSymbol: ERC20_TOKEN_ZERO.symbol,
    };
    apiParams.requestParams = requestObject;

    await expect(addErc20Token(apiParams)).to.be.rejectedWith(
      'ChainId not supported',
    );
  });

  it('should throw error if upsertErc20Token failed', async () => {
    sinon.stub(config, 'getNetwork').returns(TEST_NETWORK_ZERO);
    sinon.stub(snapUtils, 'upsertErc20Token').throws(new Error());
    const requestObject: AddErc20TokenRequestParams = {
      chainId: TEST_CHAIN_ID_ZERO,
      tokenAddress: ERC20_TOKEN_ZERO.address,
      tokenName: ERC20_TOKEN_ZERO.name,
      tokenSymbol: ERC20_TOKEN_ZERO.symbol,
    };
    apiParams.requestParams = requestObject;

    await expect(addErc20Token(apiParams)).to.be.rejected;
  });
});
