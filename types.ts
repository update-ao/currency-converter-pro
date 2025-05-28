
import { translations } from './contexts/translations'; // Import for TranslationKey

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations['en']; // Assuming 'en' has all keys

export interface CurrencyMap {
  [currencyCode: string]: string; // e.g. {"usd": "US Dollar", "eur": "Euro"}
}

export interface Rates {
  [currencyCode: string]: number; // e.g. {"eur": 0.92, "gbp": 0.78}
}

export interface ExchangeRateData {
  date: string; // Date of the rates
  base: string; // Base currency code
  rates: Rates; // Rates against the base currency
}

export interface CurrencyOption {
  value: string; // Currency code, e.g., "usd"
  label: string; // Currency name and code, e.g., "US Dollar (USD)"
}

export interface GroupedCurrencyOption {
  regionKey: TranslationKey; // Translation key for the region name
  currencies: CurrencyOption[];
}

export interface HistoricalRatePoint {
  date: string; // YYYY-MM-DD
  rate: number;
}

export type TimeRangeOption = '7D' | '1M' | '1Y';

export interface TimeRangePreset {
  labelKey: TranslationKey; // Use TranslationKey for translatable labels
  value: TimeRangeOption;
  days?: number; // For daily ranges
  months?: number; // For monthly ranges (number of months back)
  years?: number; // For yearly ranges (number of years back)
}