/* eslint-disable import/no-named-as-default-member */
import { expect } from 'chai';
import { Mutex } from 'async-mutex';
import sinon from 'sinon';

import { ApiParams, AddOperationRequestParams } from '../src/types/snapApi';
import { addOperation } from '../src/addOperation';
import { SnapState } from '../src/types/snapState';
import * as snapUtils from '../src/utils/snapUtils';
import { WalletMock } from './utils/wallet.mock';
import {
  ERC20_TOKEN_ZERO,
  TEST_CHAIN_ID_ZERO,
  TEST_NETWORK_ZERO,
  ZERO_ADDRESS,
} from './utils/constants';

describe('addOperation', () => {
  const walletStub = new WalletMock();

  const state: SnapState = {
    [TEST_CHAIN_ID_ZERO]: TEST_NETWORK_ZERO,
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

  it('should create account correctly', async () => {
    const requestObject: AddOperationRequestParams = {
      chainId: TEST_CHAIN_ID_ZERO,
      senderAddress: ZERO_ADDRESS,
      contractAddress: ERC20_TOKEN_ZERO.address,
      encodedFunction: '0x12345678',
    };
    apiParams.requestParams = requestObject;

    const result = await addOperation(apiParams);

    expect(result).to.be.includes({
      value: 0,
      contractAddress: ERC20_TOKEN_ZERO.address,
      senderAddress: ZERO_ADDRESS,
      encodedFunction: '0x12345678',
    });
  });

  it('should throw error if upsertOperation failed', async function () {
    sinon.stub(snapUtils, 'upsertOperation').throws(new Error());
    const requestObject: AddOperationRequestParams = {
      chainId: TEST_CHAIN_ID_ZERO,
      senderAddress: ZERO_ADDRESS,
      contractAddress: ERC20_TOKEN_ZERO.address,
      encodedFunction: '0x',
    };
    apiParams.requestParams = requestObject;

    await expect(addOperation(apiParams)).to.be.rejected;
  });
});
