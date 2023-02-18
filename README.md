# BLS Snap &middot; [![npm version](https://img.shields.io/npm/v/@aquiladev/bls-snap.svg?style=flat)](https://www.npmjs.com/package/@aquiladev/bls-snap)

The MetaMask Snap for [BLS Wallet](https://blswallet.org/)


https://user-images.githubusercontent.com/1164492/214146350-eb910e0c-fcb3-4656-965d-6cbf19021675.mov

## Terminology

1. Action - Smart contract calldata (includes target contract, data and value).
2. Operation - Ordered list of actions.
3. Bundle - Ordered list of operations.
4. Aggreegator - Service which accepts BLS signed transactions and bundles them into one for submission.

## Prerequisites

1. [Chrome browser](https://www.google.com/chrome/)
2. [MetaMask Flask](https://metamask.io/flask/)

    Install MetaMask Flask in your Chrome browser. If you have MetaMask installed, you need to disable it because MetaMask does not support Snaps and cannot work with MetaMask Flask at the same time. Take a look [FAQ](https://metamask.io/flask/#flask-fa-qs)
3. [Node.js v16+](https://nodejs.org/download/release/v16.13.2/)
4. [Yarn](https://yarnpkg.com/getting-started/install)

## Getting Started

1. Clone the repository
    ```
    mkdir ./bls-snap
    cd ./bls-snap
    git clone https://github.com/aquiladev/bls-snap.git .
    ```
2. Install dependencies
    ```
    yarn install
    ```
3. Run snap with UI
    ```
    yarn start
    ```
    **Note:** If you have issues on the snap installation, take a look **Troubleshooting** block.
4. Run tests
    ```
    yarn test
    ```

## Snap APIs

The snap has APIs which allow dapps communicate with it.

A dapp must request MetaMask, in order to invoke snap API

```
await ethereum.request({
  method: 'wallet_invokeSnap',
  params: {
    snapId,
    request: {
      method: {SNAP_API},
      params: {SNAP_API_PARAMS},
    },
  },
})
```

### List of APIs

- `ping` - Test API, dapp can hit the API and receive `pong` in response.
- `bls_getNetworks` - Returns list of supported networks with their configurations.
- `bls_recoverAccounts` - Returns list of accounts from snap state.
- `bls_createAccount` - Creates and returns new account. Snap uses seedprase from MetaMask through its API `snap_getBip44Entropy` in order to generate accounts. It allows to re-create the same accounts after snap re-installation.
- `bls_addErc20Token` - Adds ERC20 token to snap state.
- `bls_getErc20Tokens` - Returns list of ERC20 tokens from snap state.
- `bls_removeErc20Token` - Removes ERC20 token from snap state.
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
| `bls_addErc20Token`        | `chainId`,<br /> `tokenAddress`,<br /> `tokenName`,<br /> `tokenSymbol`            | `tokenDecimals` (default: 18)         |
| `bls_getErc20Tokens`       | `chainId`                                                                          |
| `bls_removeErc20Token`     | `chainId`,<br /> `tokenAddress`
| `bls_getErc20TokenBalance` | `chainId`,<br /> `tokenAddress`,<br /> `userAddress`                               |
| `bls_getActions`           | `chainId`,<br /> `senderAddress`                                                   |
| `bls_addAction`            | `chainId`,<br /> `senderAddress`,<br /> `contractAddress`,<br /> `encodedFunction` | `value` (default: 0), <br /> `functionFragment` |
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
