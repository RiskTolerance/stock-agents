export interface Quote {
  language:                          string;
  region:                            string;
  quoteType:                         string;
  typeDisp:                          string;
  quoteSourceName:                   string;
  triggerable:                       boolean;
  customPriceAlertConfidence:        string;
  currency:                          string;
  shortName:                         string;
  regularMarketChangePercent:        number;
  regularMarketPrice:                number;
  corporateActions:                  any[];
  postMarketTime:                    Date;
  regularMarketTime:                 Date;
  exchange:                          string;
  messageBoardId:                    string;
  exchangeTimezoneName:              string;
  exchangeTimezoneShortName:         string;
  gmtOffSetMilliseconds:             number;
  market:                            string;
  esgPopulated:                      boolean;
  longName:                          string;
  hasPrePostMarketData:              boolean;
  firstTradeDateMilliseconds:        Date;
  priceHint:                         number;
  postMarketChangePercent:           number;
  postMarketPrice:                   number;
  postMarketChange:                  number;
  regularMarketChange:               number;
  regularMarketDayHigh:              number;
  regularMarketDayRange:             Range;
  regularMarketDayLow:               number;
  regularMarketVolume:               number;
  regularMarketPreviousClose:        number;
  bid:                               number;
  ask:                               number;
  bidSize:                           number;
  askSize:                           number;
  fullExchangeName:                  string;
  financialCurrency:                 string;
  regularMarketOpen:                 number;
  averageDailyVolume3Month:          number;
  averageDailyVolume10Day:           number;
  fiftyTwoWeekLowChange:             number;
  fiftyTwoWeekLowChangePercent:      number;
  fiftyTwoWeekRange:                 Range;
  fiftyTwoWeekHighChange:            number;
  fiftyTwoWeekHighChangePercent:     number;
  fiftyTwoWeekLow:                   number;
  fiftyTwoWeekHigh:                  number;
  fiftyTwoWeekChangePercent:         number;
  dividendDate:                      Date;
  earningsTimestamp:                 Date;
  earningsTimestampStart:            Date;
  earningsTimestampEnd:              Date;
  earningsCallTimestampStart:        number;
  earningsCallTimestampEnd:          number;
  isEarningsDateEstimate:            boolean;
  trailingAnnualDividendRate:        number;
  trailingPE:                        number;
  dividendRate:                      number;
  trailingAnnualDividendYield:       number;
  dividendYield:                     number;
  epsTrailingTwelveMonths:           number;
  epsForward:                        number;
  epsCurrentYear:                    number;
  priceEpsCurrentYear:               number;
  sharesOutstanding:                 number;
  bookValue:                         number;
  fiftyDayAverage:                   number;
  fiftyDayAverageChange:             number;
  fiftyDayAverageChangePercent:      number;
  twoHundredDayAverage:              number;
  twoHundredDayAverageChange:        number;
  twoHundredDayAverageChangePercent: number;
  marketCap:                         number;
  forwardPE:                         number;
  priceToBook:                       number;
  sourceInterval:                    number;
  exchangeDataDelayedBy:             number;
  averageAnalystRating:              string;
  tradeable:                         boolean;
  cryptoTradeable:                   boolean;
  marketState:                       string;
  displayName:                       string;
  symbol:                            string;
}

export interface Range {
  low:  number;
  high: number;
}

export interface QuoteSummary {
  recommendationTrend:               RecommendationTrend;
  summaryDetail:                     SummaryDetail;
  incomeStatementHistoryQuarterly:   IncomeStatementHistoryQuarterly;
  cashflowStatementHistoryQuarterly: CashflowStatementHistoryQuarterly;
  balanceSheetHistoryQuarterly:      BalanceSheetHistoryQuarterly;
  defaultKeyStatistics:              DefaultKeyStatistics;
  balanceSheetHistory:               BalanceSheetHistory;
  earningsTrend:                     EarningsTrend;
  financialData:                     FinancialData;
}

export interface BalanceSheetHistory {
  balanceSheetStatements: BalanceSheetStatement[];
  maxAge:                 number;
}

export interface BalanceSheetHistoryQuarterly {
  balanceSheetStatements: BalanceSheetStatement[];
  maxAge:                 number;
}

export interface BalanceSheetStatement {
  maxAge:  number;
  endDate: Date;
}

export interface CashflowStatementHistoryQuarterly {
  cashflowStatements: CashflowStatement[];
  maxAge:             number;
}

export interface CashflowStatement {
  maxAge:    number;
  endDate:   Date;
  netIncome: number;
}

export interface DefaultKeyStatistics {
  maxAge:                       number;
  priceHint:                    number;
  enterpriseValue:              number;
  forwardPE:                    number;
  profitMargins:                number;
  floatShares:                  number;
  sharesOutstanding:            number;
  sharesShort:                  number;
  sharesShortPriorMonth:        Date;
  sharesShortPreviousMonthDate: Date;
  dateShortInterest:            number;
  sharesPercentSharesOut:       number;
  heldPercentInsiders:          number;
  heldPercentInstitutions:      number;
  shortRatio:                   number;
  shortPercentOfFloat:          number;
  beta:                         number;
  impliedSharesOutstanding:     number;
  category:                     null;
  bookValue:                    number;
  priceToBook:                  number;
  fundFamily:                   null;
  legalType:                    null;
  lastFiscalYearEnd:            Date;
  nextFiscalYearEnd:            Date;
  mostRecentQuarter:            Date;
  earningsQuarterlyGrowth:      number;
  netIncomeToCommon:            number;
  trailingEps:                  number;
  forwardEps:                   number;
  lastSplitFactor:              string;
  lastSplitDate:                number;
  enterpriseToRevenue:          number;
  enterpriseToEbitda:           number;
  "52WeekChange":               number;
  SandP52WeekChange:            number;
  lastDividendValue:            number;
  lastDividendDate:             Date;
  latestShareClass:             null;
  leadInvestor:                 null;
}

