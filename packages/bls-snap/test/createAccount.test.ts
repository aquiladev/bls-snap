/* eslint-disable import/no-named-as-default-member */
import { expect } from 'chai';
import { Mutex } from 'async-mutex';
import sinon from 'sinon';

import { BlsWalletWrapper } from 'bls-wallet-clients';
import { ApiParams, CreateAccountRequestParams } from '../src/types/snapApi';
import { createAccount } from '../src/createAccount';
import { SnapState } from '../src/types/snapState';
import * as snapConstants from '../src/utils/constants';
import * as cryptoUtils from '../src/utils/crypto';
import * as snapUtils from '../src/utils/snapUtils';
import { WalletMock } from './utils/wallet.mock';
import {
  ACCOUNT_ZERO,
  BLS_ACCOUNT_ZERO,
  PRIVATE_KEY_ZERO,
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

  it('should create account correctly', async () => {
    sinon
      .stub(snapConstants, 'ARBITRUM_GOERLI_NETWORK')
      .value(TEST_NETWORK_ZERO);
    sinon.stub(BlsWalletWrapper, 'connect').resolves(BLS_ACCOUNT_ZERO);
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

  it('should throw error if getAccounts failed', async function () {
    sinon.stub(snapUtils, 'getKeysFromAddressIndex').throws(new Error());
    const requestObject: CreateAccountRequestParams = {
      chainId: TEST_CHAIN_ID_ZERO,
    };
    apiParams.requestParams = requestObject;

    await expect(createAccount(apiParams)).to.be.rejected;
  });
});
