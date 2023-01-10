/* eslint-disable jsdoc/require-jsdoc */
import {
  getBIP44AddressKeyDeriver,
  BIP44AddressKeyDeriver,
} from '@metamask/key-tree';

export async function getAddressKeyDeriver(
  wallet,
): Promise<BIP44AddressKeyDeriver> {
  const bip44Node = await wallet.request({
    method: 'snap_getBip44Entropy',
    params: {
      coinType: 9001,
    },
  });

  // `m / purpose' / coin_type' / account' / change / address_index`
  // `m / 44' / 9001' / 0' / 0 / {index}`
  return getBIP44AddressKeyDeriver(bip44Node);
}

export async function getPrivateKey(
  keyDeriver: BIP44AddressKeyDeriver,
  addressIndex = 0,
) {
  const { privateKey } = await keyDeriver(addressIndex);
  return {
    privateKey,
    derivationPath: keyDeriver.path,
    addressIndex,
  };
}
