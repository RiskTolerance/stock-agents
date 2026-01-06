# Stock Agents - TODO Checklist

## Foundation & Setup

- [x] **Project Structure**
  - [x] Create `app/` directory
  - [x] Initialize SvelteKit with adapter-bun
  - [x] Set up Tailwind CSS v4
  - [x] Configure Drizzle with Postgres
  - [x] Copy fmp-api package to `packages/fmp-api/`
  - [x] Fix `financialRatios` endpoint in fmp-api
  - [x] Validate FMP API tools with comprehensive tests
  - [x] Enable SvelteKit remote functions (experimental)

- [ ] **Environment Configuration**
  - [ ] Create `.env.example` with all required variables
  - [ ] Document environment variables in README
  - [ ] Set up environment variable validation

- [x] **Dependencies**
  - [x] Install Mastra core packages (`@mastra/core`, `@mastra/pg`)
  - [x] Install Groq SDK (`@ai-sdk/groq`)
  - [x] Install Alpaca SDK (`@alpacahq/alpaca-trade-api`)
  - [x] Install Drizzle ORM
  - [x] Install Zod for schema validation
  - [x] Install node-cron for scheduling

---

## Database

- [ ] **Schema Implementation**
  - [x] Create base schema file (`src/lib/server/db/schema.ts`)
  - [ ] Split schema into separate files (users, reports, orders, etc.)
  - [ ] Add indexes for performance
  - [ ] Add constraints and validations

- [x] **Migrations**
  - [x] Generate initial migration
  - [x] Run migration against local Postgres
  - [ ] Test migration rollback
  - [ ] Document migration process

- [ ] **Database Setup**
  - [x] Configure Drizzle client
  - [ ] Set up connection pooling
  - [ ] Add database health check endpoint

---

## Authentication & Authorization

- [ ] **Auth Implementation**
  - [ ] Create auth utilities (`src/lib/server/auth.ts`)
  - [ ] Implement password hashing (Argon2)
  - [ ] Create session management
  - [ ] Add auth middleware/hooks
  - [ ] Create login API route
  - [ ] Create register API route
  - [ ] Create logout API route

- [ ] **UI Pages**
  - [ ] Create login page (`routes/(auth)/login/+page.svelte`)
  - [ ] Create register page (`routes/(auth)/register/+page.svelte`)
  - [ ] Add form validation
  - [ ] Add error handling

---

## Mastra Agents

- [x] **Layer 1: Data Collection Agents** (15 agents)
  - [x] `analyst.ts` - Analyst data analysis
  - [x] `company.ts` - Company profile and overview
  - [x] `insider.ts` - Insider trading analysis
  - [x] `news.ts` - News and sentiment analysis
  - [x] `technical.ts` - Technical indicators analysis
  - [x] `economic.ts` - Economic indicators analysis
  - [x] `company-statements/income-statement.ts` - Income statement analysis
  - [x] `company-statements/balance-sheet.ts` - Balance sheet analysis
  - [x] `company-statements/cash-flow.ts` - Cash flow statement analysis
  - [x] `company-statements/financial-ratios.ts` - Financial ratios analysis
  - [x] `company-statements/key-metrics.ts` - Key metrics analysis
  - [x] `company-statements/other-statement.ts` - Financial scores analysis
  - [x] `company-statements/income-statement-growth.ts` - Income statement growth trends
  - [x] `company-statements/balance-sheet-growth.ts` - Balance sheet growth trends
  - [x] `company-statements/cash-flow-growth.ts` - Cash flow growth trends
  - [x] All agents tested (51 tests passing)

- [x] **Layer 2: Reasoning Agents** (2 agents)
  - [x] `bullish.ts` - Bull case reasoning
  - [x] `bearish.ts` - Bear case reasoning

- [x] **Layer 3: Rebuttal Agents** (2 agents)
  - [x] `bullish-rebuttal.ts` - Rebut bear case
  - [x] `bearish-rebuttal.ts` - Rebut bull case

- [x] **Layer 4: Decision Agent** (1 agent)
  - [x] `decision.ts` - Final trading decision (BUY/SELL/HOLD)

- [x] **Account Manager Agent** (1 agent)
  - [x] `account-manager.ts` - Autonomous portfolio management
  - [x] Create account manager tools
  - [x] Create comprehensive agent instructions
  - [x] Register agent in Mastra instance
  - [x] Test agent capabilities

