# Stock Agents - Architecture & Implementation Plan

## Overview

A simplified two-container architecture consolidating the original multi-container setup while retaining Mastra for agent orchestration. Mastra is integrated directly into SvelteKit rather than running as a separate service.

**Architecture (2 containers):**
- `db` (Postgres) - Database for all application data
- `app` (SvelteKit + Mastra integrated, adapter-bun) - Full-stack application

---

## Goals

1. **Simplify deployment** — fewer moving parts, easier to debug
2. **Keep Mastra** — retain agent orchestration capabilities for future complexity
3. **Direct integration** — call Mastra workflows from SvelteKit server routes (no HTTP proxy)
4. **Postgres for everything** — state, job queue, auth, reports, agent activity
5. **Autonomous trading** — Account Manager Agent makes independent decisions and executes trades

---

## Architecture

### Project Structure

```
stock-agents-2/
├── compose.yml                    # Docker Compose (db + app)
├── packages/
│   └── fmp-api/                   # Internal FMP API package
└── app/                           # SvelteKit application
    ├── Dockerfile
    ├── package.json
    ├── svelte.config.js           # adapter-bun
    ├── drizzle.config.ts
    ├── src/
    │   ├── lib/
    │   │   └── server/
    │   │       ├── db/
    │   │       │   ├── index.ts
    │   │       │   └── schema.ts
    │   │       ├── mastra/
    │   │       │   ├── index.ts           # Mastra instance
    │   │       │   ├── env.ts             # Environment setup
    │   │       │   ├── agents/            # 21 agents total
    │   │       │   │   ├── analyst.ts
    │   │       │   │   ├── company.ts
    │   │       │   │   ├── insider.ts
    │   │       │   │   ├── news.ts
    │   │       │   │   ├── technical.ts
    │   │       │   │   ├── economic.ts
    │   │       │   │   ├── company-statements/ (9 agents)
    │   │       │   │   ├── bullish.ts
    │   │       │   │   ├── bearish.ts
    │       │   │   │   ├── bullish-rebuttal.ts
    │   │       │   │   ├── bearish-rebuttal.ts
    │   │       │   │   ├── decision.ts
    │   │       │   │   └── account-manager.ts
    │   │       │   ├── tools/
    │   │       │   │   ├── fmp-tools.ts
    │   │       │   │   ├── account-manager-tools.ts
    │   │       │   │   └── activity-tools.ts
    │   │       │   ├── workflows/
    │   │       │   │   ├── analyze-stock.ts
    │   │       │   │   └── execute-trade.ts
    │   │       │   └── utils/
    │   │       │       ├── rate-limit.ts
    │   │       │       └── data-reduction.ts
    │   │       ├── alpaca/
    │   │       │   └── index.ts
    │   │       └── scheduler/
    │   │           ├── index.ts            # Heartbeat scheduler
    │   │           ├── heartbeat.ts        # Agent wake-up logic
    │   │           └── config.ts
    │   └── routes/
    │       ├── +page.svelte                # Dashboard
    │       ├── analyze/
    │       │   ├── +page.svelte
    │       │   └── data.remote.ts          # Remote functions
    │       ├── reports/
    │       │   ├── +page.svelte
    │       │   ├── [id]/+page.svelte
    │       │   └── data.remote.ts
    │       ├── portfolio/
    │       │   ├── +page.svelte
    │       │   └── data.remote.ts
    │       └── api/
    │           └── scheduler/
    │               └── trigger/+server.ts
```

---

## Mastra Integration

### Direct Import (No Separate Service)

Mastra is imported directly into SvelteKit server code:

```typescript
// src/lib/server/mastra/index.ts
import './env.js'; // Ensure process.env is populated first
import { Mastra } from '@mastra/core/mastra';
import { PostgresStore } from '@mastra/pg';
import { env } from '$env/dynamic/private';

export const mastra = new Mastra({
  agents: { /* all 21 agents */ },
  workflows: {
    'analyze-stock': analyzeStockWorkflow,
    'execute-trade': executeTradeWorkflow
  },
  storage: new PostgresStore({
    connectionString: env.DATABASE_URL
  })
});
```

### Agent Structure

**21 Agents Total:**

