import React, { useState, useEffect, useCallback } from 'react';
import { CurrencyMap, CurrencyOption, ExchangeRateData, TimeRangeOption, TimeRangePreset, GroupedCurrencyOption, TranslationKey } from '../types';
import { getAllCurrencies, getExchangeRates } from '../services/currencyService';
import AmountInput from './AmountInput';
import CurrencySelector from './CurrencySelector';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import HistoricalChart from './HistoricalChart';
import Header from './Header';
import { useLocalization } from '../contexts/LocalizationContext';
import { currencyToCountryCodeMap, getFlagEmojiForCurrency } from '../utils/currencyUtils';

const timeRangePresets: TimeRangePreset[] = [
  { labelKey: 'timeRange7D', value: '7D', days: 7 },
  { labelKey: 'timeRange1M', value: '1M', days: 30 },
  { labelKey: 'timeRange1Y', value: '1Y', months: 12 },
];

// Expanded list of ~top world currencies (ensure lowercase)
// Cryptocurrencies and metals are excluded.
const topWorldCurrencyCodes: string[] = [
  // North America
  'usd', 'cad', 'mxn',
  // Europe
  'eur', 'gbp', 'chf', 'sek', 'nok', 'dkk', 'pln', 'huf', 'czk', 'isk', 'ron', 'bgn', 'hrk', 'rsd', 'all', 'bam', 'mdl', 'mkd', 'uah', 'rub', 'try', 
  // Asia
  'jpy', 'cny', 'inr', 'krw', 'hkd', 'sgd', 'aed', 'sar', 'ils', 'php', 'thb', 'vnd', 'myr', 'idr', 'pkr', 'iqd', 'qar', 'kwd', 'omr', 'bhd', 'jod', 'lkr', 'npr', 'bdt', 'kzt', 'gel', 'amd', 'azn', 'twd', 'afn',
  // Oceania
  'aud', 'nzd', 'pgk', 'fjd', 
  // South America
  'brl', 'ars', 'clp', 'cop', 'pen', 'uyu', 'pyg', 'bob', 'ves',
  // Africa
  'zar', 'egp', 'ngn', 'kes', 'ghs', 'mad', 'dzd', 'xof', 'xaf', 'ugx', 'tzs', 'etb', 'sdg', 'aoa', 'mzn', 'bwp', 'zmw', 'mur', 'nad', 'tnd', // Added TND
];


// Define a blacklist of common obsolete/former national currencies (lowercase)
const blacklistedObsoleteCurrencies = [
  'adp', 'ats', 'bef', 'cyp', 'dem', 'eek', 'esp', 'fim', 'frf', 'grd', 
  'iep', 'itl', 'luf', 'mtl', 'nlg', 'pte', 'sit', 'skk', 'val', // Eurozone pre-euro
  'trl', // Turkish Lira (old, replaced by TRY)
  'csd', // Serbian Dinar (old)
];

// Define regions and their currency mappings
type RegionName = 'NorthAmerica' | 'Europe' | 'Asia' | 'Oceania' | 'SouthAmerica' | 'Africa';
const regionDefinitions: Record<string, RegionName> = {
  // North America
  usd: 'NorthAmerica', cad: 'NorthAmerica', mxn: 'NorthAmerica',
  // Europe
  eur: 'Europe', gbp: 'Europe', chf: 'Europe', sek: 'Europe', nok: 'Europe', dkk: 'Europe',
  pln: 'Europe', huf: 'Europe', czk: 'Europe', isk: 'Europe', ron: 'Europe', bgn: 'Europe',
  hrk: 'Europe', rsd: 'Europe', all: 'Europe', bam: 'Europe', mdl: 'Europe', mkd: 'Europe',
  uah: 'Europe', rub: 'Europe', try: 'Europe', 
  // Asia
  jpy: 'Asia', cny: 'Asia', inr: 'Asia', krw: 'Asia', hkd: 'Asia', sgd: 'Asia',
  aed: 'Asia', sar: 'Asia', ils: 'Asia', php: 'Asia', thb: 'Asia', vnd: 'Asia',
  myr: 'Asia', idr: 'Asia', pkr: 'Asia', iqd: 'Asia', qar: 'Asia', kwd: 'Asia',
  omr: 'Asia', bhd: 'Asia', jod: 'Asia', lkr: 'Asia', npr: 'Asia', bdt: 'Asia',
  kzt: 'Asia', gel: 'Asia', amd: 'Asia', azn: 'Asia', twd: 'Asia', afn: 'Asia',
  // Oceania
  aud: 'Oceania', nzd: 'Oceania', pgk: 'Oceania', fjd: 'Oceania',
  // South America
  brl: 'SouthAmerica', ars: 'SouthAmerica', clp: 'SouthAmerica', cop: 'SouthAmerica',
  pen: 'SouthAmerica', uyu: 'SouthAmerica', pyg: 'SouthAmerica', bob: 'SouthAmerica', ves: 'SouthAmerica',
  // Africa
  zar: 'Africa', egp: 'Africa', ngn: 'Africa', kes: 'Africa', ghs: 'Africa',
  mad: 'Africa', dzd: 'Africa', xof: 'Africa', xaf: 'Africa', ugx: 'Africa',
  tzs: 'Africa', etb: 'Africa', sdg: 'Africa', aoa: 'Africa', mzn: 'Africa',
  bwp: 'Africa', zmw: 'Africa', mur: 'Africa', nad: 'Africa', tnd: 'Africa',
};

