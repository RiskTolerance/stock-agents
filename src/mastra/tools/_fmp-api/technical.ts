// BASIC INFORMATION ------------------------------------------------------------

import { buildQuery } from './_query-builder';

export const TechnicalAPI = {
	/**
	 * Returns the simple daily moving average for a given symbol.
	 *
	 * @param symbol - The symbol of the stock to get the simple daily moving average for.
	 * @param options - The options for the simple daily moving average.
	 * @param options.periodLength - The period length of the simple daily moving average.
	 * @param options.timeframe - The timeframe of the simple daily moving average.
	 * @param options.from - The start date of the simple daily moving average.
	 * @param options.to - The end date of the simple daily moving average.
	 * @returns The simple daily moving average for the given symbol.
	 */
	async simpleMovingAverage(
		symbol: string,
		options: {
			periodLength: number;
			timeframe: string;
			from: Date;
			to: Date;
		}
	): Promise<SimpleMovingAverageArr> {
		const query = buildQuery('technical-indicators/sma', {
			symbol,
			...options,
		});
		const response = await fetch(query);
		return await response.json();
	},
	/**
	 * Returns the exponential daily moving average for a given symbol.
	 *
	 * @param symbol - The symbol of the stock to get the exponential daily moving average for.
	 * @param options - The options for the exponential daily moving average.
	 * @param options.periodLength - The period length of the exponential daily moving average.
	 * @param options.timeframe - The timeframe of the exponential daily moving average.
	 * @param options.from - The start date of the exponential daily moving average.
	 * @param options.to - The end date of the exponential daily moving average.
	 * @returns The exponential daily moving average for the given symbol.
	 */
	async exponentialMovingAverage(
		symbol: string,
		options: {
			periodLength: number;
			timeframe: string;
			from: Date;
			to: Date;
		}
	): Promise<ExponentialMovingAverageArr> {
		const query = buildQuery('technical-indicators/ema', {
			symbol,
			...options,
		});
		const response = await fetch(query);
		return await response.json();
	},

	/**
	 * Returns the weighted daily moving average for a given symbol.
	 *
	 * @param symbol - The symbol of the stock to get the weighted daily moving average for.
	 * @param options - The options for the weighted daily moving average.
	 * @param options.periodLength - The period length of the weighted daily moving average.
	 * @param options.timeframe - The timeframe of the weighted daily moving average.
	 * @param options.from - The start date of the weighted daily moving average.
	 * @param options.to - The end date of the weighted daily moving average.
	 * @returns The weighted daily moving average for the given symbol.
	 */
	async weightedMovingAverage(
		symbol: string,
		options: {
			periodLength: number;
			timeframe: string;
			from: Date;
			to: Date;
		}
	): Promise<WeightedMovingAverageArr> {
		const query = buildQuery('technical-indicators/wma', {
			symbol,
			...options,
		});
		const response = await fetch(query);
		return await response.json();
	},

	/**
	 * Returns the double exponential daily moving average for a given symbol.
	 *
	 * @param symbol - The symbol of the stock to get the double exponential daily moving average for.
	 * @param options - The options for the double exponential daily moving average.
	 * @param options.periodLength - The period length of the double exponential daily moving average.
	 * @param options.timeframe - The timeframe of the double exponential daily moving average.
	 * @param options.from - The start date of the double exponential daily moving average.
	 * @param options.to - The end date of the double exponential daily moving average.
	 * @returns The double exponential daily moving average for the given symbol.
	 */
	async doubleExponentialMovingAverage(
		symbol: string,
		options: {
			periodLength: number;
			timeframe: string;
			from: Date;
			to: Date;
		}
	): Promise<DoubleExponentialMovingAverageArr> {
		const query = buildQuery('technical-indicators/dema', {
			symbol,
			...options,
		});
		const response = await fetch(query);
		return await response.json();
	},

	/**
	 * Returns the triple exponential daily moving average for a given symbol.
	 *
	 * @param symbol - The symbol of the stock to get the triple exponential daily moving average for.
	 * @param options - The options for the triple exponential daily moving average.
	 * @param options.periodLength - The period length of the triple exponential daily moving average.
	 * @param options.timeframe - The timeframe of the triple exponential daily moving average.
	 * @param options.from - The start date of the triple exponential daily moving average.
	 * @param options.to - The end date of the triple exponential daily moving average.
	 * @returns The triple exponential daily moving average for the given symbol.
	 */
	async tripleExponentialMovingAverage(
		symbol: string,
		options: {
			periodLength: number;
			timeframe: string;
			from: Date;
			to: Date;
		}
	): Promise<TripleExponentialMovingAverageArr> {
		const query = buildQuery('technical-indicators/tema', {
			symbol,
			...options,
		});
		const response = await fetch(query);
		return await response.json();
	},

	/**
	 * Returns the relative strength index for a given symbol.
	 *
	 * @param symbol - The symbol of the stock to get the relative strength index for.
	 * @param options - The options for the relative strength index.
	 * @param options.periodLength - The period length of the relative strength index.
	 * @param options.timeframe - The timeframe of the relative strength index.
	 * @param options.from - The start date of the relative strength index.
	 * @param options.to - The end date of the relative strength index.
	 * @returns The relative strength index for the given symbol.
	 */
	async relativeStrengthIndex(
		symbol: string,
		options: {
			periodLength: number;
			timeframe: string;
			from: Date;
			to: Date;
		}
	): Promise<RelativeStrengthIndexArr> {
		const query = buildQuery('technical-indicators/rsi', {
			symbol,
			...options,
		});
		const response = await fetch(query);
		return await response.json();
	},

	/**
	 * Returns the standard deviation for a given symbol.
	 *
	 * @param symbol - The symbol of the stock to get the standard deviation for.
	 * @param options - The options for the standard deviation.
	 * @param options.periodLength - The period length of the standard deviation.
	 * @param options.timeframe - The timeframe of the standard deviation.
	 * @param options.from - The start date of the standard deviation.
	 * @param options.to - The end date of the standard deviation.
	 * @returns The standard deviation for the given symbol.
	 */
	async standardDeviation(
		symbol: string,
		options: {
			periodLength: number;
			timeframe: string;
			from: Date;
			to: Date;
		}
	): Promise<StandardDeviationArr> {
		const query = buildQuery('technical-indicators/standarddeviation', {
			symbol,
			...options,
		});
		const response = await fetch(query);
		return await response.json();
	},

	/**
	 * Returns the Williams %R for a given symbol.
	 *
	 * @param symbol - The symbol of the stock to get the Williams %R for.
	 * @param options - The options for the Williams %R.
	 * @param options.periodLength - The period length of the Williams %R.
	 * @param options.timeframe - The timeframe of the Williams %R.
	 * @param options.from - The start date of the Williams %R.
	 * @param options.to - The end date of the Williams %R.
	 * @returns The Williams %R for the given symbol.
	 */
	async williamsR(
		symbol: string,
		options: {
			periodLength: number;
			timeframe: string;
			from: Date;
			to: Date;
		}
	): Promise<WilliamsRArr> {
		const query = buildQuery('technical-indicators/williams', {
			symbol,
			...options,
		});
		const response = await fetch(query);
		return await response.json();
	},

	/**
	 * Returns the average directional index for a given symbol.
	 *
	 * @param symbol - The symbol of the stock to get the average directional index for.
	 * @param options - The options for the average directional index.
	 * @param options.periodLength - The period length of the average directional index.
	 * @param options.timeframe - The timeframe of the average directional index.
	 * @param options.from - The start date of the average directional index.
	 * @param options.to - The end date of the average directional index.
	 * @returns The average directional index for the given symbol.
	 */
	async averageDirectionalIndex(
		symbol: string,
		options: {
			periodLength: number;
			timeframe: string;
			from: Date;
			to: Date;
		}
	): Promise<AverageDirectionalIndexArr> {
		const query = buildQuery('technical-indicators/adx', {
			symbol,
			...options,
		});
		const response = await fetch(query);
		return await response.json();
	},

	async quote(symbol: string): Promise<QuoteArr> {
		const query = buildQuery('quote', {
			symbol,
		});
		const response = await fetch(query);
		return await response.json();
	},
};

