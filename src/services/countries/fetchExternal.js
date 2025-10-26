import axios from "axios";

const COUNTRIES_API = "https://restcountries.com/v2/all?fields=name,capital,region,population,flag,currencies";
const EXCHANGE_API = "https://open.er-api.com/v6/latest/USD";

// Optional timeout in milliseconds
const TIMEOUT = 5000;

export async function fetchCountriesAndRates() {
  try {
    // Fetch countries
    const countriesRes = await axios.get(COUNTRIES_API, { timeout: TIMEOUT });
    if (!countriesRes.data) {
      throw new Error("No data returned from Countries API");
    }
    const countries = countriesRes.data;

    // Fetch exchange rates
    const ratesRes = await axios.get(EXCHANGE_API, { timeout: TIMEOUT });
    if (!ratesRes.data || !ratesRes.data.rates) {
      throw new Error("No data returned from Exchange Rates API");
    }
    const rates = ratesRes.data.rates;

    return { countries, rates };
  } catch (err) {
    console.error("External API error:", err.message);

    // Determine which API failed for the message
    const apiName = err.config?.url?.includes("restcountries") ? "Countries API" : "Exchange Rates API";

    // Throw a custom error that your controller can catch
    const error = new Error(`could not fetch data from ${apiName}`);
    error.statusCode = 503; // Service Unavailable
    throw error;
  }
}
