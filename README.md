# BLS Snap

Is a MetaMask Snap which integrates BLS Wallet to MetaMask

The Snap built base on [@metamask/template-snap-monorepo](https://github.com/MetaMask/template-snap-monorepo)

## Getting Started

Clone the repository using and setup the development environment:
```
yarn install && yarn start
```

## Troubleshooting
1. package.json has dependency `"bls-snap": "@file:../blc-snap",`, which brokes some of yarn commands, remove before command execution and return after ))
2. `mcl-wasm` has strange behaviour during execution in snap sandbox.
  one line changed in file `mcl_c.js`:
    ```
    if (scriptDirectory.indexOf("blob:") !== 0) {
    ```
    to
    ```
    if (typeof scriptDirectory === 'string' && scriptDirectory.indexOf("blob:") !== 0) {
    ```
