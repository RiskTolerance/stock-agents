import { FinancialDataSummary, SimpleQuoteData } from '../types';
import type { FinancialData as YahooFinancialData } from '../yahoo-types';

export function getFinancialOverview(fd: YahooFinancialData, simpleQuoteData: SimpleQuoteData): FinancialDataSummary {
  return {
    currentPrice: fd.currentPrice!,
    priceTargets: {
      high: fd.targetHighPrice!,
      mean: fd.targetMeanPrice!,
      low: fd.targetLowPrice!,
      median: fd.targetMedianPrice!,
    },
    analystSentiment: {
      meanRating: fd.recommendationMean!,
      key: fd.recommendationKey!,
      opinions: fd.numberOfAnalystOpinions!,
    },
    cash: {
      total: fd.totalCash!,
      perShare: fd.totalCashPerShare!,
    },
    debt: { total: fd.totalDebt! },
    ebitda: fd.ebitda!,
    ratios: {
      quick: fd.quickRatio!,
      current: fd.currentRatio!,
      debtToEquity: fd.debtToEquity!,
    },
    revenue: {
      total: fd.totalRevenue!,
      perShare: fd.revenuePerShare!,
    },
    cashFlows: {
      operating: fd.operatingCashflow!,
      free: fd.freeCashflow!,
    },
    growth: {
      revenue: fd.revenueGrowth!,
      earnings: fd.earningsGrowth!,
    },
    margins: {
      gross: fd.grossMargins!,
      ebitda: fd.ebitdaMargins!,
      operating: fd.operatingMargins!,
      profit: fd.profitMargins!,
    },
    upsidePct: (fd.targetMeanPrice! - fd.currentPrice!) / fd.currentPrice!,
    cashYield: fd.totalCash! / simpleQuoteData.marketCap!,
    fcfYield: fd.freeCashflow! / simpleQuoteData.marketCap!,
    opCfMargin: fd.operatingCashflow! / fd.totalRevenue!,
    growthDiff: fd.earningsGrowth! - fd.revenueGrowth!,
  };
} 