- [x] **Agent Configuration**
  - [x] Set model selection (groq/openai/gpt-oss-20b for all agents)
  - [x] Configure agent instructions/prompts
  - [x] Wire up tools to agents
  - [x] Test each agent individually

---

## Mastra Tools

- [x] **FMP Tools** (All created and tested)
  - [x] `analystDataTool` - Analyst ratings and estimates
  - [x] `companyDataTool` - Company profile and market cap
  - [x] `incomeStatementTool` - Income statement data
  - [x] `balanceSheetTool` - Balance sheet data
  - [x] `cashFlowTool` - Cash flow statement data
  - [x] `financialRatiosTool` - Financial ratios
  - [x] `keyMetricsTool` - Key metrics
  - [x] `otherStatementTool` - Financial scores
  - [x] `incomeStatementGrowthTool` - Income statement growth
  - [x] `balanceSheetGrowthTool` - Balance sheet growth
  - [x] `cashFlowGrowthTool` - Cash flow growth
  - [x] `newsDataTool` - Stock news
  - [x] `insiderDataTool` - Insider trading
  - [x] `technicalDataTool` - Technical indicators
  - [x] `chartDataTool` - Historical price data
  - [x] `economicDataTool` - Economic indicators
  - [x] `marketPerformanceTool` - Market movers

- [x] **Account Manager Tools**
  - [x] `triggerAnalysisTool` - Trigger stock analysis
  - [x] `executeTradeTool` - Execute buy/sell orders
  - [x] `getPortfolioSummaryTool` - Get portfolio overview
  - [x] `getPositionDetailsTool` - Get position details
  - [x] `getAnalysisHistoryTool` - Get analysis history
  - [x] `getCurrentPriceTool` - Get current price
  - [x] `calculatePositionSizeTool` - Calculate position size
  - [x] `getMarketStatusTool` - Get market status
  - [x] `getActivityHistoryTool` - Get activity history
  - [x] `getTimeSinceLastActionTool` - Get time since last action
  - [x] `logActivity` - Log agent activity

- [x] **Data Reduction Utilities**
  - [x] Create data reduction functions for all FMP data types
  - [x] Integrate into FMP tools
  - [x] Test token reduction effectiveness

- [ ] **Tool Testing**
  - [x] Comprehensive test suite with multiple symbols
  - [x] Data validation and usability checks
  - [ ] Add error handling tests
  - [ ] Add rate limiting considerations

---

## Mastra Workflows

- [x] **Analyze Stock Workflow** (`workflows/analyze-stock.ts`)
  - [x] Create Layer 1 data collection steps (batched - 15 agents in 3 batches of 5)
  - [x] Create combine Layer 1 step (merges 3 batches)
  - [x] Create Layer 2 reasoning steps (parallel - bullish & bearish)
  - [x] Create combine Layer 2 step
  - [x] Create prepare rebuttal context step
  - [x] Create Layer 3 rebuttal steps (parallel - bullish & bearish rebuttals)
  - [x] Create combine Layer 3 step
  - [x] Create Layer 4 decision step
  - [x] Wire up workflow with `.parallel()` and `.then()`
  - [x] Test workflow end-to-end (all 6 tests passing)
  - [x] Fix rate limiting issue (batched Layer 1 agents, data reduction)
  - [ ] Add error handling and retries

- [x] **Execute Trade Workflow** (`workflows/execute-trade.ts`)
  - [x] Create validate trade step (checks buying power, positions, account status)
  - [x] Create execute trade step (submits order to Alpaca)
  - [x] Create save order step (saves to database)
  - [x] Wire up workflow (validate → execute → save → format)
  - [x] Test with paper account (✅ Successfully submitted order)
  - [x] Add error handling (validation errors, API errors)
  - [x] Register workflow in Mastra instance

- [x] **Mastra Instance Setup**
  - [x] Configure Mastra with PostgresStore
  - [x] Register all agents (21 total: 15 Layer 1, 2 Layer 2, 2 Layer 3, 1 Layer 4, 1 Account Manager)
  - [x] Register analyze-stock workflow
  - [x] Register execute-trade workflow
  - [x] Set up environment variables for Mastra (`env.ts`)
  - [x] Fix API key configuration (process.env setup)
  - [x] Test Mastra initialization
  - [ ] Add workflow execution logging

---

## Remote Functions (SvelteKit experimental)

