import { SummaryDetailSnapshot } from '../types';
import type { SummaryDetail as YahooSummaryDetail } from '../yahoo-types';

export function getSummaryDetail(sd: YahooSummaryDetail): SummaryDetailSnapshot {
  return {
    open: sd.open!,
    previousClose: sd.previousClose!,
    dayLow: sd.dayLow!,
    dayHigh: sd.dayHigh!,
    volume: sd.volume!,
    averageVolume: sd.averageVolume!,
    beta: sd.beta!,
    payoutRatio: sd.payoutRatio!,
    priceToSalesTrailing12Months: sd.priceToSalesTrailing12Months!,
    gapPct: (sd.open! - sd.previousClose!) / sd.previousClose!,
    intradayRangePct: (sd.dayHigh! - sd.dayLow!) / sd.dayLow!,
    relativeVolume: sd.volume! / sd.averageVolume!,
  };
} 