export interface EarningsTrend {
  trend:  EarningsTrendTrend[];
  maxAge: number;
}

export interface EarningsTrendTrend {
  maxAge:           number;
  period:           string;
  endDate:          Date;
  growth:           number;
  earningsEstimate: EarningsEstimate;
  revenueEstimate:  RevenueEstimate;
  epsTrend:         EpsTrend;
  epsRevisions:     EpsRevisions;
}

export interface EarningsEstimate {
  avg:              number;
  low:              number;
  high:             number;
  yearAgoEps:       number;
  numberOfAnalysts: number;
  growth:           number;
  earningsCurrency: string;
}

export interface EpsRevisions {
  upLast7days:          number;
  upLast30days:         number;
  downLast30days:       number;
  downLast7Days:        DownLast7Days;
  downLast90days:       null;
  epsRevisionsCurrency: string;
}

export interface DownLast7Days {
  raw:     number;
  fmt:     string;
  longFmt: string;
}

export interface EpsTrend {
  current:          number;
  "7daysAgo":       number;
  "30daysAgo":      number;
  "60daysAgo":      number;
  "90daysAgo":      number;
  epsTrendCurrency: string;
}

export interface RevenueEstimate {
  avg:              number;
  low:              number;
  high:             number;
  numberOfAnalysts: number;
  yearAgoRevenue:   number;
  growth:           number;
  revenueCurrency:  string;
}

export interface FinancialData {
  maxAge:                  number;
  currentPrice:            number;
  targetHighPrice:         number;
  targetLowPrice:          number;
  targetMeanPrice:         number;
  targetMedianPrice:       number;
  recommendationMean:      number;
  recommendationKey:       string;
  numberOfAnalystOpinions: number;
  totalCash:               number;
  totalCashPerShare:       number;
  ebitda:                  number;
  totalDebt:               number;
  quickRatio:              number;
  currentRatio:            number;
  totalRevenue:            number;
  debtToEquity:            number;
  revenuePerShare:         number;
  returnOnAssets:          number;
  returnOnEquity:          number;
  grossProfits:            number;
  freeCashflow:            number;
  operatingCashflow:       number;
  earningsGrowth:          number;
  revenueGrowth:           number;
  grossMargins:            number;
  ebitdaMargins:           number;
  operatingMargins:        number;
  profitMargins:           number;
  financialCurrency:       string;
}

export interface IncomeStatementHistoryQuarterly {
  incomeStatementHistory: IncomeStatementHistory[];
  maxAge:                 number;
}

export interface IncomeStatementHistory {
  maxAge:                            number;
  endDate:                           Date;
  totalRevenue:                      number;
  costOfRevenue:                     number;
  grossProfit:                       number;
  researchDevelopment:               null;
  sellingGeneralAdministrative:      null;
  nonRecurring:                      null;
  otherOperatingExpenses:            null;
  totalOperatingExpenses:            number;
  operatingIncome:                   null;
  totalOtherIncomeExpenseNet:        null;
  ebit:                              number;
  interestExpense:                   null;
  incomeBeforeTax:                   null;
  incomeTaxExpense:                  number;
  minorityInterest:                  null;
  netIncomeFromContinuingOps:        null;
  discontinuedOperations:            null;
  extraordinaryItems:                null;
  effectOfAccountingCharges:         null;
  otherItems:                        null;
  netIncome:                         number;
  netIncomeApplicableToCommonShares: null;
}

export interface RecommendationTrend {
  trend:  RecommendationTrendTrend[];
  maxAge: number;
}

export interface RecommendationTrendTrend {
  period:     string;
  strongBuy:  number;
  buy:        number;
  hold:       number;
  sell:       number;
  strongSell: number;
}

export interface SummaryDetail {
  maxAge:                       number;
  priceHint:                    number;
  previousClose:                number;
  open:                         number;
  dayLow:                       number;
  dayHigh:                      number;
  regularMarketPreviousClose:   number;
  regularMarketOpen:            number;
  regularMarketDayLow:          number;
  regularMarketDayHigh:         number;
  dividendRate:                 number;
  dividendYield:                number;
  exDividendDate:               Date;
  payoutRatio:                  number;
  fiveYearAvgDividendYield:     number;
  beta:                         number;
  trailingPE:                   number;
  forwardPE:                    number;
  volume:                       number;
  regularMarketVolume:          number;
  averageVolume:                number;
  averageVolume10days:          number;
  averageDailyVolume10Day:      number;
  bid:                          number;
  ask:                          number;
  bidSize:                      number;
  askSize:                      number;
  marketCap:                    number;
  fiftyTwoWeekLow:              number;
  fiftyTwoWeekHigh:             number;
  priceToSalesTrailing12Months: number;
  fiftyDayAverage:              number;
  twoHundredDayAverage:         number;
  trailingAnnualDividendRate:   number;
  trailingAnnualDividendYield:  number;
  currency:                     string;
  fromCurrency:                 null;
  toCurrency:                   null;
  lastMarket:                   null;
  coinMarketCapLink:            null;
  algorithm:                    null;
  tradeable:                    boolean;
}
