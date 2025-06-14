import YahooFinance from 'yahoo-finance2';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  try {
    const quote = await YahooFinance.quote('AAPL');
    const summary = await YahooFinance.quoteSummary('AAPL', { modules: ['defaultKeyStatistics', 'financialData', 'summaryDetail', 'incomeStatementHistoryQuarterly', 'cashflowStatementHistoryQuarterly', 'earningsTrend', 'recommendationTrend', 'balanceSheetHistoryQuarterly', 'balanceSheetHistory'] });

    writeFileSync(path.resolve(__dirname, 'quote.json'), JSON.stringify(quote, null, 2));
    writeFileSync(path.resolve(__dirname, 'summary.json'), JSON.stringify(summary, null, 2));

    console.log('Saved quote.json and summary.json in', __dirname);
  } catch (err) {
    console.error('Error writing files:', err);
  }
}

main();