// TYPES -----------------------------------------------------------
// Moving Average Base Type
interface MovingAverageBase {
	date: Date;
	open: number;
	high: number;
	low: number;
	close: number;
}

interface SimpleMovingAverage extends MovingAverageBase {
	sma: number;
}
export type SimpleMovingAverageArr = SimpleMovingAverage[];

interface ExponentialMovingAverage extends MovingAverageBase {
	ema: number;
}
export type ExponentialMovingAverageArr = ExponentialMovingAverage[];

interface WeightedMovingAverage extends MovingAverageBase {
	wma: number;
}
export type WeightedMovingAverageArr = WeightedMovingAverage[];

interface DoubleExponentialMovingAverage extends MovingAverageBase {
	dema: number;
}
export type DoubleExponentialMovingAverageArr =
	DoubleExponentialMovingAverage[];

interface TripleExponentialMovingAverage extends MovingAverageBase {
	tema: number;
}
export type TripleExponentialMovingAverageArr =
	TripleExponentialMovingAverage[];

// Relative Strength Index
// https://financialmodelingprep.com/stable/technical-indicators/rsi?symbol=AAPL&periodLength=10&timeframe=1day&apikey=pLziYh3bDTK9yioOpheiLREFHcpxbK1X

interface RelativeStrengthIndex extends MovingAverageBase {
	rsi: number;
}
export type RelativeStrengthIndexArr = RelativeStrengthIndex[];

// Standard Deviation
// https://financialmodelingprep.com/stable/technical-indicators/standarddeviation?symbol=AAPL&periodLength=10&timeframe=1day&apikey=pLziYh3bDTK9yioOpheiLREFHcpxbK1X

interface StandardDeviation extends MovingAverageBase {
	standardDeviation: number;
}
export type StandardDeviationArr = StandardDeviation[];

// Williams %R
// https://financialmodelingprep.com/stable/technical-indicators/williams?symbol=AAPL&periodLength=10&timeframe=1day&apikey=pLziYh3bDTK9yioOpheiLREFHcpxbK1X

interface WilliamsR extends MovingAverageBase {
	williams: number;
}
export type WilliamsRArr = WilliamsR[];

// Average Directional Index
// https://financialmodelingprep.com/stable/technical-indicators/adx?symbol=AAPL&periodLength=10&timeframe=1day&apikey=pLziYh3bDTK9yioOpheiLREFHcpxbK1X

interface AverageDirectionalIndex extends MovingAverageBase {
	adx: number;
}
export type AverageDirectionalIndexArr = AverageDirectionalIndex[];

// Quote
// https://financialmodelingprep.com/stable/quote?symbol=AAPL&apikey=pLziYh3bDTK9yioOpheiLREFHcpxbK1X

export interface Quote {
	symbol: string;
	name: string;
	price: number;
	changePercentage: number;
	change: number;
	volume: number;
	dayLow: number;
	dayHigh: number;
	yearHigh: number;
	yearLow: number;
	marketCap: number;
	priceAvg50: number;
	priceAvg200: number;
	exchange: string;
	open: number;
	previousClose: number;
	timestamp: number;
}
export type QuoteArr = Quote[];
