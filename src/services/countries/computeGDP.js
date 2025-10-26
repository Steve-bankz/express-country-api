// src/services/countries/computeGDP.js
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Computes the exchange_rate and estimated_gdp for a given country.
 * @param {Object} country - Raw country object from REST Countries API
 * @param {Object} rates - Exchange rate object from open.er-api.com
 */
export function computeCountryFields(country, rates) {
  const { population, currencies } = country;

  // Handle missing currency
  if (!Array.isArray(currencies) || currencies.length === 0) {
    return { currency_code: null, exchange_rate: null, estimated_gdp: 0 };
  }

  const currency_code = currencies[0]?.code || null;
  const ratePerUSD = rates[currency_code];
  let exchange_rate = null;
  let estimated_gdp = 0;

  if (ratePerUSD && ratePerUSD > 0) {
    // Convert from "1 USD = ratePerUSD <currency>" → "1 <currency> = 1 / ratePerUSD USD"
    exchange_rate = 1 / ratePerUSD;
    const multiplier = randInt(1000, 2000);
    const popVal = population ? Number(population) : 0;
    estimated_gdp = exchange_rate ? (popVal * multiplier) / exchange_rate : 0;
  }

  return { currency_code, exchange_rate, estimated_gdp };
}
