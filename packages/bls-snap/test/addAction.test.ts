/* eslint-disable import/no-named-as-default-member */
import { expect } from 'chai';
import { Mutex } from 'async-mutex';
import sinon from 'sinon';

import { ApiParams, AddActionRequestParams } from '../src/types/snapApi';
import { addAction } from '../src/addAction';
import { SnapState } from '../src/types/snapState';
import * as snapUtils from '../src/utils/snapUtils';
import { WalletMock } from './utils/wallet.mock';
import {
  ERC20_TOKEN_ZERO,
  TEST_CHAIN_ID_UNKNOWN,
  TEST_CHAIN_ID_ZERO,
  TEST_NETWORK_ZERO,
  ZERO_ADDRESS,
  WRONG_ADDRESS,
} from './utils/constants';

describe('addAction', () => {
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

  afterEach(() => {
    walletStub.reset();
  });

  it('should insert action correctly', async () => {
    const requestObject: AddActionRequestParams = {
      chainId: TEST_CHAIN_ID_ZERO,
      senderAddress: ZERO_ADDRESS,
      contractAddress: ERC20_TOKEN_ZERO.address,
      encodedFunction: '0x12345678',
    };
    apiParams.requestParams = requestObject;

    const result = await addAction(apiParams);

    expect(result).to.be.includes({
      value: 0,
      contractAddress: ERC20_TOKEN_ZERO.address,
      senderAddress: ZERO_ADDRESS,
      encodedFunction: '0x12345678',
    });
  });

  it('should throw error when unknown chainId', async () => {
    const requestObject: AddActionRequestParams = {
      chainId: TEST_CHAIN_ID_UNKNOWN,
      senderAddress: ZERO_ADDRESS,
      contractAddress: ERC20_TOKEN_ZERO.address,
      encodedFunction: '0x12345678',
    };
    apiParams.requestParams = requestObject;

    await expect(addAction(apiParams)).to.be.rejectedWith(
      'The network not found',
    );
  });

  it('should throw error if insertAction failed', async () => {
    sinon.stub(snapUtils, 'insertAction').throws(new Error('error'));
    const requestObject: AddActionRequestParams = {
      chainId: TEST_CHAIN_ID_ZERO,
      senderAddress: ZERO_ADDRESS,
      contractAddress: ERC20_TOKEN_ZERO.address,
      encodedFunction: '0x',
    };
    apiParams.requestParams = requestObject;

    await expect(addAction(apiParams)).to.be.rejectedWith('error');
  });

  // Stub ethers.utils.isAddress function to be not dependant on its implementation
  it('should throw error when sender address is invalid', async () => {
    const requestObject: AddActionRequestParams = {
      chainId: TEST_CHAIN_ID_ZERO,
      senderAddress: WRONG_ADDRESS,
      contractAddress: ERC20_TOKEN_ZERO.address,
      encodedFunction: '0x12345678',
    };
    apiParams.requestParams = requestObject;

    await expect(addAction(apiParams)).to.be.rejectedWith(
      `The given sender address is invalid: ${WRONG_ADDRESS}`,
    );
  });

  // Stub ethers.utils.isAddress function to be not dependant on its implementation
  it('should throw error when contract address is invalid', async () => {
    const requestObject: AddActionRequestParams = {
      chainId: TEST_CHAIN_ID_ZERO,
      senderAddress: ZERO_ADDRESS,
      contractAddress: WRONG_ADDRESS,
      encodedFunction: '0x12345678',
    };
    apiParams.requestParams = requestObject;

    await expect(addAction(apiParams)).to.be.rejectedWith(
      `The given contract address is invalid: ${WRONG_ADDRESS}`,
    );
  });
});
