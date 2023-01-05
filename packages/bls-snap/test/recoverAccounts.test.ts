/* eslint-disable import/no-named-as-default-member */
import { expect } from 'chai';
import sinon from 'sinon';
import { Mutex } from 'async-mutex';
import { NetworkConfig } from 'bls-wallet-clients';

import { ApiParams, RecoverAccountsRequestParams } from '../src/types/snapApi';
import { recoverAccounts } from '../src/recoverAccounts';
import { SnapState } from '../src/types/snapState';
import * as snapUtils from '../src/utils/snapUtils';
import { WalletMock } from './utils/wallet.mock';

describe('recoverAccounts', () => {
  const walletStub = new WalletMock();

  const state: SnapState = {
    212: {
      name: 'Testnet',
      chainId: 212,
      rpcUrl: 'https://testnet-rpc.com',
      aggregator: 'https://testnet-aggregator.com',
      config: {} as NetworkConfig,
      accounts: [
        {
          address: '0xCCb80EE6f58cC9e87C8032BD908C59F475CCc435',
          privateKey:
            '0x0001020304050607080910111213141516171819202122232425262728293031',
        },
      ],
    },
  };
  const apiParams: ApiParams = {
    state,
    requestParams: {},
    wallet: walletStub,
    mutex: new Mutex(),
  };

  it('should recover accounts correctly', async () => {
    const requestObject: RecoverAccountsRequestParams = { chainId: 212 };
    apiParams.requestParams = requestObject;

    const result = await recoverAccounts(apiParams);
    console.log(result);

    expect(walletStub.rpcStubs.snap_manageState).not.to.have.been.called;
    expect(result?.length).to.be.eq(1);
    expect(result).to.be.eql(
      state[212].accounts?.map((a) => ({ address: a.address })),
    );
  });

  it('should throw error if getAccounts failed', async function () {
    sinon.stub(snapUtils, 'getAccounts').throws(new Error());
    const requestObject: RecoverAccountsRequestParams = {
      chainId: 212,
    };
    apiParams.requestParams = requestObject;

    let result;
    try {
      await recoverAccounts(apiParams);
    } catch (err) {
      result = err;
    } finally {
      expect(result).to.be.an('Error');
    }
  });
});
