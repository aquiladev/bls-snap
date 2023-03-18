/* eslint-disable import/no-named-as-default-member */
import { expect } from 'chai';
import sinon from 'sinon';
import { Mutex } from 'async-mutex';

import { ApiParams, RecoverAccountsRequestParams } from '../src/types/snapApi';
import { recoverAccounts } from '../src/recoverAccounts';
import { SnapState } from '../src/types/snapState';
import * as snapUtils from '../src/utils/snapUtils';
import { WalletMock } from './utils/wallet.mock';
import {
  ACCOUNT_ZERO,
  TEST_CHAIN_ID_ONE,
  TEST_CHAIN_ID_ZERO,
  TEST_NETWORK_ONE,
  TEST_NETWORK_ZERO,
} from './utils/constants';

describe('recoverAccounts', () => {
  const walletStub = new WalletMock();

  const state: SnapState = {
    [TEST_CHAIN_ID_ZERO]: {
      ...TEST_NETWORK_ZERO,
      accounts: [ACCOUNT_ZERO],
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

  it('should recover accounts correctly', async () => {
    const requestObject: RecoverAccountsRequestParams = {
      chainId: TEST_CHAIN_ID_ZERO,
    };
    apiParams.requestParams = requestObject;

    const result = await recoverAccounts(apiParams);
    console.log(result);

    expect(walletStub.rpcStubs.snap_manageState).not.to.have.been.called;
    expect(result?.length).to.be.eq(1);
    expect(result).to.be.eql(
      state[TEST_CHAIN_ID_ZERO].accounts?.map((a) => ({
        address: a.address,
        name: a.name,
        index: 0,
      })),
    );
  });

  it('should recover no accounts when there are non', async () => {
    const requestObject: RecoverAccountsRequestParams = {
      chainId: TEST_CHAIN_ID_ONE,
    };
    apiParams.requestParams = requestObject;

    const result = await recoverAccounts(apiParams);
    console.log(result);

    expect(walletStub.rpcStubs.snap_manageState).not.to.have.been.called;
    expect(result).to.be.eql(undefined);
  });

  it('should throw error if getAccounts failed', async () => {
    sinon.stub(snapUtils, 'getAccounts').throws(new Error('error'));
    const requestObject: RecoverAccountsRequestParams = {
      chainId: TEST_CHAIN_ID_ZERO,
    };
    apiParams.requestParams = requestObject;

    await expect(recoverAccounts(apiParams)).to.be.rejectedWith('error');
  });
});
