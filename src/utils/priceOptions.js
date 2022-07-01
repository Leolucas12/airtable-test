export const PRICE_OFFSET = 5;

export default function priceOptions(prices) {
  const priceRanges = [];
  // Sort prices in ascending order
  prices.sort(function (a, b) { return a - b });
  priceRanges.push(prices[0] + PRICE_OFFSET)
  for (let i = 0; i < prices.length; i++) {
    if (i !== prices.length - 1)
      priceRanges.push([prices[i] + PRICE_OFFSET, prices[i] + 15])
  }
  priceRanges.push(prices[prices.length - 1] - PRICE_OFFSET)
  return priceRanges;
}
