import { expect } from 'chai';
/* eslint-disable import/no-named-as-default-member */
import sinon from 'sinon';

import { AddErc20TokenRequestParams } from '../src/types/snapApi';
import {
  MAX_TOKEN_NAME_LENGTH,
  MAX_TOKEN_SYMBOL_LENGTH,
  validateAddErc20TokenParams,
} from '../src/utils/snapUtils';
import * as config from '../src/utils/config';
import * as textUtils from '../src/utils/textUtils';
import * as evmUtils from '../src/utils/evmUtils';

import {
  TEST_CHAIN_ID_ZERO,
  TEST_NETWORK_ZERO,
  WRONG_ADDRESS,
  ZERO_ADDRESS,
} from './utils/constants';

describe('validateAddErc20TokenParams', () => {
  // Stub ethers.utils.isAddress function to be not dependant on its implementation
  it('should throw error when token address is invalid', async () => {
    const callFunctionParams: AddErc20TokenRequestParams = {
      tokenAddress: WRONG_ADDRESS,
      chainId: TEST_CHAIN_ID_ZERO,
      tokenName: 'TEST',
      tokenSymbol: 'TST',
    };
    await expect(
      validateAddErc20TokenParams(callFunctionParams),
    ).to.be.rejectedWith(
      `The given token address is invalid: ${WRONG_ADDRESS}`,
    );
  });

  it('should throw error when unknown chainId', async () => {
    sinon.stub(config, 'getNetwork').returns(undefined);

    const callFunctionParams: AddErc20TokenRequestParams = {
      tokenAddress: ZERO_ADDRESS,
      chainId: TEST_CHAIN_ID_ZERO,
      tokenName: 'TEST',
      tokenSymbol: 'TST',
    };
    await expect(
      validateAddErc20TokenParams(callFunctionParams),
    ).to.be.rejectedWith(`The network is not supported: ${TEST_CHAIN_ID_ZERO}`);
  });

  it('should throw error when token name is invalid', async () => {
    sinon.stub(config, 'getNetwork').returns(TEST_NETWORK_ZERO);
    sinon
      .stub(textUtils, 'isValidAscii')
      .withArgs('TEST', MAX_TOKEN_NAME_LENGTH)
      .returns(false);

    const callFunctionParams: AddErc20TokenRequestParams = {
      tokenAddress: ZERO_ADDRESS,
      chainId: TEST_CHAIN_ID_ZERO,
      tokenName: 'TEST',
      tokenSymbol: 'TST',
    };
    await expect(
      validateAddErc20TokenParams(callFunctionParams),
    ).to.be.rejectedWith(
      `The given token name is invalid, needs to be in ASCII chars, not all spaces, and has length larger than ${MAX_TOKEN_NAME_LENGTH}: ${'TEST'}`,
    );
  });

  it('should throw error when token symbol is invalid', async () => {
    sinon.stub(config, 'getNetwork').returns(TEST_NETWORK_ZERO);
    const stub = sinon.stub(textUtils, 'isValidAscii').returns(true);
    stub.withArgs('TST', MAX_TOKEN_SYMBOL_LENGTH).returns(false);

    const callFunctionParams: AddErc20TokenRequestParams = {
      tokenAddress: ZERO_ADDRESS,
      chainId: TEST_CHAIN_ID_ZERO,
      tokenName: 'TEST',
      tokenSymbol: 'TST',
    };
    await expect(
      validateAddErc20TokenParams(callFunctionParams),
    ).to.be.rejectedWith(
      `The given token symbol is invalid, needs to be in ASCII chars, not all spaces, and has length larger than ${MAX_TOKEN_SYMBOL_LENGTH}: ${'TST'}`,
    );
  });

  it('should throw error when getErc20TokenBalance function is failed', async () => {
    sinon.stub(config, 'getNetwork').returns(TEST_NETWORK_ZERO);
    sinon.stub(textUtils, 'isValidAscii').returns(true);
    sinon.stub(evmUtils, 'getErc20TokenBalance').throws();

    const callFunctionParams: AddErc20TokenRequestParams = {
      tokenAddress: ZERO_ADDRESS,
      chainId: TEST_CHAIN_ID_ZERO,
      tokenName: 'TEST',
      tokenSymbol: 'TST',
    };
    await expect(
      validateAddErc20TokenParams(callFunctionParams),
    ).to.be.rejectedWith('The given token is invalid');
  });

  it('should call getErc20TokenBalance with right params', async () => {
    sinon.stub(config, 'getNetwork').returns(TEST_NETWORK_ZERO);
    sinon.stub(textUtils, 'isValidAscii').returns(true);
    const stub = sinon.stub(evmUtils, 'getErc20TokenBalance');

    const callFunctionParams: AddErc20TokenRequestParams = {
      tokenAddress: ZERO_ADDRESS,
      chainId: TEST_CHAIN_ID_ZERO,
      tokenName: 'TEST',
      tokenSymbol: 'TST',
    };

    await validateAddErc20TokenParams(callFunctionParams);

    expect(stub.calledWith(TEST_NETWORK_ZERO)).to.be.true;
  });
});
