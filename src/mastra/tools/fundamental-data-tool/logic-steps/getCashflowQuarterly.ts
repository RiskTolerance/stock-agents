import { CashflowQuarterly, OverviewStatistics } from '../types';
import type { CashflowStatementHistoryQuarterly as YahooCashflowStatementHistoryQuarterly } from '../yahoo-types';

export function getCashflowQuarterly(cshq: YahooCashflowStatementHistoryQuarterly, overviewStatistics: OverviewStatistics): CashflowQuarterly[] {
  let cashflowQuarterly: CashflowQuarterly[] = cshq.cashflowStatements
    .filter((q: any): q is Required<typeof q> => q !== undefined)
    .slice(0, 8)
    .map((c: any) => ({
      endDate: c.endDate!,
      netIncome: c.netIncome!,
      totalCashFromOperatingActivities: c.totalCashFromOperatingActivities!,
      depreciation: c.depreciation!,
      capitalExpenditures: c.capitalExpenditures!,
      totalCashflowsFromInvestingActivities: c.totalCashflowsFromInvestingActivities!,
      dividendsPaid: c.dividendsPaid!,
      repurchaseOfStock: c.repurchaseOfStock!,
      issuanceOfStock: c.issuanceOfStock!,
      netBorrowings: c.netBorrowings!,
      totalCashFromFinancingActivities: c.totalCashFromFinancingActivities!,
      changeInCash: c.changeInCash!,
      freeCashFlow: c.totalCashFromOperatingActivities! + c.capitalExpenditures!,
    }));

  cashflowQuarterly = cashflowQuarterly.map((curr, i, arr) => {
    const prev = arr[i + 1];
    const marketCap = overviewStatistics.simpleQuoteData.marketCap;
    const cfoGrowthYoY = prev
      ? (curr.totalCashFromOperatingActivities - prev.totalCashFromOperatingActivities) /
        prev.totalCashFromOperatingActivities
      : undefined;
    const fcfGrowthYoY = prev
      ? (curr.freeCashFlow - prev.freeCashFlow) / prev.freeCashFlow
      : undefined;
    return {
      ...curr,
      cfoGrowthYoY,
      fcfGrowthYoY,
      dividendPayoutRatio: curr.dividendsPaid / curr.totalCashFromOperatingActivities,
      buybackYield: curr.repurchaseOfStock / marketCap,
      netLeverageChange: curr.netBorrowings / curr.totalCashFromOperatingActivities,
    };
  });
  return cashflowQuarterly;
} 