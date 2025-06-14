import { OverviewStatistics, SimpleQuoteData, DefaultKeyStatistics } from '../types';
import type { Quote as YahooQuote, DefaultKeyStatistics as YahooDefaultKeyStatistics } from '../yahoo-types';


export function getOverviewStatistics(q: YahooQuote, dks: YahooDefaultKeyStatistics): OverviewStatistics {
  const simpleQuoteData: SimpleQuoteData = {
    marketCap: q.marketCap!,
    sharesOutstanding: q.sharesOutstanding!,
    bookValue: q.bookValue!,
    priceToBook: q.priceToBook!,
    trailingPE: q.trailingPE!,
    forwardPE: q.forwardPE!,
    epsTrailingTwelveMonths: q.epsTrailingTwelveMonths!,
    epsForward: q.epsForward!,
    fiftyTwoWeekRange: {
      low: q.fiftyTwoWeekLow!,
      high: q.fiftyTwoWeekHigh!,
    },
    fiftyTwoWeekChangePercent: q.fiftyTwoWeekChangePercent!,
    fiftyDayAverage: q.fiftyDayAverage!,
    twoHundredDayAverage: q.twoHundredDayAverage!,
    dividendDate: q.dividendDate!,
    trailingAnnualDividendRate: q.trailingAnnualDividendRate!,
    trailingAnnualDividendYield: q.trailingAnnualDividendYield!,
  };

  const defaultKeyStatistics: DefaultKeyStatistics = {
    enterpriseValue: dks.enterpriseValue!,
    profitMargins: dks.profitMargins!,
    enterpriseToRevenue: dks.enterpriseToRevenue!,
    enterpriseToEbitda: dks.enterpriseToEbitda!,
    floatShares: dks.floatShares!,
    sharesShort: dks.sharesShort!,
    sharesPercentSharesOut: dks.sharesPercentSharesOut!,
    shortRatio: dks.shortRatio!,
    heldPercentInsiders: dks.heldPercentInsiders!,
    heldPercentInstitutions: dks.heldPercentInstitutions!,
    week52Change: dks['52WeekChange']!,
    sp500Week52Change: dks.SandP52WeekChange!,
  };

  return {
    simpleQuoteData,
    defaultKeyStatistics,
  };
} 