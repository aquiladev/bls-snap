/* eslint-disable jsdoc/require-jsdoc */

function hasOnlyAsciiChars(value: string) {
  // eslint-disable-next-line require-unicode-regexp
  return /^[ -~]+$/.test(value);
}

export function isValidAscii(value: string, maxLength: number) {
  return (
    hasOnlyAsciiChars(value) &&
    value.trim().length > 0 &&
    value.length <= maxLength
  );
}