- [x] **Configuration**
  - [x] Enable `kit.experimental.remoteFunctions` in svelte.config.js
  - [x] Enable `compilerOptions.experimental.async` for await in components

- [x] **Analysis Remote Functions** (`routes/analyze/data.remote.ts`)
  - [x] `analyzeStock` command - Run analysis workflow
  - [x] `getAnalysisStatus` query - Check analysis status
  - [x] Zod validation for symbol input
  - [x] Error handling and detailed error messages
  - [x] Save results to database after workflow completion
  - [x] Tested end-to-end (workflow execution successful)

- [x] **Reports Remote Functions** (`routes/reports/data.remote.ts`)
  - [x] `getReports` query - List user's reports
  - [x] `getReport` query - Get single report by ID
  - [x] `deleteReport` query - Delete report
  - [x] Connect to database (queries working)
  - [x] Save analysis results to database

- [x] **Portfolio Remote Functions** (`routes/portfolio/data.remote.ts`)
  - [x] `getAccount` query - Get Alpaca account info
  - [x] `getPositions` query - Get all positions
  - [x] `getPosition` query - Get single position
  - [x] `getOrders` query - Get recent orders
  - [x] `submitOrder` command - Submit new order
  - [x] `cancelOrder` command - Cancel order
  - [x] Connect to Alpaca API (paper trading)
  - [x] Map Alpaca response types to UI expectations
  - [x] Add error handling for API calls
  - [x] Test connection and data retrieval

---

## UI Pages

- [x] **Dashboard** (`routes/+page.svelte`)
  - [x] Landing page with navigation cards
  - [x] How it works explanation (4-layer pipeline)
  - [x] Quick action links

- [x] **Analysis** (`routes/analyze/+page.svelte`)
  - [x] Symbol input form
  - [x] Workflow execution via remote function
  - [x] Loading states with spinner
  - [x] Error handling
  - [x] Results display (decision + all layers expandable)
  - [x] Tested end-to-end (successful BUY/SELL/HOLD decision)

- [x] **Reports**
  - [x] List page (`routes/reports/+page.svelte`)
  - [x] Detail page (`routes/reports/[id]/+page.svelte`)
  - [x] Display Layer 1-4 data
  - [x] Connect to database for persistence
  - [ ] Add export functionality

