
export const translations = {
  en: {
    // Header
    headerTitle: "Currency Converter Pro",
    headerSubtitle: "Fast & Reliable Exchange Rates",
    switchToPortuguese: "Ver em Português",
    switchToEnglish: "View in English",

    // Footer
    footerCreatedBy: "Created by ",
    footerAuthorName: "Carlos Araújo",
    footerDisclaimer: "Daily updated exchange rates.",

    // CurrencyConverter
    amountLabel: "Amount",
    fromLabel: "From",
    toLabel: "To",
    swapButtonLabel: "Swap from and to currencies",
    loadingCurrencies: "Loading currencies...",
    fetchingRates: (currency: string) => `Fetching latest rates for ${currency}...`,
    resultPrefix: (amount: string, from: string) => `${amount} ${from} =`,
    rateInfo: (from: string, rate: string, to: string) => `1 ${from} = ${rate} ${to}`,
    
    // Relative time for rate updates
    updatedNow: "Rates updated just now",
    updatedMinutesAgo: (minutes: string) => `Rates updated ${minutes} minutes ago`,
    updatedHoursAgo: (hours: string) => `Rates updated ${hours} hours ago`,
    updatedYesterday: "Rates updated yesterday",
    updatedOnDate: (date: string) => `Rates as of ${date}`,

    noAmountError: "Enter an amount to convert.",
    selectCurrenciesError: "Select currencies to convert.",
    noRateOrInvalidSelectionError: "Rate not available or invalid selection.",
    historicalRatesTitle: (from: string, to: string) => `Historical Rates: ${from} to ${to}`,
    timeRange7D: "7 Days",
    timeRange1M: "1 Month",
    timeRange1Y: "1 Year",
    
    // CurrencySelector
    loadingCurrenciesDropdown: "Loading currencies...",
    
    // Region Names for CurrencySelector
    regionNorthAmerica: "North America",
    regionEurope: "Europe",
    regionAsia: "Asia",
    regionOceania: "Oceania",
    regionSouthAmerica: "South America",
    regionAfrica: "Africa",

    // ErrorMessage
    errorTitle: "Error",

    // HistoricalChart
    historicalChartLabel: (from: string, to: string) => `Rate (${from}/${to})`,
    loadingHistoricalData: "Loading historical data...",
    noHistoricalDataFoundError: (from: string, to: string) => `No historical data found for ${from.toUpperCase()} to ${to.toUpperCase()} in the selected range.`,
    failedToLoadHistoricalError: "Failed to load historical rates.",
    noHistoricalDataAvailable: "No historical data available for the selected range and currencies.",
    sameCurrencyInfo: "Historical data is not shown when 'From' and 'To' currencies are the same."
  },
  'pt-PT': {
    // Header
    headerTitle: "Conversor de Moedas Pro",
    headerSubtitle: "Taxas de Câmbio Rápidas e Confiáveis",
    switchToPortuguese: "Ver em Português",
    switchToEnglish: "View in English",

    // Footer
    footerCreatedBy: "Criado por ",
    footerAuthorName: "Carlos Araújo",
    footerDisclaimer: "Taxas de câmbio atualizadas diariamente.",

    // CurrencyConverter
    amountLabel: "Quantia",
    fromLabel: "De",
    toLabel: "Para",
    swapButtonLabel: "Inverter moedas de origem e destino",
    loadingCurrencies: "A carregar moedas...",
    fetchingRates: (currency: string) => `A obter taxas mais recentes para ${currency}...`,
    resultPrefix: (amount: string, from: string) => `${amount} ${from} =`,
    rateInfo: (from: string, rate: string, to: string) => `1 ${from} = ${rate} ${to}`,
    
    // Relative time for rate updates
    updatedNow: "Taxas atualizadas agora mesmo",
    updatedMinutesAgo: (minutes: string) => `Taxas atualizadas há ${minutes} minutos`,
    updatedHoursAgo: (hours: string) => `Taxas atualizadas há ${hours} horas`,
    updatedYesterday: "Taxas atualizadas ontem",
    updatedOnDate: (date: string) => `Taxas de ${date}`,
    
    noAmountError: "Introduza uma quantia para converter.",
    selectCurrenciesError: "Selecione as moedas para converter.",
    noRateOrInvalidSelectionError: "Taxa não disponível ou seleção inválida.",
    historicalRatesTitle: (from: string, to: string) => `Taxas Históricas: ${from} para ${to}`,
    timeRange7D: "7 Dias",
    timeRange1M: "1 Mês",
    timeRange1Y: "1 Ano",

    // CurrencySelector
    loadingCurrenciesDropdown: "A carregar moedas...",

    // Region Names for CurrencySelector
    regionNorthAmerica: "América do Norte",
    regionEurope: "Europa",
    regionAsia: "Ásia",
    regionOceania: "Oceânia",
    regionSouthAmerica: "América do Sul",
    regionAfrica: "África",

    // ErrorMessage
    errorTitle: "Erro",
    
    // HistoricalChart
    historicalChartLabel: (from: string, to: string) => `Taxa (${from}/${to})`,
    loadingHistoricalData: "A carregar dados históricos...",
    noHistoricalDataFoundError: (from: string, to: string) => `Nenhum dado histórico encontrado para ${from.toUpperCase()} para ${to.toUpperCase()} no intervalo selecionado.`,
    failedToLoadHistoricalError: "Falha ao carregar taxas históricas.",
    noHistoricalDataAvailable: "Nenhum dado histórico disponível para o intervalo e moedas selecionados.",
    sameCurrencyInfo: "Os dados históricos não são apresentados quando as moedas 'De' e 'Para' são iguais."
  }
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations['en'];