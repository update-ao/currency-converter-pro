
import React, { useEffect, useRef, useState } from 'react';
import { Chart } from 'chart.js/auto';
import { getHistoricalRates } from '../services/currencyService';
import { HistoricalRatePoint, TimeRangeOption, CurrencyMap, TimeRangePreset } from '../types';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import { useLocalization } from '../contexts/LocalizationContext';

interface HistoricalChartProps {
  fromCurrency: string;
  toCurrency: string;
  timeRange: TimeRangeOption;
  allCurrenciesMap: CurrencyMap | null;
  timeRangePresets: TimeRangePreset[];
}

const HistoricalChart: React.FC<HistoricalChartProps> = ({
  fromCurrency,
  toCurrency,
  timeRange,
  allCurrenciesMap,
  timeRangePresets
}) => {
  const { t, language } = useLocalization();
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalRatePoint[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!fromCurrency || !toCurrency || !allCurrenciesMap || fromCurrency === toCurrency) {
      setHistoricalData(null); 
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
      return;
    }

    const fetchHistoricalData = async () => {
      setIsLoading(true);
      setError(null);
      setHistoricalData(null);

      try {
        const referenceDate = new Date(); // Use today as a basis
        referenceDate.setDate(referenceDate.getDate() - 1); // Set to yesterday, the latest possible historical data point
        referenceDate.setHours(0, 0, 0, 0); // Normalize to midnight for consistent comparisons

        const datesToFetchStrings: string[] = [];
        const selectedPreset = timeRangePresets.find(p => p.value === timeRange);

        if (!selectedPreset) {
            throw new Error("Invalid time range selected");
        }

        if (selectedPreset.days) { 
            for (let i = 0; i < selectedPreset.days; i++) {
                const date = new Date(referenceDate);
                date.setDate(referenceDate.getDate() - i); // Days backward from yesterday
                datesToFetchStrings.push(date.toISOString().split('T')[0]);
            }
        } else if (selectedPreset.months) { 
            for (let i = 0; i < selectedPreset.months; i++) {
                // Get the 1st of the month, going back 'i' months from referenceDate's month
                const date = new Date(referenceDate.getFullYear(), referenceDate.getMonth() - i, 1);
                datesToFetchStrings.push(date.toISOString().split('T')[0]);
            }
        } else if (selectedPreset.years) { 
            for (let i = 0; i < selectedPreset.years; i++) {
                // Get Jan 1st of the year, going back 'i' years from referenceDate's year
                const date = new Date(referenceDate.getFullYear() - i, 0, 1); 
                datesToFetchStrings.push(date.toISOString().split('T')[0]);
            }
        }
        
        // Filter out duplicates, ensure dates are not after referenceDate (yesterday), and sort them
        const uniqueValidDates = [...new Set(datesToFetchStrings)]
          .map(dStr => new Date(dStr + "T00:00:00Z")) // Treat as UTC midnight for comparison
          .filter(d => d.getTime() <= referenceDate.getTime()) // Ensure no date is after yesterday
          .sort((a, b) => a.getTime() - b.getTime()) // Sort chronologically (oldest to newest)
          .map(d => d.toISOString().split('T')[0]); // Convert back to string format YYYY-MM-DD

        if (uniqueValidDates.length === 0) {
          setError(t('noHistoricalDataFoundError', fromCurrency.toUpperCase(), toCurrency.toUpperCase()));
          setHistoricalData([]);
          setIsLoading(false);
          return;
        }
        
        const data = await getHistoricalRates(fromCurrency, toCurrency, uniqueValidDates);
        if (data.length === 0) {
          setError(t('noHistoricalDataFoundError', fromCurrency.toUpperCase(), toCurrency.toUpperCase()));
          setHistoricalData([]);
        } else {
          setHistoricalData(data);
        }
      } catch (err) {
        console.error('Failed to fetch historical rates:', err);
        setError(`${t('failedToLoadHistoricalError')} ${(err as Error).message}`);
        setHistoricalData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistoricalData();
  }, [fromCurrency, toCurrency, timeRange, allCurrenciesMap, timeRangePresets, t]);

  useEffect(() => {
    if (chartRef.current && historicalData) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      if (historicalData.length === 0 && !isLoading && !error) {
        return;
      }
      if (historicalData.length === 0 && error) {
        return;
      }
      
      const currentLocale = language === 'pt-PT' ? 'pt-PT' : 'en-US';

      const labels = historicalData.map(point => 
        new Date(point.date + "T00:00:00Z").toLocaleDateString(currentLocale, { // Assume date is YYYY-MM-DD, treat as UTC
            month: 'short', 
            day: 'numeric', 
            year: (timeRange === '1Y' || historicalData.length === 0 || new Date(historicalData[0].date).getFullYear() !== new Date(historicalData[historicalData.length-1].date).getFullYear() ? 'numeric' : undefined),
            timeZone: 'UTC' 
        })
      );
      const dataPoints = historicalData.map(point => point.rate);

      const gridColor = 'rgba(0, 0, 0, 0.05)';
      const textColor = 'rgba(55, 65, 81, 1)'; 

      chartInstanceRef.current = new Chart(chartRef.current, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: t('historicalChartLabel', fromCurrency.toUpperCase(), toCurrency.toUpperCase()),
              data: dataPoints,
              borderColor: '#1865f2', 
              backgroundColor: 'rgba(24, 101, 242, 0.1)',
              tension: 0.1,
              fill: true,
              pointRadius: historicalData.length > 30 ? 2 : 4,
              pointBackgroundColor: '#1865f2',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              grid: {
                color: gridColor,
              },
              ticks: {
                color: textColor,
                maxRotation: historicalData.length > 15 ? 45 : 0,
                minRotation: 0,
                autoSkip: true,
                maxTicksLimit: timeRange === '1M' ? 15 : (timeRange === '7D' ? 7 : 12),
              },
            },
            y: {
              grid: {
                color: gridColor,
              },
              ticks: {
                color: textColor,
                callback: function(value) {
                    if (typeof value === 'number') {
                        return value.toLocaleString(currentLocale, {minimumFractionDigits:2, maximumFractionDigits:2});
                    }
                    return value;
                }
              },
            },
          },
          plugins: {
            legend: {
              labels: {
                color: textColor,
              }
            },
            tooltip: {
              enabled: true,
              mode: 'index',
              intersect: false,
              backgroundColor: 'rgba(255,255,255,0.9)',
              titleColor: '#333',
              bodyColor: '#333',
              borderColor: '#ddd',
              borderWidth: 1,
              callbacks: {
                label: function (context) {
                    let label = context.dataset.label || '';
                    if (label) {
                        label += ': ';
                    }
                    if (context.parsed.y !== null) {
                        label += context.parsed.y.toLocaleString(currentLocale, {minimumFractionDigits:2, maximumFractionDigits:2});
                    }
                    return label;
                }
              }
            },
          },
        },
      });
    }
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [historicalData, fromCurrency, toCurrency, timeRange, isLoading, error, t, language]);

  if (fromCurrency === toCurrency) {
    return (
        <div className="text-center py-4 text-slate-600">
            {t('sameCurrencyInfo')}
        </div>
    );
  }

  return (
    <div className="h-72 md:h-96 relative bg-white p-4 rounded-lg shadow-inner">
      {isLoading && <LoadingSpinner text={t('loadingHistoricalData')} />}
      <ErrorMessage message={error} />
      {!isLoading && !error && historicalData && historicalData.length === 0 && (
        <div className="flex items-center justify-center h-full">
             <p className="text-slate-500">
                {t('noHistoricalDataAvailable')}
             </p>
        </div>
      )}
      <canvas ref={chartRef} aria-label={t('historicalChartLabel', fromCurrency.toUpperCase(), toCurrency.toUpperCase())}></canvas>
    </div>
  );
};

export default HistoricalChart;