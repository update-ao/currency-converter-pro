// utils/currencyUtils.ts

export const currencyToCountryCodeMap: Record<string, string> = {
  usd: 'us', eur: 'eu', gbp: 'gb', jpy: 'jp', aud: 'au', cad: 'ca', chf: 'ch',
  cny: 'cn', hkd: 'hk', nzd: 'nz', sek: 'se', krw: 'kr', sgd: 'sg', nok: 'no',
  mxn: 'mx', inr: 'in', rub: 'ru', zar: 'za', brl: 'br', try: 'tr', aed: 'ae',
  ars: 'ar', bgn: 'bg', bhd: 'bh', bob: 'bo', bwp: 'bw', clp: 'cl', cop: 'co',
  czk: 'cz', dkk: 'dk', dzd: 'dz', egp: 'eg', fjd: 'fj', gel: 'ge', ghs: 'gh',
  hrk: 'hr', huf: 'hu', idr: 'id', ils: 'il', isk: 'is', jod: 'jo', kes: 'ke',
  kwd: 'kw', kzt: 'kz', lkr: 'lk', mad: 'ma', mdl: 'md', mkd: 'mk', mur: 'mu',
  myr: 'my', nad: 'na', ngn: 'ng', omr: 'om', pen: 'pe', pgk: 'pg', php: 'ph',
  pkr: 'pk', pln: 'pl', pyg: 'py', qar: 'qa', ron: 'ro', rsd: 'rs', sar: 'sa',
  thb: 'th', tnd: 'tn', uah: 'ua', ugx: 'ug', uyu: 'uy', vnd: 'vn', 
  xaf: 'cm', // Central African CFA - Cameroon as representative
  xof: 'sn', // West African CFA - Senegal as representative
  all: 'al', bam: 'ba', amd: 'am', azn: 'az', bdt: 'bd', etb: 'et', iqd: 'iq',
  mzn: 'mz', npr: 'np', sdg: 'sd', tzs: 'tz', ves: 've', zmw: 'zm', twd: 'tw',
  aoa: 'ao', // Angolan Kwanza
  // Add more mappings as needed for the comprehensive list
};

// Helper to convert 2-letter country code to flag emoji
function countryCodeToEmoji(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return '';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0)); // Regional Indicator Symbol Letter
  return String.fromCodePoint(...codePoints);
}

export function getFlagEmojiForCurrency(currencyCode: string): string {
  const country = currencyToCountryCodeMap[currencyCode.toLowerCase()];
  return country ? countryCodeToEmoji(country) : ''; // Return empty string if no flag
}
