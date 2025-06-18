import stockScreener from './modules/financial-modeling/stock-screener';
import { AnalystAPI } from './modules/financial-modeling/analyst';

let myQuery = stockScreener({
	options: {
		sector: 'Healthcare',
		industry: 'Medical Devices',
		isActivelyTrading: true,
	},
});

const myEstimates = await AnalystAPI.financialEstimates('AAPL', {
	page: 0,
	limit: 2,
});
