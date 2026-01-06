import { AnalystAPI } from './queries/analyst.js';
import { ChartAPI } from './queries/chart.js';
import { CompanyAPI } from './queries/company.js';
import { DiscountedCashFlowAPI } from './queries/discounted-cash-flow.js';
import { DirectoryAPI } from './queries/directory.js';
import { EconomicsAPI } from './queries/economics.js';
import { InsiderTradesAPI } from './queries/insider-trades.js';
import { MarketPerformanceAPI } from './queries/market-performance.js';
import { NewsAPI } from './queries/news.js';
import { SearchAPI } from './queries/search.js';
import { StatementsAPI } from './queries/statements.js';
import { TechnicalAPI } from './queries/technical-indicators.js';

export function createFmpApi(apiKey: string) {
	return {
		Analyst: AnalystAPI(apiKey),
		Chart: ChartAPI(apiKey),
		Company: CompanyAPI(apiKey),
		DiscountedCashFlow: DiscountedCashFlowAPI(apiKey),
		Directory: DirectoryAPI(apiKey),
		Economics: EconomicsAPI(apiKey),
		InsiderTrades: InsiderTradesAPI(apiKey),
		MarketPerformance: MarketPerformanceAPI(apiKey),
		News: NewsAPI(apiKey),
		Search: SearchAPI(apiKey),
		Statements: StatementsAPI(apiKey),
		Technical: TechnicalAPI(apiKey),
	};
}
