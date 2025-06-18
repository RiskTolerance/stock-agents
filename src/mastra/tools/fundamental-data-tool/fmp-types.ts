// BASIC INFORMATION ------------------------------------------------------------

// TECHNICAL INDICATORS ------------------------------------------------------------
// Moving Average Base Type
export interface MovingAverageBase {
	date: Date;
	open: number;
	high: number;
	low: number;
	close: number;
}

// Base Inputs (all technical indicators)

// Simple Moving Average
// https://financialmodelingprep.com/stable/technical-indicators/sma?symbol=AAPL&periodLength=10&timeframe=1day&apikey=pLziYh3bDTK9yioOpheiLREFHcpxbK1X

export interface SimpleMovingAverage extends MovingAverageBase {
	sma: number;
}
export type SimpleMovingAverageArr = SimpleMovingAverage[];

// Exponential Moving Average
// https://financialmodelingprep.com/stable/technical-indicators/ema?symbol=AAPL&periodLength=10&timeframe=1day&apikey=pLziYh3bDTK9yioOpheiLREFHcpxbK1X

export interface ExponentialMovingAverage extends MovingAverageBase {
	ema: number;
}
export type ExponentialMovingAverageArr = ExponentialMovingAverage[];

// Weighted Moving Average
// https://financialmodelingprep.com/stable/technical-indicators/wma?symbol=AAPL&periodLength=10&timeframe=1day&apikey=pLziYh3bDTK9yioOpheiLREFHcpxbK1X

export interface WeightedMovingAverage extends MovingAverageBase {
	wma: number;
}
export type WeightedMovingAverageArr = WeightedMovingAverage[];

// Double Exponential Moving Average
// https://financialmodelingprep.com/stable/technical-indicators/dema?symbol=AAPL&periodLength=10&timeframe=1day&apikey=pLziYh3bDTK9yioOpheiLREFHcpxbK1X

export interface DoubleExponentialMovingAverage extends MovingAverageBase {
	dema: number;
}
export type DoubleExponentialMovingAverageArr =
	DoubleExponentialMovingAverage[];

// Triple Exponential Moving Average
// https://financialmodelingprep.com/stable/technical-indicators/tema?symbol=AAPL&periodLength=10&timeframe=1day&apikey=pLziYh3bDTK9yioOpheiLREFHcpxbK1X

export interface TripleExponentialMovingAverage extends MovingAverageBase {
	tema: number;
}
export type TripleExponentialMovingAverageArr =
	TripleExponentialMovingAverage[];

// Relative Strength Index
// https://financialmodelingprep.com/stable/technical-indicators/rsi?symbol=AAPL&periodLength=10&timeframe=1day&apikey=pLziYh3bDTK9yioOpheiLREFHcpxbK1X

export interface RelativeStrengthIndex extends MovingAverageBase {
	rsi: number;
}
export type RelativeStrengthIndexArr = RelativeStrengthIndex[];

// Standard Deviation
// https://financialmodelingprep.com/stable/technical-indicators/standarddeviation?symbol=AAPL&periodLength=10&timeframe=1day&apikey=pLziYh3bDTK9yioOpheiLREFHcpxbK1X

export interface StandardDeviation extends MovingAverageBase {
	standardDeviation: number;
}
export type StandardDeviationArr = StandardDeviation[];

// Williams %R
// https://financialmodelingprep.com/stable/technical-indicators/williams?symbol=AAPL&periodLength=10&timeframe=1day&apikey=pLziYh3bDTK9yioOpheiLREFHcpxbK1X

export interface WilliamsR extends MovingAverageBase {
	williams: number;
}
export type WilliamsRArr = WilliamsR[];

// Average Directional Index
// https://financialmodelingprep.com/stable/technical-indicators/adx?symbol=AAPL&periodLength=10&timeframe=1day&apikey=pLziYh3bDTK9yioOpheiLREFHcpxbK1X

export interface AverageDirectionalIndex extends MovingAverageBase {
	adx: number;
}
export type AverageDirectionalIndexArr = AverageDirectionalIndex[];

// Quote
// https://financialmodelingprep.com/stable/quote?symbol=AAPL&apikey=pLziYh3bDTK9yioOpheiLREFHcpxbK1X
// Function inputs:
// - symbol: string
// - apikey: string

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

// NEWS RELATED TYPES ------------------------------------------------------------
// Base News Entry

export interface BaseNewsEntry {
	publishedDate: Date;
	publisher: string;
	title: string;
	image: string;
	site: string;
	text: string;
	url: string;
}

// General News Entry
// Example news query for all news from 2025-06-02 to 2025-06-16 with page 1 and limit 10
// https://financialmodelingprep.com/stable/news/general-latest?apikey=pLziYh3bDTK9yioOpheiLREFHcpxbK1X
// Function inputs:
// - from: Date
// - to: Date
// - page: number
// - limit: number

export interface GeneralNewsEntry extends BaseNewsEntry {
	symbol: null;
}
export type GeneralNewsEntryArr = GeneralNewsEntry[];

// News API Syntax
// Example news query for AMD from 2025-06-02 to 2025-06-16 with page 1 and limit 10
// https://financialmodelingprep.com/stable/news/stock?symbols=AMD&from=2025-06-02&to=2025-06-16&page=1&limit=10&apikey=pLziYh3bDTK9yioOpheiLREFHcpxbK1X
// Function inputs:
// - symbol: string
// - from: Date
// - to: Date
// - page: number
// - limit: number

export interface StockNewsEntry extends BaseNewsEntry {
	symbol: string;
}
export type StockNewsEntryArr = StockNewsEntry[];
