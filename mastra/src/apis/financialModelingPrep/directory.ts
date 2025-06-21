import { buildQuery } from '#apis/financialModelingPrep/_query-builder.ts';

export const DirectoryAPI = {
	async companySymbolList(): Promise<CompanySymbolArr> {
		const query = buildQuery('stock-list', {});
		const response = await fetch(query);
		return await response.json();
	},
	async companyFinancialSymbolList(): Promise<CompanyFinancialSymbolArr> {
		const query = buildQuery('financial-statement-symbol-list', {});
		const response = await fetch(query);
		return await response.json();
	},
	async activelyTradingList(): Promise<ActivelyTradingArr> {
		const query = buildQuery('actively-trading-list', {});
		const response = await fetch(query);
		return await response.json();
	},
	async availableSectors(): Promise<SectorArr> {
		const query = buildQuery('available-sectors', {});
		const response = await fetch(query);
		return await response.json();
	},
	async availableIndustries(): Promise<IndustryArr> {
		const query = buildQuery('available-industries', {});
		const response = await fetch(query);
		return await response.json();
	},
};
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
