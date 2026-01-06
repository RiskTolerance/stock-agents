import { buildQuery } from '../_query-builder.js';

export function CompanyAPI(apiKey: string) {
	return {
		async profile(symbol: string): Promise<CompanyProfileArr> {
			const query = buildQuery('profile', { symbol }, apiKey);
			const response = await fetch(query);
			if (!response.ok) {
				throw new Error(`API error (Company.profile): ${response.statusText}`);
			}
			return await response.json();
		},

		async employeeCount(
			symbol: string,
			limit?: number
		): Promise<CompanyEmployeeCountArr> {
			const query = buildQuery('employee-count', { symbol, limit }, apiKey);
			const response = await fetch(query);
			if (!response.ok) {
				throw new Error(
					`API error (Company.employeeCount): ${response.statusText}`
				);
			}
			return await response.json();
		},

		async historicalEmployeeCount(
			symbol: string,
			limit?: number
		): Promise<HistoricalCompanyEmployeeCountArr> {
			const query = buildQuery(
				'historical-employee-count',
				{ symbol, limit },
				apiKey
			);
			const response = await fetch(query);
			if (!response.ok) {
				throw new Error(
					`API error (Company.historicalEmployeeCount): ${response.statusText}`
				);
			}
			return await response.json();
		},

		async marketCap(symbol: string): Promise<CompanyMarketCapArr> {
			const query = buildQuery('market-capitalization', { symbol }, apiKey);
			const response = await fetch(query);
			if (!response.ok) {
				throw new Error(
					`API error (Company.marketCap): ${response.statusText}`
				);
			}
			return await response.json();
		},

		async historicalMarketCap(
			symbol: string,
			options: {
				limit?: number;
				from?: Date;
				to?: Date;
			}
		): Promise<HistoricalCompanyMarketCapArr> {
			const query = buildQuery(
				'historical-market-capitalization',
				{ symbol, ...options },
				apiKey
			);
			const response = await fetch(query);
			if (!response.ok) {
				throw new Error(
					`API error (Company.historicalMarketCap): ${response.statusText}`
				);
			}
			return await response.json();
		},
	};
}

export interface CompanyProfile {
	symbol: string;
	price: number;
	marketCap: number;
	beta: number;
	lastDividend: number;
	range: string;
	change: number;
	changePercentage: number;
	volume: number;
	averageVolume: number;
	companyName: string;
	currency: string;
	cik: string;
	isin: string;
	cusip: string;
	exchangeFullName: string;
	exchange: string;
	industry: string;
	website: string;
	description: string;
	ceo: string;
	sector: string;
	country: string;
	fullTimeEmployees: string;
	phone: string;
	address: string;
	city: string;
	state: string;
	zip: string;
	image: string;
	ipoDate: Date;
	defaultImage: boolean;
	isEtf: boolean;
	isActivelyTrading: boolean;
	isAdr: boolean;
	isFund: boolean;
}

export type CompanyProfileArr = CompanyProfile[];

export interface CompanyEmployeeCount {
	symbol: string;
	cik: string;
	acceptanceTime: Date;
	periodOfReport: Date;
	companyName: string;
	formType: string;
	filingDate: Date;
	employeeCount: number;
	source: string;
}

export type CompanyEmployeeCountArr = CompanyEmployeeCount[];

export interface HistoricalCompanyEmployeeCount {
	symbol: string;
	cik: string;
	acceptanceTime: Date;
	periodOfReport: Date;
	companyName: string;
	formType: string;
	filingDate: Date;
	employeeCount: number;
	source: string;
}

export type HistoricalCompanyEmployeeCountArr =
	HistoricalCompanyEmployeeCount[];

export interface CompanyMarketCap {
	symbol: string;
	date: Date;
	marketCap: number;
}

export type CompanyMarketCapArr = CompanyMarketCap[];

export interface HistoricalCompanyMarketCap {
	symbol: string;
	date: Date;
	marketCap: number;
}

export type HistoricalCompanyMarketCapArr = HistoricalCompanyMarketCap[];
