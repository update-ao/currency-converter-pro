
import { CurrencyMap, ExchangeRateData, Rates, HistoricalRatePoint } from '../types';

const API_VERSION = 'v1';

async function fetchData(url: string): Promise<any> {
  const response = await fetch(url);
  if (!response.ok) {
    // Attach status to the error object for detailed handling by the caller
    const err = new Error(`HTTP error! status: ${response.status} for URL: ${url}`);
    (err as any).status = response.status; 
    try {
      // Attempt to get body for more context, but be mindful of consuming it
      (err as any).body = await response.text();
    } catch (bodyError) {
      // Ignore if body can't be read
    }
    throw err;
  }
  try {
    return await response.json();
  } catch (e) {
    // This is a genuine error to keep as console.error
    console.error(`Failed to parse JSON from ${url}:`, e);
    throw new Error(`Invalid JSON response from ${url}.`);
  }
}

export async function fetchWithFallback(date: string, endpoint: string, minified: boolean = true): Promise<any> {
  const suffix = minified ? '.min.json' : '.json';
  const primaryBaseUrl = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api';
  const fallbackBaseUrl = `https://${date}.currency-api.pages.dev`;

  const primaryUrl = `${primaryBaseUrl}@${date}/${API_VERSION}/${endpoint}${suffix}`;
  const fallbackUrl = `${fallbackBaseUrl}/${API_VERSION}/${endpoint}${suffix}`;
  
  let primaryError: any;
  try {
    return await fetchData(primaryUrl);
  } catch (error: any) {
    primaryError = error;
    if (error.status === 404) {
      console.info(`Primary API: Data for ${endpoint} on ${date} not found (404). URL: ${primaryUrl}. Attempting fallback.`);
    } else {
      console.warn(`Primary API call failed for ${primaryUrl}: ${error.message || 'Unknown error'}`);
    }

    try {
      return await fetchData(fallbackUrl);
    } catch (fallbackError: any) {
      if (fallbackError.status === 404) {
        console.info(`Fallback API: Data for ${endpoint} on ${date} also not found (404). URL: ${fallbackUrl}`);
      } else {
        console.warn(`Fallback API call failed for ${fallbackUrl}: ${fallbackError.message || 'Unknown error'}`);
      }
      // Construct a comprehensive error message
      const primaryStatus = primaryError.status || 'Unknown Primary Error';
      const primaryMsg = primaryError.message || (primaryError.body ? `Body: ${primaryError.body}`: 'No details');
      const fallbackStatus = fallbackError.status || 'Unknown Fallback Error';
      const fallbackMsg = fallbackError.message || (fallbackError.body ? `Body: ${fallbackError.body}`: 'No details');
      
      throw new Error(`Data for ${endpoint} on ${date} unavailable. Primary failed (${primaryStatus}): ${primaryMsg}. Fallback failed (${fallbackStatus}): ${fallbackMsg}.`);
    }
  }
}

export async function getAllCurrencies(): Promise<CurrencyMap> {
  // Always fetches the latest list of currencies
  return fetchWithFallback('latest', 'currencies', true);
}

export async function getExchangeRates(baseCurrency: string, date: string = 'latest'): Promise<ExchangeRateData> {
  const normalizedBaseCurrency = baseCurrency.toLowerCase();
  const response = await fetchWithFallback(date, `currencies/${normalizedBaseCurrency}`, true);
  
  if (response && response.date && response[normalizedBaseCurrency]) {
    return {
      date: response.date,
      base: normalizedBaseCurrency,
      rates: response[normalizedBaseCurrency] as Rates,
    };
  }
  console.error('Unexpected data structure for exchange rates:', response, `Base: ${normalizedBaseCurrency}, Date: ${date}`);
  throw new Error(`Could not fetch or parse exchange rates for ${baseCurrency} on ${date}. Invalid data format received.`);
}

export async function getHistoricalRates(
  baseCurrency: string,
  targetCurrency: string,
  dates: string[]
): Promise<HistoricalRatePoint[]> {
  const historicalData: HistoricalRatePoint[] = [];
  const normalizedTargetCurrency = targetCurrency.toLowerCase();

  const results = await Promise.allSettled(
    dates.map(date => getExchangeRates(baseCurrency, date))
  );

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      const rateData = result.value;
      if (rateData && rateData.rates && typeof rateData.rates[normalizedTargetCurrency] === 'number') {
        historicalData.push({
          date: rateData.date, 
          rate: rateData.rates[normalizedTargetCurrency],
        });
      } else {
        console.warn(`Rate for ${targetCurrency.toUpperCase()} from ${baseCurrency.toUpperCase()} was not available in the data for ${dates[index]}.`);
      }
    } else {
      // Log as warning for individual date misses, as some dates (holidays, weekends) might not have data.
      console.warn(`Historical data for ${baseCurrency.toUpperCase()}/${targetCurrency.toUpperCase()} on ${dates[index]} was unavailable. Reason: ${result.reason?.message || 'Unknown reason'}`);
    }
  });

  historicalData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  return historicalData;
}
