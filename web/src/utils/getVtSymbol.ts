export const getVtSymbol = (symbol: string, exchange: string) => {
  return `${symbol}.${exchange}`;
};