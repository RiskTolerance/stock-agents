import { buildQuery } from '../_query-builder.js';

// repeat the type pattern for market/sector that was used in search.ts
import type { IndustryForSector, MarketSector } from './search.ts';
export type IndustryOptions<S extends MarketSector = MarketSector> = {
	from: Date;
	to: Date;
	exchange: 'NASDAQ' | 'NYSE' | 'AMEX';
	industry: S extends MarketSector ? IndustryForSector<S> : never;
};

export type SectorOptions<S extends MarketSector = MarketSector> = {
	date: Date;
	exchange: 'NASDAQ' | 'NYSE' | 'AMEX';
	sector: S;
};

export function MarketPerformanceAPI(apiKey: string) {
	return {
		async marketSectorPerformanceHistory(
			from: Date,
			to: Date,
			exchange?: 'NASDAQ' | 'NYSE' | 'AMEX',
			sector?: MarketSector
		): Promise<MarketSectorPerformanceArr> {
			const query = buildQuery(
				'historical-sector-performance',
				{
					from,
					to,
					exchange,
					sector,
				},
				apiKey
			);
			const response = await fetch(query);
			if (!response.ok) {
				throw new Error(
					`API error (MarketPerformance.marketSectorPerformanceHistory): ${response.statusText}`
				);
			}
			return await response.json();
		},

		async industryPerformanceHistory<S extends MarketSector = MarketSector>({
			options,
		}: {
			options: IndustryOptions<S>;
		}): Promise<IndustryPerformanceArr> {
			const query = buildQuery(
				'historical-industry-performance',
				{
					...options,
				},
				apiKey
			);
			const response = await fetch(query);
			if (!response.ok) {
				throw new Error(
					`API error (MarketPerformance.sectorPriceEarningsHistory): ${response.statusText}`
				);
			}
			return await response.json();
		},

		async sectorPriceEarningsHistory<S extends MarketSector = MarketSector>({
			options,
		}: {
			options: SectorOptions<S>;
		}): Promise<SectorPriceEarningsArr> {
			const query = buildQuery(
				'historical-sector-pe',
				{
					...options,
				},
				apiKey
			);
			const response = await fetch(query);
			return await response.json();
		},

		async industryPriceEarningsHistory<S extends MarketSector = MarketSector>({
			options,
		}: {
			options: IndustryOptions<S>;
		}): Promise<IndustryPriceEarningsArr> {
			const query = buildQuery(
				'historical-industry-pe',
				{
					...options,
				},
				apiKey
			);
			const response = await fetch(query);
			if (!response.ok) {
				throw new Error(
					`API error (MarketPerformance.mostActive): ${response.statusText}`
				);
			}
			return await response.json();
		},

		async biggestLosers(): Promise<BiggestLosersArr> {
			const query = buildQuery('biggest-losers', {}, apiKey);
			const response = await fetch(query);
			if (!response.ok) {
				throw new Error(
					`API error (MarketPerformance.biggestLosers): ${response.statusText}`
				);
			}
			return await response.json();
		},

		async biggestGainers(): Promise<BiggestGainersArr> {
			const query = buildQuery('biggest-gainers', {}, apiKey);
			const response = await fetch(query);
			if (!response.ok) {
				throw new Error(
					`API error (MarketPerformance.biggestGainers): ${response.statusText}`
				);
			}
			return await response.json();
		},

		async mostActive(): Promise<MostActiveArr> {
			const query = buildQuery('most-actives', {}, apiKey);
			const response = await fetch(query);
			if (!response.ok) {
				throw new Error(
					`API error (MarketPerformance.mostActive): ${response.statusText}`
				);
			}
			return await response.json();
		},
	};
}

export interface MarketSectorPerformance {
	date: Date;
	sector: string;
	exchange: string;
	averageChange: number;
}
export type MarketSectorPerformanceArr = MarketSectorPerformance[];

export interface IndustryPerformance {
	date: Date;
	industry: string;
	exchange: string;
	averageChange: number;
}
export type IndustryPerformanceArr = IndustryPerformance[];
export interface SectorPriceEarnings {
	date: Date;
	sector: string;
	exchange: string;
	pe: number;
}
export type SectorPriceEarningsArr = SectorPriceEarnings[];

export interface IndustryPriceEarnings {
	date: Date;
	industry: string;
	exchange: string;
	pe: number;
}
export type IndustryPriceEarningsArr = IndustryPriceEarnings[];
export interface BiggestGainers {
	symbol: string;
	price: number;
	name: string;
	change: number;
	changesPercentage: number;
	exchange: string;
}
export type BiggestGainersArr = BiggestGainers[];

export interface BiggestLosers {
	symbol: string;
	price: number;
	name: string;
	change: number;
	changesPercentage: number;
	exchange: string;
}
export type BiggestLosersArr = BiggestLosers[];
export interface MostActive {
	symbol: string;
	price: number;
	name: string;
	change: number;
	changesPercentage: number;
	exchange: string;
}
export type MostActiveArr = MostActive[];