let regionOrder: RegionName[] = ['Africa', 'Asia', 'Europe', 'NorthAmerica', 'Oceania', 'SouthAmerica'];
const regionTranslationKeys: Record<RegionName, TranslationKey> = {
    NorthAmerica: 'regionNorthAmerica',
    Europe: 'regionEurope',
    Asia: 'regionAsia',
    Oceania: 'regionOceania',
    SouthAmerica: 'regionSouthAmerica',
    Africa: 'regionAfrica',
};


const CurrencyConverter: React.FC = () => {
  const { t, language } = useLocalization();
  const [amount, setAmount] = useState<string>('100');
  const [fromCurrency, setFromCurrency] = useState<string>('usd');
  const [toCurrency, setToCurrency] = useState<string>('aoa'); // Default to Angolan Kwanza (AOA) as per your request
  
  const [allCurrenciesMap, setAllCurrenciesMap] = useState<CurrencyMap | null>(null);
  const [currencyOptions, setCurrencyOptions] = useState<GroupedCurrencyOption[]>([]); // Updated type
  
  const [exchangeRateData, setExchangeRateData] = useState<ExchangeRateData | null>(null);
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  
  const [isLoadingCurrencies, setIsLoadingCurrencies] = useState<boolean>(true);
  const [isLoadingRates, setIsLoadingRates] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRangeOption>('1M');

  const getKnownSymbol = useCallback((currencyCode: string): string | undefined => {
    const lowerCode = currencyCode.toLowerCase();
    const symbols: { [key: string]: string } = {
      usd: '$', eur: '€', gbp: '£', jpy: '¥', aud: 'A$', cad: 'C$', chf: 'CHF',
      cny: 'CN¥', hkd: 'HK$', nzd: 'NZ$', sek: 'kr', nok: 'kr', dkk: 'kr', inr: '₹',
      rub: '₽', brl: 'R$', zar: 'R', try: '₺', krw: '₩', twd: 'NT$',
      aoa: 'Kz', afn: '؋', bdt: '৳', ngn: '₦', 
    };
    return symbols[lowerCode];
  }, []);
  
  const getCurrencySymbol = useCallback((currencyCode: string, locale: string): string => {
    const known = getKnownSymbol(currencyCode);
    if (known) return known;

    try {
      const parts = Intl.NumberFormat(locale, { style: 'currency', currency: currencyCode.toUpperCase(), currencyDisplay: 'narrowSymbol' }).formatToParts(0);
      const symbolPart = parts.find(part => part.type === 'currency');
      if (symbolPart && symbolPart.value !== currencyCode.toUpperCase()) return symbolPart.value;

      const partsSymbol = Intl.NumberFormat(locale, { style: 'currency', currency: currencyCode.toUpperCase(), currencyDisplay: 'symbol' }).formatToParts(0);
      const symbolPart2 = partsSymbol.find(part => part.type === 'currency');
      if (symbolPart2 && symbolPart2.value !== currencyCode.toUpperCase()) return symbolPart2.value;
      
    } catch (e) {
        console.warn(`Could not get symbol for ${currencyCode} via Intl.NumberFormat:`, e);
    }
    return currencyCode.toUpperCase();
  }, [getKnownSymbol]);

  const formatCurrencyValue = useCallback((value: number, locale: string, minFractionDigits: number = 2, maxFractionDigits: number = 2): string => {
    try {
      const formatter = new Intl.NumberFormat(locale, {
        minimumFractionDigits: minFractionDigits,
        maximumFractionDigits: maxFractionDigits,
      });
      const parts = formatter.formatToParts(value);
      return parts.map(part => (part.type === 'group' ? ' ' : part.value)).join('');
    } catch (e) {
      console.error("Error formatting currency value:", e);
      return value.toString(); 
    }
  }, []);
  
  const getRelativeTimeString = useCallback((apiDateString: string, currentLocale: string): string => {
    const apiDate = new Date(apiDateString + 'T00:00:00Z'); 
    const now = new Date();
    
    const diffSeconds = Math.round((now.getTime() - apiDate.getTime()) / 1000);
    const diffDays = Math.floor(diffSeconds / (3600 * 24));

    const todayUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const apiDateUtcMidnight = new Date(Date.UTC(apiDate.getUTCFullYear(), apiDate.getUTCMonth(), apiDate.getUTCDate()));

    if (apiDateUtcMidnight.getTime() === todayUtc.getTime()) {
        const hoursSinceMidnightUtc = now.getUTCHours();
        if (hoursSinceMidnightUtc < 1) return t('updatedNow');
        return t('updatedHoursAgo', hoursSinceMidnightUtc.toString());
    }
    if (diffDays === 0 || (diffDays === 1 && now.getUTCDate() !== apiDate.getUTCDate() && (now.getTime() - apiDate.getTime()) < 48 * 3600 * 1000) ) { 
        const yesterdayCheck = new Date(now);
        yesterdayCheck.setDate(now.getDate() -1);
        if(apiDate.getUTCFullYear() === yesterdayCheck.getUTCFullYear() &&
           apiDate.getUTCMonth() === yesterdayCheck.getUTCMonth() &&
           apiDate.getUTCDate() === yesterdayCheck.getUTCDate() ) {
            return t('updatedYesterday');
        }
    }
    return t('updatedOnDate', apiDate.toLocaleDateString(currentLocale, { year: 'numeric', month: 'numeric', day: 'numeric', timeZone: 'UTC' }));

  }, [t]);


  useEffect(() => {
    const fetchCurrencies = async () => {
      setIsLoadingCurrencies(true);
      setError(null);
      try {
        const rawCurrenciesData = await getAllCurrencies();
        const filteredCurrencies: CurrencyMap = {};
        const availableCurrencyCodes: string[] = [];

        for (const [code, name] of Object.entries(rawCurrenciesData)) {
          const lowerCode = code.toLowerCase();
        
          const isBlacklisted = blacklistedObsoleteCurrencies.includes(lowerCode);
          const isTopWorldCurrency = topWorldCurrencyCodes.includes(lowerCode);

          if (!isBlacklisted && isTopWorldCurrency) {
            filteredCurrencies[code] = name;
            availableCurrencyCodes.push(code);
          }
        }
        
        setAllCurrenciesMap(filteredCurrencies);

        let currentFrom = fromCurrency;
        let currentTo = toCurrency;

        if (availableCurrencyCodes.length > 0) {
            if (!availableCurrencyCodes.includes(fromCurrency.toLowerCase())) {
                currentFrom = availableCurrencyCodes[0];
                setFromCurrency(currentFrom);
            }
            if (!availableCurrencyCodes.includes(toCurrency.toLowerCase())) {
                currentTo = availableCurrencyCodes.length > 1 ? availableCurrencyCodes[1] : availableCurrencyCodes[0];
                 if (currentTo === currentFrom && availableCurrencyCodes.length > 1) {
                    currentTo = availableCurrencyCodes.find(k => k !== currentFrom) || availableCurrencyCodes[0];
                }
                setToCurrency(currentTo);
            } else if (currentTo === currentFrom && availableCurrencyCodes.length > 1) { // Ensure toCurrency is different from fromCurrency
                 currentTo = availableCurrencyCodes.find(k => k !== currentFrom) || (availableCurrencyCodes.length > 1 ? availableCurrencyCodes[1] : availableCurrencyCodes[0]);
                 setToCurrency(currentTo);
            }
        } else {
            setFromCurrency('usd'); 
            setToCurrency('eur');  
        }
        
        // Sort regionOrder alphabetically based on translated region names
        const sortedRegionOrder = [...regionOrder].sort((a, b) => {
            const nameA = t(regionTranslationKeys[a]);
            const nameB = t(regionTranslationKeys[b]);
            return nameA.localeCompare(nameB, language);
        });


        const grouped: Record<RegionName, CurrencyOption[]> = {} as Record<RegionName, CurrencyOption[]>;
        for (const region of sortedRegionOrder) { // Use sortedRegionOrder
            grouped[region] = [];
        }
        
        Object.entries(filteredCurrencies)
          .forEach(([code, name]) => {
            const lowerCode = code.toLowerCase();
            const region = regionDefinitions[lowerCode];
            if (region) {
                const flagEmoji = getFlagEmojiForCurrency(code);
                const label = `${flagEmoji} ${name} (${code.toUpperCase()})`.trim();
                grouped[region].push({
                    value: code,
                    label: label,
                });
            }
          });

        const groupedOptions: GroupedCurrencyOption[] = sortedRegionOrder // Use sortedRegionOrder
            .map(regionName => {
                const currencies = grouped[regionName];
                if (currencies && currencies.length > 0) {
                    // Sort currencies alphabetically within the region
                    currencies.sort((a, b) => a.label.localeCompare(b.label));
                    return {
                        regionKey: regionTranslationKeys[regionName],
                        currencies: currencies,
                    };
                }
                return null; 
            })
            .filter(group => group !== null) as GroupedCurrencyOption[];

        setCurrencyOptions(groupedOptions);

      } catch (err) {
        console.error("Failed to fetch all currencies:", err);
        setError(t('errorTitle') + ': ' + 'Failed to load currency list. Please try refreshing the page.');
        setCurrencyOptions([]); 
        setAllCurrenciesMap({});
      } finally {
        setIsLoadingCurrencies(false);
      }
    };
    fetchCurrencies();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, language]); // Added language to dependencies to re-sort regions on language change

  const fetchLatestRates = useCallback(async () => {
    if (!fromCurrency) return;

    setIsLoadingRates(true);
    setError(null);
    setConvertedAmount(null);
    try {
      const ratesData = await getExchangeRates(fromCurrency, 'latest');
      setExchangeRateData(ratesData);
    } catch (err) {
      console.error("Failed to fetch exchange rates:", err);
      setError(t('errorTitle') + ': ' + t('fetchingRates', fromCurrency.toUpperCase()) + ' ' + (err as Error).message);
      setExchangeRateData(null);
    } finally {
      setIsLoadingRates(false);
    }
  }, [fromCurrency, t]);

  useEffect(() => {
    if (fromCurrency && currencyOptions.length > 0) { 
        fetchLatestRates();
    }
  }, [fetchLatestRates, fromCurrency, currencyOptions.length]); 

  useEffect(() => {
    if (exchangeRateData && exchangeRateData.rates && toCurrency) {
      const rate = exchangeRateData.rates[toCurrency.toLowerCase()];
      const numericAmount = parseFloat(amount);
      if (rate && !isNaN(numericAmount)) {
        setConvertedAmount(numericAmount * rate);
        setError(null); 
      } else {
        setConvertedAmount(null);
        if (fromCurrency !== toCurrency && !rate && allCurrenciesMap && allCurrenciesMap[toCurrency.toLowerCase()]) {
           setError(t('noRateOrInvalidSelectionError'));
        }
      }
    }
  }, [amount, toCurrency, exchangeRateData, fromCurrency, allCurrenciesMap, t]);

  const handleSwapCurrencies = () => {
    if (currencyOptions.flatMap(g => g.currencies).length < 2) return;
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };
  
  const handleAmountChange = (newAmount: string) => {
    setAmount(newAmount);
  };

  const numericAmount = parseFloat(amount);
  const currentLocale = language === 'pt-PT' ? 'pt-PT' : 'en-US';
  
  const fromCountryFlagCode = currencyToCountryCodeMap[fromCurrency.toLowerCase()];
  const toCountryFlagCode = currencyToCountryCodeMap[toCurrency.toLowerCase()];


  return (
    <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-2xl mx-auto">
            {/* LANGUAGE BUTTON - Top Right */}
      <div className="flex justify-end mb-4">
        <button
          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs whitespace-nowrap"
          aria-label="Change Language"
        >
          🌐 EN
        </button>
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 items-end">
          <AmountInput
            id="amount"
            label={t('amountLabel')}
            value={amount}
            onChange={handleAmountChange}
            disabled={isLoadingCurrencies}
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <CurrencySelector
            id="fromCurrency"
            label={t('fromLabel')}
            options={currencyOptions}
            selectedValue={fromCurrency}
            onChange={setFromCurrency}
            disabled={isLoadingCurrencies || currencyOptions.length === 0}
            className="w-full sm:w-auto"
          />
          <button
            onClick={handleSwapCurrencies}
            title={t('swapButtonLabel')}
            aria-label={t('swapButtonLabel')}
            className="p-3 mt-3 sm:mt-6 self-center sm:self-auto bg-slate-100 hover:bg-slate-200 rounded-full text-[#1865f2] transition-colors duration-150"
            disabled={isLoadingCurrencies || isLoadingRates || currencyOptions.flatMap(g => g.currencies).length < 2}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h18m-7.5-14L21 6.5m0 0L16.5 12M21 6.5H3" />
            </svg>
          </button>
          <CurrencySelector
            id="toCurrency"
            label={t('toLabel')}
            options={currencyOptions}
            selectedValue={toCurrency}
            onChange={setToCurrency}
            disabled={isLoadingCurrencies || currencyOptions.length === 0}
            className="w-full sm:w-auto"
          />
        </div>
        
        {isLoadingCurrencies && <LoadingSpinner text={t('loadingCurrencies')} />}
        <ErrorMessage message={error} />

        {!isLoadingCurrencies && (isLoadingRates ? (
          <LoadingSpinner text={t('fetchingRates', fromCurrency.toUpperCase())} />
        ) : (
          exchangeRateData && !isNaN(numericAmount) && numericAmount > 0 && (
            <div className="mt-6 p-6 bg-sky-50 rounded-lg text-center shadow">
              {convertedAmount !== null ? (
                <>
                  <div className="flex items-center justify-center text-xl font-medium text-slate-700">
                    {fromCountryFlagCode && <img src={`https://flagcdn.com/w20/${fromCountryFlagCode}.png`} alt={`${fromCurrency} flag`} className="w-5 h-auto mr-2"/>}
                    <span>{getCurrencySymbol(fromCurrency, currentLocale)} {formatCurrencyValue(numericAmount, currentLocale, 2, 2)} =</span>
                  </div>
                  <div className="flex items-center justify-center text-2xl sm:text-3xl font-bold text-[#1865f2] my-2" aria-live="polite">
                    {toCountryFlagCode && <img src={`https://flagcdn.com/w20/${toCountryFlagCode}.png`} alt={`${toCurrency} flag`} className="w-5 h-auto mr-2"/>}
                    <span>{getCurrencySymbol(toCurrency, currentLocale)} {formatCurrencyValue(convertedAmount, currentLocale, 2, 2)}</span>
                  </div>
                  {exchangeRateData.rates[toCurrency.toLowerCase()] && (
                     <p className="text-sm text-slate-500">
                      1 {fromCurrency.toUpperCase()} = {getCurrencySymbol(toCurrency, currentLocale)} {formatCurrencyValue(exchangeRateData.rates[toCurrency.toLowerCase()], currentLocale, 2, 2)}
                     </p>
                  )}
                  <p className="text-xs text-slate-400 mt-2">
                    {getRelativeTimeString(exchangeRateData.date, currentLocale)}
                  </p>
                </>
              ) : (
                 fromCurrency !== toCurrency && !error && amount !== '' && parseFloat(amount) > 0 && (
                   <p className="text-slate-500">
                     {amount === '' || parseFloat(amount) <=0 ? t('noAmountError') : (fromCurrency && toCurrency ? t('noRateOrInvalidSelectionError') : t('selectCurrenciesError'))}
                   </p>
                 )
              )}
            </div>
          )
        ))}
      </div>

      {!isLoadingCurrencies && allCurrenciesMap && Object.keys(allCurrenciesMap).length > 0 && fromCurrency && toCurrency && fromCurrency !== toCurrency && (
        <div className="mt-10 pt-6 border-t border-slate-200">
          <h2 className="text-2xl font-semibold text-slate-800 mb-4 text-center">
            {t('historicalRatesTitle', fromCurrency.toUpperCase(), toCurrency.toUpperCase())}
          </h2>
          <div className="flex justify-center gap-2 mb-6 flex-wrap">
            {timeRangePresets.map(preset => (
              <button
                key={preset.value}
                onClick={() => setSelectedTimeRange(preset.value)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors
                  ${selectedTimeRange === preset.value 
                    ? 'bg-[#1865f2] text-white' 
                    : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}
              >
                {t(preset.labelKey)}
              </button>
            ))}
          </div>
          <HistoricalChart
            fromCurrency={fromCurrency}
            toCurrency={toCurrency}
            timeRange={selectedTimeRange}
            allCurrenciesMap={allCurrenciesMap} 
            timeRangePresets={timeRangePresets}
          />
        </div>
      )}
    </div>
  );
};

export default CurrencyConverter;