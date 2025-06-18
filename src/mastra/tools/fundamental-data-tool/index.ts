import stockScreener from '../_fmp-api/stock-screener';
import { AnalystAPI } from '../_fmp-api/analyst';

let screenerResults = stockScreener({
	options: {
		sector: 'Healthcare',
		industry: 'Medical Devices',
		isActivelyTrading: true,
	},
});

const estimates = await AnalystAPI.financialEstimates('AAPL', {
	page: 0,
	limit: 2,
});

const ratings = await AnalystAPI.historicalRatings('AAPL', 2);