**Layer 1: Data Collection (15 agents)**
- `analystAgent` - Analyst ratings, price targets, estimates
- `companyAgent` - Company profile, market cap, quote
- `insiderAgent` - Insider trading activity
- `newsAgent` - News articles and market sentiment
- `technicalAgent` - Technical indicators and price action
- `economicAgent` - Economic indicators and market performance
- `incomeStatementAgent` - Income statement analysis
- `balanceSheetAgent` - Balance sheet analysis
- `cashFlowAgent` - Cash flow statement analysis
- `financialRatiosAgent` - Financial ratios analysis
- `keyMetricsAgent` - Key metrics analysis
- `otherStatementAgent` - Financial scores (Altman Z, Piotroski)
- `incomeStatementGrowthAgent` - Income statement growth trends
- `balanceSheetGrowthAgent` - Balance sheet growth trends
- `cashFlowGrowthAgent` - Cash flow growth trends

**Layer 2: Reasoning (2 agents)**
- `bullishAgent` - Construct bullish argument
- `bearishAgent` - Construct bearish argument

**Layer 3: Rebuttals (2 agents)**
- `bullishRebuttalAgent` - Rebut bear case
- `bearishRebuttalAgent` - Rebut bull case

**Layer 4: Decision (1 agent)**
- `decisionAgent` - Final trading decision (BUY/SELL/HOLD)

**Account Manager (1 agent)**
- `accountManagerAgent` - Autonomous portfolio management

### Workflow Architecture

**Analyze Stock Workflow:**
1. **Layer 1** - 15 data collection agents in 3 batches of 5 (to manage rate limits)
2. **Layer 2** - 2 reasoning agents in parallel (bullish & bearish)
3. **Layer 3** - 2 rebuttal agents in parallel
4. **Layer 4** - 1 decision agent (final BUY/SELL/HOLD)

**Execute Trade Workflow:**
1. Validate trade (check buying power, positions)
2. Execute trade (submit to Alpaca)
3. Save order to database
4. Format result

---

## Database Schema

### Core Tables

- `users` - User accounts
- `sessions` - User sessions
- `reports` - Analysis results (Layer 1-4 data)
- `held_stocks` - Portfolio positions
- `trade_history` - Trade execution history
- `orders` - Order tracking (links to Alpaca)
- `job_queue` - Scheduled job tracking
- `agent_activity` - Agent action logging (monitor, analyze, trade, wake_up)

---

## Autonomous Trading Architecture

### Heartbeat Scheduler

A simplified scheduler that only wakes the Account Manager Agent if it's been idle too long:

- **Heartbeat Interval**: Every 15 minutes (configurable via `HEARTBEAT_INTERVAL_MINUTES`)
- **Idle Thresholds**:
  - Market hours: 15 minutes (configurable via `IDLE_THRESHOLD_MARKET_HOURS`)
  - Off-hours: 60 minutes (configurable via `IDLE_THRESHOLD_OFF_HOURS`)

### Account Manager Agent

The Account Manager Agent is **truly autonomous** - it decides what actions to take based on:

1. **Market Status** - Is the market open? Time until open/close?
2. **Portfolio State** - Current positions, cash, buying power
3. **Activity History** - What actions were taken recently?
4. **Analysis History** - Past analysis decisions

**Available Tools:**
- `triggerAnalysisTool` - Analyze a stock comprehensively
- `executeTradeTool` - Execute buy/sell orders
- `getPortfolioSummaryTool` - Get complete portfolio overview
- `getPositionDetailsTool` - Get detailed position info
- `getAnalysisHistoryTool` - Review past analysis decisions
- `getCurrentPriceTool` - Get current market price
- `calculatePositionSizeTool` - Calculate position size
- `getMarketStatusTool` - Check market open/close status
- `getActivityHistoryTool` - Get recent agent activities
- `getTimeSinceLastActionTool` - Get time since last action type
- `logActivity` - Log agent actions (internal)

**Decision-Making Framework:**
- During market hours: More proactive, prioritize action
- Outside market hours: Reduced activity, focus on analysis
- After analysis: **MUST execute trades immediately** if BUY/SELL signal
- Risk management: Position sizing (5-10% per position), diversification

---

## Paper Trading (Alpaca)

### Integration

- **Package**: `@alpacahq/alpaca-trade-api`
- **Endpoint**: `https://paper-api.alpaca.markets/v2`
- **Environment Variables**: `ALPACA_API_KEY`, `ALPACA_API_SECRET`

### Features

- Account information retrieval
- Position management
- Order submission (market, limit, stop, stop_limit)
- Order cancellation
- Real-time quotes

