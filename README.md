# BLS Snap

The MetaMask Snap for [BLS Wallet](https://blswallet.org/)


https://user-images.githubusercontent.com/1164492/214146350-eb910e0c-fcb3-4656-965d-6cbf19021675.mov


## Getting Started

Clone the repository using and setup the development environment:

```
yarn install && yarn start
```

`yarn start` runs snap and UI together.

**Note:** If you have issues on the snap installation, take a look **Troubleshooting** block.

Run tests:

```
yarn test
```

## Vocabulary

1. Action - Smart contract calldata (includes target contract, data and value).
2. Operation - Ordered list of actions.
3. Bundle - Ordered list of operations.
4. Aggreegator - Service which accepts BLS signed transactions and bundles them into one for submission.

## Snap APIs

The snap has APIs which allow dapps communicate with it.

A dapp must request MetaMask, in order to invoke snap API

```
await ethereum.request({
  method: 'wallet_invokeSnap',
  params: [
    snapId,
    {
      method: {SNAP_API},
      params: {SNAP_API_PARAMS},
    },
  ],
})
```

### List of APIs

- `ping` - Test API, dapp can hit the API and receive `pong` in response.
- `bls_getNetworks` - Returns list of supported networks with their configurations.
- `bls_recoverAccounts` - Returns list of accounts from snap state.
- `bls_createAccount` - Creates and returns new account. Snap uses seedprase from MetaMask through its API `snap_getBip44Entropy` in order to generate accounts. It allows to re-create the same accounts after snap re-installation.
- `bls_getErc20Tokens` - Returns list of ERC20 tokens from snap state.
- `bls_getErc20TokenBalance` - Returns ERC20 token balance from snap state.
- `bls_getActions` - Returns list of actions from snap state.
- `bls_addAction` - Adds new action to snap state.
- `bls_getBundles` - Returns list of bundles from snap state.
- `bls_getBundle` - Returns the bundle from snap state with status check.
- `bls_sendBundle` - Signs and sends new bundle with ordered list of operations to an aggreegator.

### API params

| API                        | Required                                                                           | Optional                              |
| -------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------- |
| `ping`                     |                                                                                    |
| `bls_getNetworks`          |                                                                                    |
| `bls_recoverAccounts`      | `chainId`                                                                          |
| `bls_createAccount`        | `chainId`                                                                          | `addressIndex`                        |
| `bls_getErc20Tokens`       | `chainId`                                                                          |
| `bls_getErc20TokenBalance` | `chainId`,<br /> `tokenAddress`,<br /> `userAddress`                               |
| `bls_getActions`           | `chainId`,<br /> `senderAddress`                                                   |
| `bls_addAction`            | `chainId`,<br /> `senderAddress`,<br /> `contractAddress`,<br /> `encodedFunction` |
| `bls_getBundles`           | `chainId`,<br /> `senderAddress`                                                   | `contractAddress`,<br /> `bundleHash` |
| `bls_getBundle`            | `chainId`,<br /> `bundleHash`                                                      |
| `bls_sendBundle`           | `chainId`,<br /> `senderAddress`                                                   |

## Troubleshooting

1. `mcl-wasm` has strange behaviour during execution in snap sandbox.
   one line changed in file `mcl_c.js`:
   ```
   if (scriptDirectory.indexOf("blob:") !== 0) {
   ```
   to
   ```
   if (typeof scriptDirectory === 'string' && scriptDirectory.indexOf("blob:") !== 0) {
   ```
   **Note:** This fix requires snap re-installation. You need to build the snap, remove it from MetaMask and install it again.
