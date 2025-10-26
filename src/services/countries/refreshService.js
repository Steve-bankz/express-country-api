// src/services/countries/refreshService.js
import { fetchCountriesAndRates } from "./fetchExternal.js";
import { computeCountryFields } from "./computeGDP.js";
import { saveCountries } from "./dbOperations.js";
import { generateSummaryImage } from "./generateImage.js";

export async function refreshCountries() {
  // Step 1: Fetch external data
  const { countries, rates } = await fetchCountriesAndRates();

  // Step 2: Transform + compute derived fields
  const processed = countries.map((c) => {
    const { currency_code, exchange_rate, estimated_gdp } = computeCountryFields(c, rates);
    return {
      name: c.name,
      capital: Array.isArray(c.capital) ? c.capital[0] : c.capital || null,
      region: c.region || null,
      population: c.population || 0,
      currency_code,
      exchange_rate,
      estimated_gdp,
      flag_url: c.flag || null,
    };
  });

  // Step 3: Save all to DB (transaction safe)
  const dbResult = await saveCountries(processed);

  // Step 4: Generate summary image
  await generateSummaryImage(dbResult.last_refreshed_at);

  // Step 5: Return result
  return {
    success: true,
    count: dbResult.count,
    last_refreshed_at: dbResult.last_refreshed_at,
  };
}
