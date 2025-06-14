import { BalanceSheetQuarterly } from '../types';
import type { BalanceSheetHistoryQuarterly as YahooBalanceSheetHistoryQuarterly } from '../yahoo-types';

export function getBalanceSheetsQuarterly(bs: YahooBalanceSheetHistoryQuarterly): BalanceSheetQuarterly[] {
  const balanceSheetsQuarterly: BalanceSheetQuarterly[] =
    bs.balanceSheetStatements
      .filter((q: any): q is Required<typeof q> => q !== undefined)
      .slice(0, 9)
      .map((q: any) => ({
        endDate: q.endDate,
        cash: q.cash,
        shortTermInvestments: q.shortTermInvestments,
        netReceivables: q.netReceivables,
        totalCurrentAssets: q.totalCurrentAssets,
        totalCurrentLiabilities: q.totalCurrentLiabilities,
        longTermDebt: q.longTermDebt,
        totalLiab: q.totalLiab,
        totalStockholderEquity: q.totalStockholderEquity,
        netTangibleAssets: q.netTangibleAssets,
        currentRatio: q.totalCurrentAssets / q.totalCurrentLiabilities,
        quickRatio: (q.totalCurrentAssets - q.inventory) / q.totalCurrentLiabilities,
        workingCapital: q.totalCurrentAssets - q.totalCurrentLiabilities,
        debtToEquity: q.totalLiab / q.totalStockholderEquity,
        netDebt: q.longTermDebt + (q.cash - q.shortTermInvestments),
      }));

  return balanceSheetsQuarterly.map((q, i, arr) => {
    const prevQ = arr[i - 1];
    if (!prevQ) {
      return q;
    }
    return {
      ...q,
      assetsGrowthQoQ: (q.totalCurrentAssets - prevQ.totalCurrentAssets) / prevQ.totalCurrentAssets,
      equityGrowthQoQ: (q.totalStockholderEquity - prevQ.totalStockholderEquity) / prevQ.totalStockholderEquity,
      netDebtChangeQoQ: q.netDebt - prevQ.netDebt,
    };
  });
} 