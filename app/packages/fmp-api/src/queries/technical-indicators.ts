import { buildQuery } from '../_query-builder.js';

export function TechnicalAPI(apiKey: string) {
	return {
		/**
		 * Calculates the Simple Moving Average (SMA) for a given stock symbol over a specified period.
		 * The SMA is the unweighted mean of the previous n data points (e.g., closing prices), providing a smoothed trend line for price data.
		 *
		 * @returns An array of objects containing the date, price data, and the calculated simple moving average (SMA) for each interval in the specified range.
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
			const query = buildQuery(
				'technical-indicators/sma',
				{
					symbol,
					...options,
				},
				apiKey
			);
			const response = await fetch(query);
			if (!response.ok) {
				throw new Error(
					`API error (TechnicalIndicators.simpleMovingAverage): ${response.statusText}`
				);
			}
			return await response.json();
		},
		/**
		 * Calculates the Exponential Moving Average (EMA) for a given stock symbol over a specified period.
		 * The EMA is a type of moving average that places a greater weight and significance on the most recent data points, making it more responsive to new information.
		 *
		 * @returns An array of objects containing the date, price data, and the calculated exponential moving average (EMA) for each interval in the specified range.
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
			const query = buildQuery(
				'technical-indicators/ema',
				{
					symbol,
					...options,
				},
				apiKey
			);
			const response = await fetch(query);
			if (!response.ok) {
				throw new Error(
					`API error (TechnicalIndicators.exponentialMovingAverage): ${response.statusText}`
				);
			}
			return await response.json();
		},

		/**
		 * Calculates the Weighted Moving Average (WMA) for a given stock symbol over a specified period.
		 * The WMA assigns more weight to recent data points, making it more sensitive to new price changes than the simple moving average.
		 *
		 * @returns An array of objects containing the date, price data, and the calculated weighted moving average (WMA) for each interval in the specified range.
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
			const query = buildQuery(
				'technical-indicators/wma',
				{
					symbol,
					...options,
				},
				apiKey
			);
			const response = await fetch(query);
			if (!response.ok) {
				throw new Error(
					`API error (TechnicalIndicators.weightedMovingAverage): ${response.statusText}`
				);
			}
			return await response.json();
		},

		/**
		 * Calculates the Double Exponential Moving Average (DEMA) for a given stock symbol over a specified period.
		 * The DEMA is designed to reduce the lag of traditional moving averages by combining a single and double exponential moving average.
		 *
		 * @returns An array of objects containing the date, price data, and the calculated double exponential moving average (DEMA) for each interval in the specified range.
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
			const query = buildQuery(
				'technical-indicators/dema',
				{
					symbol,
					...options,
				},
				apiKey
			);
			const response = await fetch(query);
			if (!response.ok) {
				throw new Error(
					`API error (TechnicalIndicators.doubleExponentialMovingAverage): ${response.statusText}`
				);
			}
			return await response.json();
		},

		/**
		 * Calculates the Triple Exponential Moving Average (TEMA) for a given stock symbol over a specified period.
		 * The TEMA further reduces lag by combining single, double, and triple exponential moving averages, providing a smoother and more responsive trend line.
		 *
		 * @returns An array of objects containing the date, price data, and the calculated triple exponential moving average (TEMA) for each interval in the specified range.
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
			const query = buildQuery(
				'technical-indicators/tema',
				{
					symbol,
					...options,
				},
				apiKey
			);
			const response = await fetch(query);
			if (!response.ok) {
				throw new Error(
					`API error (TechnicalIndicators.tripleExponentialMovingAverage): ${response.statusText}`
				);
			}
			return await response.json();
		},

		/**
		 * Calculates the Relative Strength Index (RSI) for a given stock symbol over a specified period.
		 * The RSI is a momentum oscillator that measures the speed and change of price movements, typically used to identify overbought or oversold conditions.
		 *
		 * @returns An array of objects containing the date, price data, and the calculated relative strength index (RSI) for each interval in the specified range.
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
			const query = buildQuery(
				'technical-indicators/rsi',
				{
					symbol,
					...options,
				},
				apiKey
			);
			const response = await fetch(query);
			if (!response.ok) {
				throw new Error(
					`API error (TechnicalIndicators.relativeStrengthIndex): ${response.statusText}`
				);
			}
			return await response.json();
		},

		/**
		 * Calculates the Standard Deviation for a given stock symbol over a specified period.
		 * Standard deviation is a statistical measure of price volatility, indicating how much the price deviates from its average over the period.
		 *
		 * @returns An array of objects containing the date, price data, and the calculated standard deviation for each interval in the specified range.
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
			const query = buildQuery(
				'technical-indicators/standarddeviation',
				{
					symbol,
					...options,
				},
				apiKey
			);
			const response = await fetch(query);
			if (!response.ok) {
				throw new Error(
					`API error (TechnicalIndicators.standardDeviation): ${response.statusText}`
				);
			}
			return await response.json();
		},

		/**
		 * Calculates the Williams %R for a given stock symbol over a specified period.
		 * Williams %R is a momentum indicator that measures overbought and oversold levels, similar to the stochastic oscillator.
		 *
		 * @returns An array of objects containing the date, price data, and the calculated Williams %R value for each interval in the specified range.
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
			const query = buildQuery(
				'technical-indicators/williams',
				{
					symbol,
					...options,
				},
				apiKey
			);
			const response = await fetch(query);
			if (!response.ok) {
				throw new Error(
					`API error (TechnicalIndicators.williamsR): ${response.statusText}`
				);
			}
			return await response.json();
		},

		/**
		 * Calculates the Average Directional Index (ADX) for a given stock symbol over a specified period.
		 * The ADX is a trend strength indicator, quantifying the strength of a trend but not its direction.
		 *
		 * @returns An array of objects containing the date, price data, and the calculated average directional index (ADX) for each interval in the specified range.
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
			const query = buildQuery(
				'technical-indicators/adx',
				{
					symbol,
					...options,
				},
				apiKey
			);
			const response = await fetch(query);
			if (!response.ok) {
				throw new Error(
					`API error (TechnicalIndicators.averageDirectionalIndex): ${response.statusText}`
				);
			}
			return await response.json();
		},

		/**
		 * Retrieves the latest quote and summary statistics for a given stock symbol.
		 * The quote includes current price, volume, daily and yearly highs/lows, and other key market data.
		 *
		 * @returns An array containing the latest quote and related statistics for the specified symbol.
		 */
		async quote(symbol: string): Promise<QuoteArr> {
			const query = buildQuery('quote', { symbol }, apiKey);
			const response = await fetch(query);
			if (!response.ok) {
				throw new Error(
					`API error (TechnicalIndicators.quote): ${response.statusText}`
				);
			}
			return await response.json();
		},
	};
}

// TYPES -----------------------------------------------------------
// Moving Average Base Type
interface MovingAverageBase {
	date: string; // Format: "YYYY-MM-DD HH:mm:ss"
	open: number;
	high: number;
	low: number;
	close: number;
	volume: number;
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
