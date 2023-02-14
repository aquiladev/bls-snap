/* eslint-disable import/no-named-as-default-member */
import { expect } from 'chai';
import { Mutex } from 'async-mutex';
import sinon from 'sinon';

import { ApiParams, CreateAccountRequestParams } from '../src/types/snapApi';
import { createAccount } from '../src/createAccount';
import { SnapState } from '../src/types/snapState';
import * as config from '../src/utils/config';
import * as cryptoUtils from '../src/utils/crypto';
import * as blsUtils from '../src/utils/blsUtils';
import * as snapUtils from '../src/utils/snapUtils';
import { WalletMock } from './utils/wallet.mock';
import {
  ACCOUNT_ZERO,
  BLS_ACCOUNT_ZERO,
  PRIVATE_KEY_ZERO,
  TEST_CHAIN_ID_UNKNOWN,
  TEST_CHAIN_ID_ZERO,
  TEST_NETWORK_ZERO,
} from './utils/constants';

describe('createAccount', () => {
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

  afterEach(() => {
    walletStub.reset();
  });

  it('should create account correctly', async () => {
    sinon.stub(config, 'getNetwork').returns(TEST_NETWORK_ZERO);
    sinon.stub(blsUtils, 'getWallet').resolves(BLS_ACCOUNT_ZERO);
    sinon.stub(cryptoUtils, 'getPrivateKey').resolves(PRIVATE_KEY_ZERO);

    const requestObject: CreateAccountRequestParams = {
      chainId: TEST_CHAIN_ID_ZERO,
    };
    apiParams.requestParams = requestObject;
    apiParams.keyDeriver = { path: '' };

    const result = await createAccount(apiParams);

    expect(result).to.be.eql({
      address: '0xCCb80EE6f58cC9e87C8032BD908C59F475CCc435',
    });
    expect(state[TEST_CHAIN_ID_ZERO].accounts).to.not.equal([ACCOUNT_ZERO]);
  });

  it('should throw error when unknown chainId', async () => {
    sinon.stub(config, 'getNetwork').returns(TEST_NETWORK_ZERO);
    sinon.stub(blsUtils, 'getWallet').resolves(BLS_ACCOUNT_ZERO);
    sinon.stub(cryptoUtils, 'getPrivateKey').resolves(PRIVATE_KEY_ZERO);

    const requestObject: CreateAccountRequestParams = {
      chainId: TEST_CHAIN_ID_UNKNOWN,
    };
    apiParams.requestParams = requestObject;
    apiParams.keyDeriver = { path: '' };

    await expect(createAccount(apiParams)).to.be.rejected;
  });

  it('should throw error if getAccounts failed', async () => {
    sinon.stub(snapUtils, 'getKeysFromAddressIndex').throws(new Error());
    const requestObject: CreateAccountRequestParams = {
      chainId: TEST_CHAIN_ID_ZERO,
    };
    apiParams.requestParams = requestObject;

    await expect(createAccount(apiParams)).to.be.rejected;
  });
});
