// Fonction utilitaire pour arrondir proprement à 2 décimales
const round2 = (num: number): number => Math.round((num + Number.EPSILON) * 100) / 100;

export const cnyToEur = (cny: number, rate: number): number => {
  return rate > 0 ? round2(cny / rate) : 0;
};

export const eurToCny = (eur: number, rate: number): number => {
  return round2(eur * rate);
};

export const calculateTotalCost = (priceEur: number, shipping: number, other: number): number => {
  return round2(priceEur + shipping + other);
};

export const calculateProfit = (resalePrice: number, totalCost: number): number => {
  return round2(resalePrice - totalCost);
};

export const calculateMargin = (profit: number, resalePrice: number): number => {
  if (resalePrice <= 0) return 0;
  return round2((profit / resalePrice) * 100);
};

export const calculateROI = (profit: number, totalCost: number): number => {
  if (totalCost <= 0) return 0;
  return round2((profit / totalCost) * 100);
};