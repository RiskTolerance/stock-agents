# fmp-api

A TypeScript SDK for the Financial Modeling Prep API.

## Installation

```sh
npm install fmp-api
# or
pnpm add fmp-api
```

## Usage

```ts
import { NewsAPI, StatementsAPI } from 'fmp-api';

// Example: Fetch news for a symbol
const news = await NewsAPI.stockNews('AAPL', {
  from: new Date('2024-01-01'),
  to: new Date('2024-01-31'),
  page: 1,
  limit: 10,
});

// Example: Fetch income statement
const income = await StatementsAPI.incomeStatement('AAPL', {
  limit: 5,
  period: 'annual',
});
```

## Endpoints

- Analyst
- Chart
- Company
- Discounted Cash Flow
- Directory
- Economics
- Insider Trades
- Market Performance
- News
- Search
- Statements
- Technical Indicators

## TypeScript Support

All endpoints and return types are fully typed.

## License

MIT 