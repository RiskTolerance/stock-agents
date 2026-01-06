import { buildQuery } from '../_query-builder.js';

export function DirectoryAPI(apiKey: string) {
	return {
		async companySymbolList() {
			const query = buildQuery('stock-list', {}, apiKey);
			const response = await fetch(query);
			if (!response.ok) {
				throw new Error(
					`API error (Directory.companySymbolList): ${response.statusText}`
				);
			}
			return await response.json();
		},
		async companyFinancialSymbolList() {
			const query = buildQuery('financial-statement-symbol-list', {}, apiKey);
			const response = await fetch(query);
			if (!response.ok) {
				throw new Error(
					`API error (Directory.companyFinancialSymbolList): ${response.statusText}`
				);
			}
			return await response.json();
		},
		async activelyTradingList() {
			const query = buildQuery('actively-trading-list', {}, apiKey);
			const response = await fetch(query);
			if (!response.ok) {
				throw new Error(
					`API error (Directory.activelyTradingList): ${response.statusText}`
				);
			}
			return await response.json();
		},
		async availableSectors() {
			const query = buildQuery('available-sectors', {}, apiKey);
			const response = await fetch(query);
			if (!response.ok) {
				throw new Error(
					`API error (Directory.availableSectors): ${response.statusText}`
				);
			}
			return await response.json();
		},
		async availableIndustries() {
			const query = buildQuery('available-industries', {}, apiKey);
			const response = await fetch(query);
			if (!response.ok) {
				throw new Error(
					`API error (Directory.availableIndustries): ${response.statusText}`
				);
			}
			return await response.json();
		},
	};
}

export interface CompanySymbol {
	symbol: string;
	companyName: string;
}
export type CompanySymbolArr = CompanySymbol[];

export interface CompanyFinancialSymbol {
	symbol: string;
	companyName: string;
	tradingCurrency: string;
	reportingCurrency: string;
}
export type CompanyFinancialSymbolArr = CompanyFinancialSymbol[];
export interface ActivelyTrading {
	symbol: string;
	name: string;
}
export type ActivelyTradingArr = ActivelyTrading[];
export interface Industry {
	industry: string;
}
export type IndustryArr = Industry[];
export interface Sector {
	sector: string;
}
export type SectorArr = Sector[];
