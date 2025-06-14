import { BalanceSheetYearly } from '../types';
import type { BalanceSheetHistory as YahooBalanceSheetHistory } from '../yahoo-types';

export function getBalanceSheetsYearly(bs: YahooBalanceSheetHistory): BalanceSheetYearly[] {
  return bs.balanceSheetStatements
    .filter((q: any): q is Required<typeof q> => q !== undefined)
    .slice(0, 2)
    .map((q: any) => ({
      endDate: q.endDate,
      cash: q.cash,
      shortTermInvestments: q.shortTermInvestments,
      totalCurrentAssets: q.totalCurrentAssets,
      totalCurrentLiabilities: q.totalCurrentLiabilities,
      totalAssets: q.totalAssets,
      totalLiab: q.totalLiab,
      totalStockholderEquity: q.totalStockholderEquity,
      netTangibleAssets: q.netTangibleAssets,
      currentRatio: q.totalCurrentAssets / q.totalCurrentLiabilities,
      workingCapital: q.totalCurrentAssets - q.totalCurrentLiabilities,
      debtToEquity: q.totalLiab / q.totalStockholderEquity,
      netDebt: q.longTermDebt + (q.cash - q.shortTermInvestments),
    }));
} 