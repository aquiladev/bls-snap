/* eslint-disable jsdoc/require-jsdoc */
import { ethers } from 'ethers';

export function randomPrivateKey() {
  // 32 random bytes
  const _key = new Uint8Array(32);
  crypto.getRandomValues(_key);
  return ethers.utils.hexlify(_key);
}
