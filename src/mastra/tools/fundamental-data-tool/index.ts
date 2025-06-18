import stockScreener from '../_fmp-api/stock-screener';
import { AnalystAPI } from '../_fmp-api/analyst';
import { NewsAPI } from '../_fmp-api/news';
import { TechnicalAPI } from '../_fmp-api/technical';

// test the things!

const res = await AnalystAPI.historicalRatings('AAPL', 2);

console.log(res);

// const ratings = await AnalystAPI.historicalRatings('AAPL', 2);

// console.log(ratings);

// const news = await NewsAPI.stockNews('AAPL', {
// 	from: new Date('2025-01-01'),
// 	to: new Date('2025-06-18'),
// 	page: 0,
// 	limit: 2,
// });

// console.log(news);

// https://financialmodelingprep.com/stable/financial-estimates?symbol=AAPL&period=annual&page=0&limit=2&&apikey=pLziYh3bDTK9yioOpheiLREFHcpxbK1X
// https://financialmodelingprep.com/stable/analyst-estimates?symbol=AAPL&period=annual&page=0&limit=2&apikey=pLziYh3bDTK9yioOpheiLREFHcpxbK1X
