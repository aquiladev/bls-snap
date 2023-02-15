import { Erc20Token } from '@aquiladev/bls-snap/src/types/snapState';
import { COINGECKO_API } from '../utils/constants';
import { fetchWithTimeout } from '../utils/utils';

export const getAssetPriceUSD = async (asset: Erc20Token) => {
  const coingeckoId = asset.symbol.toLowerCase();
  const url = `${COINGECKO_API}/simple/price?ids=${coingeckoId}&vs_currencies=usd`;
  try {
    const result = await fetchWithTimeout(url);
    const resultJson = await result.json();
    if (resultJson[coingeckoId]?.usd) {
      return resultJson[coingeckoId].usd;
    }
  } catch (err) {
    console.log(err);
    return undefined;
  }
  return undefined;
};