---

## Rate Limiting & Performance

### Groq API Rate Limits

- **Developer Plan**: 30 RPM, 8K TPM
- **Strategies**:
  - Batch Layer 1 agents (3 batches of 5)
  - Delay between batches (2 seconds)
  - Data reduction utilities (extract only essential fields)
  - Retry logic with exponential backoff
  - Throttling (1 analysis at a time)

### Data Reduction

Custom utilities extract only essential fields from FMP API responses before passing to LLMs, drastically reducing token consumption.

---

## SvelteKit Remote Functions

Using experimental Remote Functions for type-safe client-server communication:

- `analyzeStock` command - Run analysis workflow
- `getAnalysisStatus` query - Check analysis status
- `getReports` query - List reports
- `getReport` query - Get single report
- `getAccount` query - Get Alpaca account
- `getPositions` query - Get positions
- `submitOrder` command - Submit trade order

---

## Docker Setup

```yaml
# compose.yml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-postgres}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-postgres}
      POSTGRES_DB: ${POSTGRES_DB:-stockagents}
    volumes:
      - pgdata:/var/lib/postgresql/data

  app:
    build: ./app
    environment:
      DATABASE_URL: postgres://postgres:postgres@db:5432/stockagents
      FMP_API_KEY: ${FMP_API_KEY}
      GROQ_API_KEY: ${GROQ_API_KEY}
      ALPACA_API_KEY: ${ALPACA_API_KEY}
      ALPACA_API_SECRET: ${ALPACA_API_SECRET}
      SCHEDULER_ENABLED: ${SCHEDULER_ENABLED:-true}
      HEARTBEAT_INTERVAL_MINUTES: ${HEARTBEAT_INTERVAL_MINUTES:-15}
    depends_on:
      db:
        condition: service_healthy
```

---

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Keep Mastra | Provides workflow orchestration, leaves door open for complex flows |
| Integrate directly, no separate service | Eliminates network hop, simplifies deployment |
| Postgres for storage | Single database for all data, Mastra supports it |
| Split statement agents (15 Layer 1) | Specificity and separation of concerns |
| SvelteKit adapter-bun | Faster startup, native TypeScript |
| Autonomous agent architecture | Agent decides actions, scheduler only wakes if idle |
| Heartbeat scheduler | Simple cron job, no complex scheduling logic |
| Groq for LLM | Fast, cost-effective, supports tool usage |
| Data reduction utilities | Minimize token consumption, avoid rate limits |

---

## Account Manager Agent Capabilities

### Current Capabilities ✅

The Account Manager Agent currently supports:

1. **Portfolio Monitoring** - Complete portfolio overview (cash, equity, positions, orders)
2. **Stock Analysis** - Trigger comprehensive stock analysis workflows
3. **Trade Execution** - Execute buy and sell orders with validation
4. **Position Management** - Get detailed position information
5. **Analysis History** - Review past analysis decisions
6. **Price Lookup** - Get current market prices
7. **Position Sizing** - Calculate appropriate position sizes based on allocation percentage
8. **Market Status** - Check market open/close status and time until next event
9. **Activity Tracking** - Log and review agent actions (monitor, analyze, trade, wake_up)

### Future Enhancements

#### High Priority 🎯