- [x] **Portfolio** (`routes/portfolio/+page.svelte`)
  - [x] Account summary cards (portfolio value, cash, buying power, day's change)
  - [x] Positions table with P&L
  - [x] Recent orders table
  - [x] Connect to Alpaca for real data
  - [ ] Add charts/graphs

- [ ] **Trading**
  - [ ] Execute trade form page
  - [ ] Order confirmation modal
  - [ ] Order status tracking

- [ ] **Monitoring Dashboard** (`routes/monitoring/+page.svelte`)
  - [ ] Track agent decisions and performance
  - [ ] Display autonomous trading activity log
  - [ ] Show agent decision history
  - [ ] Portfolio performance metrics
  - [ ] Agent tool usage statistics

---

## Docker & Deployment

- [ ] **Docker Configuration**
  - [ ] Create Dockerfile for app (Bun multi-stage)
  - [x] Update docker-compose.yml (2 services: db, app)
  - [ ] Add health checks
  - [ ] Configure environment variables
  - [ ] Add volume mounts for development

- [ ] **Deployment Testing**
  - [ ] Test `docker compose up` locally
  - [ ] Verify database connection
  - [ ] Test workflow execution in container
  - [ ] Test API endpoints
  - [ ] Verify environment variable loading

- [ ] **Documentation**
  - [ ] Document Docker setup
  - [ ] Document environment variables
  - [ ] Create deployment guide
  - [ ] Add troubleshooting section

---

## Paper Trading (Alpaca)

- [x] **Alpaca Integration**
  - [x] Create Alpaca service module (`src/lib/server/alpaca/index.ts`)
  - [x] Add helper functions (getAccount, getPositions, submitOrder, etc.)
  - [x] Test Alpaca connection (✅ Working with paper API)
  - [x] Verify paper trading mode (✅ Configured)
  - [x] Connect portfolio remote functions to real API
  - [x] Map response types and format currency values

- [x] **Trading Workflow**
  - [x] Create `execute-trade` workflow
  - [x] Add trade validation logic
  - [x] Add order execution
  - [x] Test buy orders
  - [x] Test sell orders
  - [x] Handle errors gracefully

- [ ] **Order Tracking**
  - [x] Add orders table to schema
  - [ ] Link orders to trade_history
  - [ ] Sync order status from Alpaca
  - [ ] Add order status updates

- [ ] **Testing**
  - [x] Test with paper account
  - [x] Verify order execution
  - [x] Test position tracking
  - [x] Test portfolio sync

---

## Automation & Scheduling

- [x] **Heartbeat Scheduler**
  - [x] Install node-cron dependency
  - [x] Create scheduler service (`src/lib/server/scheduler/index.ts`)
  - [x] Create heartbeat logic (`src/lib/server/scheduler/heartbeat.ts`)
  - [x] Create scheduler configuration (`src/lib/server/scheduler/config.ts`)
  - [x] Initialize scheduler in hooks.server.ts
  - [x] Set up periodic execution (configurable interval, default 15 minutes)
  - [x] Configure idle thresholds (market hours vs off-hours)
  - [x] Test scheduled execution (✅ All tests passing)
  - [x] Create manual trigger API endpoint (`/api/scheduler/trigger`)
  - [x] Integrate with agent_activity table for tracking
  - [x] Fix memory leak (SIGTERM/SIGINT listeners)

- [x] **Agent Activity Tracking**
  - [x] Create `agent_activity` table
  - [x] Create activity tools (`activity-tools.ts`)
  - [x] Integrate activity logging into account manager tools
  - [x] Test activity tracking

---

## Testing & Quality

- [ ] **Unit Tests**
  - [x] FMP tools tests (103 tests passing)
  - [x] Agent tests (51 tests passing - all Layer 1 agents)
  - [x] Workflow tests (6 tests passing - analyze-stock workflow)
  - [x] Execute trade workflow tests
  - [x] Activity tools tests
  - [x] Market status tool tests
  - [x] Heartbeat scheduler tests
  - [ ] Remote function tests (integration tests)
  - [ ] Utility function tests

- [ ] **Integration Tests**
  - [x] End-to-end workflow test
  - [x] Database integration tests
  - [x] Alpaca integration tests
  - [ ] Full stack tests

- [ ] **Code Quality**
  - [ ] Run linter
  - [ ] Fix all linting errors
  - [ ] Add type safety checks
  - [ ] Add error boundaries

---

## Account Manager Enhancements

- [ ] **High Priority 🎯**
  - [ ] **Automated Stop Loss Management**
    - [ ] Create `setStopLossTool` - Automatically set stop-loss orders
    - [ ] Implement trailing stop losses
    - [ ] Implement percentage-based stops (e.g., 5% below entry)
    - [ ] Implement time-based stops (e.g., if position doesn't move in 30 days)
    - [ ] Implement volatility-adjusted stops
    - [ ] Integrate with account manager agent
    - [ ] Test stop loss order creation and execution
  
  - [ ] **Take Profit Orders**
    - [ ] Create `setTakeProfitTool` - Automatically set profit-taking orders
    - [ ] Implement partial profit taking (e.g., sell 50% at 20% gain)
    - [ ] Implement multiple profit targets (e.g., 10%, 20%, 30%)
    - [ ] Implement trailing profit stops
    - [ ] Integrate with account manager agent
    - [ ] Test take profit order creation and execution
  
  - [ ] **Portfolio Rebalancing**
    - [ ] Create `rebalancePortfolioTool` - Automatically rebalance to target allocations
    - [ ] Implement target allocation by sector
    - [ ] Implement target allocation by position size
    - [ ] Implement threshold-based rebalancing (only rebalance if drift > 5%)
    - [ ] Implement tax-efficient rebalancing (prefer selling losers)
    - [ ] Integrate with account manager agent
    - [ ] Test rebalancing logic and trade execution
  
  - [ ] **Correlation Analysis**
    - [ ] Create `analyzeCorrelationTool` - Analyze correlation between positions
    - [ ] Implement correlation matrix calculation
    - [ ] Identify highly correlated positions (>0.7 correlation)
    - [ ] Suggest diversification opportunities
    - [ ] Implement sector correlation analysis
    - [ ] Integrate with account manager agent
    - [ ] Test correlation analysis accuracy

- [ ] **Medium Priority 📊**
  - [ ] **Sector Allocation Tracking**
    - [ ] Create `getSectorAllocationTool` - Track sector exposure
    - [ ] Group positions by sector and calculate percentages
    - [ ] Implement current sector allocation display
    - [ ] Implement target sector allocation configuration
    - [ ] Implement sector drift alerts
    - [ ] Implement sector rotation suggestions
    - [ ] Integrate with account manager agent
    - [ ] Test sector allocation calculations
  
  - [ ] **Performance Metrics**
    - [ ] Create `calculatePerformanceMetricsTool` - Calculate portfolio performance metrics
    - [ ] Implement Sharpe ratio calculation
    - [ ] Implement maximum drawdown calculation
    - [ ] Implement win rate and average win/loss
    - [ ] Implement portfolio beta calculation
    - [ ] Implement alpha vs benchmark calculation
    - [ ] Integrate with account manager agent
    - [ ] Test performance metrics accuracy
  
  - [ ] **News Monitoring & Alerts**
    - [ ] Create `monitorNewsTool` - Monitor news for portfolio holdings
    - [ ] Implement news sentiment analysis
    - [ ] Implement significant news alerts (earnings, FDA approvals, etc.)
    - [ ] Implement automatic re-analysis trigger on major news
    - [ ] Implement news impact assessment
    - [ ] Integrate with account manager agent
    - [ ] Test news monitoring and alert triggers
  
  - [ ] **Earnings Calendar Tracking**
    - [ ] Create `getEarningsCalendarTool` - Track upcoming earnings for positions
    - [ ] Get earnings calendar from FMP API
    - [ ] Display upcoming earnings dates
    - [ ] Show historical earnings surprises
    - [ ] Implement pre-earnings analysis trigger
    - [ ] Implement post-earnings re-evaluation
    - [ ] Integrate with account manager agent
    - [ ] Test earnings calendar integration

- [ ] **Low Priority 🌊**
  - [ ] **Market Regime Detection**
    - [ ] Create `detectMarketRegimeTool` - Detect current market regime (bull/bear/sideways)
    - [ ] Analyze market indicators (VIX, market breadth, etc.)
    - [ ] Implement bull/bear/sideways market detection
    - [ ] Implement volatility regime (low/medium/high)
    - [ ] Implement strategy adaptation (defensive vs aggressive)
    - [ ] Implement market timing signals
    - [ ] Integrate with account manager agent
    - [ ] Test market regime detection accuracy
  
  - [ ] **Advanced Position Sizing**
    - [ ] Create `optimizePositionSizeTool` - Advanced position sizing methods
    - [ ] Implement Kelly Criterion calculation
    - [ ] Implement Risk Parity allocation
    - [ ] Implement volatility-based sizing
    - [ ] Implement correlation-adjusted sizing
    - [ ] Integrate with account manager agent
    - [ ] Test advanced position sizing methods
  
  - [ ] **Order Management**
    - [ ] Create `manageOrdersTool` - Manage pending orders
    - [ ] Implement cancel stale limit orders
    - [ ] Implement update limit prices based on current price
    - [ ] Implement order expiration management
    - [ ] Implement fill monitoring
    - [ ] Integrate with account manager agent
    - [ ] Test order management functionality
  
  - [ ] **Tax Loss Harvesting**
    - [ ] Create `harvestTaxLossesTool` - Identify tax loss harvesting opportunities
    - [ ] Identify unrealized losses
    - [ ] Implement wash sale detection
    - [ ] Implement tax-efficient selling suggestions
    - [ ] Implement replacement stock suggestions
    - [ ] Integrate with account manager agent
    - [ ] Test tax loss harvesting logic (for real trading accounts)

---

## Notes

- **Current Status:** ✅ **Autonomous agent architecture complete!** Account Manager Agent makes independent decisions and executes trades. Heartbeat scheduler wakes agent if idle. Full workflow pipeline functional end-to-end.
- **Priority:** Environment config → Docker setup → Account Manager enhancements → Monitoring dashboard
- **Testing:** ✅ Agents tested, workflows tested, end-to-end analysis successful, database persistence verified, autonomous trading tested
- **Reference:** See `plan.md` for detailed architecture and implementation notes

## Recent Achievements 🎉

- ✅ **Autonomous Agent Architecture**: Account Manager Agent makes independent decisions
- ✅ **Heartbeat Scheduler**: Simple cron-based wake-up system
- ✅ **Agent Activity Tracking**: Full logging of agent actions
- ✅ **Rate Limiting Fixed**: Data reduction and batching strategies implemented
- ✅ **End-to-End Trading**: Analysis → Decision → Execution workflow complete

