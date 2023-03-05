module.exports = {
  allowUncaught: true,
  diff: true,
  exit: true,
  extension: ['test.ts'],
  'node-option': [
    'experimental-specifier-resolution=node',
    'loader=ts-node/esm/transpile-only',
  ],
  fullTrace: true,
  package: './package.json',
  recursive: true,
  require: [
    'tsconfig-paths/register',
    'source-map-support/register',
    './test/utils/mochaHooks.ts',
  ],
  slow: 1000,
  timeout: 90000,
};