**1. Automated Stop Loss Management**
- **Tool**: `setStopLossTool`
- **Use Case**: Protect profits and limit losses
- **Implementation**: Create stop-loss orders when positions reach certain thresholds
- **Features**:
  - Trailing stop losses
  - Percentage-based stops (e.g., 5% below entry)
  - Time-based stops (e.g., if position doesn't move in 30 days)
  - Volatility-adjusted stops

**2. Take Profit Orders**
- **Tool**: `setTakeProfitTool`
- **Use Case**: Lock in gains at target levels
- **Implementation**: Create limit sell orders at profit targets
- **Features**:
  - Partial profit taking (e.g., sell 50% at 20% gain)
  - Multiple profit targets (e.g., 10%, 20%, 30%)
  - Trailing profit stops

**3. Portfolio Rebalancing**
- **Tool**: `rebalancePortfolioTool`
- **Use Case**: Maintain target sector/position allocations
- **Implementation**: Calculate required trades to reach target allocations
- **Features**:
  - Target allocation by sector
  - Target allocation by position size
  - Threshold-based rebalancing (only rebalance if drift > 5%)
  - Tax-efficient rebalancing (prefer selling losers for tax loss harvesting)

**4. Correlation Analysis**
- **Tool**: `analyzeCorrelationTool`
- **Use Case**: Avoid over-concentration in correlated assets
- **Implementation**: Calculate correlation matrix of current positions
- **Features**:
  - Identify highly correlated positions (>0.7 correlation)
  - Suggest diversification opportunities
  - Sector correlation analysis

#### Medium Priority 📊

**5. Sector Allocation Tracking**
- **Tool**: `getSectorAllocationTool`
- **Use Case**: Ensure proper sector diversification
- **Implementation**: Group positions by sector and calculate percentages
- **Features**:
  - Current sector allocation
  - Target sector allocation
  - Sector drift alerts
  - Sector rotation suggestions

**6. Performance Metrics**
- **Tool**: `calculatePerformanceMetricsTool`
- **Use Case**: Track portfolio performance and risk-adjusted returns
- **Implementation**: Calculate Sharpe ratio, max drawdown, win rate, etc.
- **Features**:
  - Sharpe ratio
  - Maximum drawdown
  - Win rate and average win/loss
  - Portfolio beta
  - Alpha vs benchmark

**7. News Monitoring & Alerts**
- **Tool**: `monitorNewsTool`
- **Use Case**: Trigger analysis on significant news events
- **Implementation**: Check news API for portfolio symbols
- **Features**:
  - News sentiment analysis
  - Significant news alerts (earnings, FDA approvals, etc.)
  - Automatic re-analysis trigger on major news
  - News impact assessment

**8. Earnings Calendar Tracking**
- **Tool**: `getEarningsCalendarTool`
- **Use Case**: Prepare for earnings announcements
- **Implementation**: Get earnings calendar from FMP API
- **Features**:
  - Upcoming earnings dates
  - Historical earnings surprises
  - Pre-earnings analysis trigger
  - Post-earnings re-evaluation

#### Low Priority 🌊

**9. Market Regime Detection**
- **Tool**: `detectMarketRegimeTool`
- **Use Case**: Adapt strategy to market conditions
- **Implementation**: Analyze market indicators (VIX, market breadth, etc.)
- **Features**:
  - Bull/bear/sideways market detection
  - Volatility regime (low/medium/high)
  - Strategy adaptation (defensive vs aggressive)
  - Market timing signals

**10. Advanced Position Sizing**
- **Tool**: `optimizePositionSizeTool`
- **Use Case**: Optimize position sizes using advanced methods
- **Implementation**: Implement Kelly Criterion, Risk Parity, etc.
- **Features**:
  - Kelly Criterion calculation
  - Risk parity allocation
  - Volatility-based sizing
  - Correlation-adjusted sizing

**11. Order Management**
- **Tool**: `manageOrdersTool`
- **Use Case**: Cancel stale orders, update limit prices
- **Implementation**: Review and manage open orders
- **Features**:
  - Cancel stale limit orders
  - Update limit prices based on current price
  - Order expiration management
  - Fill monitoring

**12. Tax Loss Harvesting**
- **Tool**: `harvestTaxLossesTool`
- **Use Case**: Optimize tax efficiency (for real trading)
- **Implementation**: Identify losing positions for tax loss harvesting
- **Features**:
  - Identify unrealized losses
  - Wash sale detection
  - Tax-efficient selling suggestions
  - Replacement stock suggestions

See `ACCOUNT_MANAGER_CAPABILITIES.md` for detailed usage examples and implementation notes.

---

## Environment Variables

```env
# Database
DATABASE_URL=postgres://postgres:postgres@localhost:5432/stockagents

# FMP API
FMP_API_KEY=your_fmp_key

# Groq API
GROQ_API_KEY=your_groq_key

# Alpaca Paper Trading
ALPACA_API_KEY=your_paper_key
ALPACA_API_SECRET=your_paper_secret

# Scheduler
SCHEDULER_ENABLED=true
HEARTBEAT_INTERVAL_MINUTES=15
IDLE_THRESHOLD_MARKET_HOURS=15
IDLE_THRESHOLD_OFF_HOURS=60

# Market Hours (optional, defaults to 9:30 AM - 4:00 PM ET)
MARKET_OPEN_HOUR=9
MARKET_OPEN_MINUTE=30
MARKET_CLOSE_HOUR=16
MARKET_TIMEZONE=America/New_York
```

