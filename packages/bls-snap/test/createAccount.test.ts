/* eslint-disable import/no-named-as-default-member */
import { expect } from 'chai';
import { Mutex } from 'async-mutex';
import { NetworkConfig } from 'bls-wallet-clients';
import sinon from 'sinon';

import { ApiParams, CreateAccountRequestParams } from '../src/types/snapApi';
import { createAccount } from '../src/createAccount';
import { SnapState } from '../src/types/snapState';
import * as cryptoUtils from '../src/utils/crypto';
import { WalletMock } from './utils/wallet.mock';

describe('createAccount', () => {
  const walletStub = new WalletMock();

  const state: SnapState = {
    421613: {
      name: 'Testnet',
      chainId: 421613,
      rpcUrl: 'https://testnet-rpc.com',
      aggregator: 'https://testnet-aggregator.com',
      config: {} as NetworkConfig,
    },
  };
  const apiParams: ApiParams = {
    state,
    requestParams: {},
    wallet: walletStub,
    mutex: new Mutex(),
  };

  it('should create account correctly', async () => {
    sinon.stub(cryptoUtils, 'getPrivateKey').resolves({
      privateKey:
        '0x0001020304050607080910111213141516171819202122232425262728293031',
      derivationPath: `m / bip32:0' / bip32:0' / bip32:0' / bip32:0'`,
      addressIndex: 0,
    });

    const requestObject: CreateAccountRequestParams = { chainId: 421613 };
    apiParams.requestParams = requestObject;
    apiParams.keyDeriver = { path: '' };

    const result = await createAccount(apiParams);
    console.log(result);

    expect(result).to.be.eql({
      address: '0xCCb80EE6f58cC9e87C8032BD908C59F475CCc435',
    });
  });
});
