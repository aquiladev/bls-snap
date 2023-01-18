/* eslint-disable jsdoc/require-jsdoc */
import { Aggregator, BlsWalletWrapper } from 'bls-wallet-clients';
import {
  BundleReceipt,
  BundleReceiptError,
} from 'bls-wallet-clients/dist/src/Aggregator';
import { Network } from '../types/snapState';
import { getProvider } from './evmUtils';

export function getWallet(
  network: Network,
  privateKey: string,
): Promise<BlsWalletWrapper> {
  return BlsWalletWrapper.connect(
    privateKey,
    network.config.addresses.verificationGateway,
    getProvider(network),
  );
}

export function getAggregator(network: Network): Aggregator {
  return new Aggregator(network.aggregator);
}

export function getBundleReceipt(
  network: Network,
  bundleHash: string,
): Promise<BundleReceipt | BundleReceiptError | undefined> {
  return getAggregator(network).lookupReceipt(bundleHash);
}
