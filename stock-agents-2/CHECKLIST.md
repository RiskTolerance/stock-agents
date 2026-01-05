# Stock Agents Rewrite Checklist

> **Reference:** See [rewrite.md](rewrite.md) for detailed implementation notes and architecture decisions.

---

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

- [ ] **Dependencies**
  - [x] Install Mastra core packages (`@mastra/core`, `@mastra/pg`)
  - [x] Install OpenAI SDK (`@ai-sdk/openai`)
  - [x] Install Alpaca SDK (`@alpacahq/alpaca-trade-api`)
  - [x] Install Drizzle ORM
  - [x] Install Zod for schema validation

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

- [x] **Agent Configuration**
  - [x] Set model selection (groq/openai/gpt-oss-20b for all Layer 1 agents)
  - [x] Configure agent instructions/prompts (all Layer 1 agents)
  - [x] Wire up tools to agents (all Layer 1 agents)
  - [x] Test each agent individually (51 tests passing)

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
  - [x] Fix rate limiting issue (batched Layer 1 agents to avoid Groq limits)
  - [ ] Add error handling and retries

- [ ] **Execute Trade Workflow** (`workflows/execute-trade.ts`)
  - [ ] Create validate trade step
  - [ ] Create execute trade step
  - [ ] Wire up workflow
  - [ ] Test with paper account
  - [ ] Add error handling

- [x] **Mastra Instance Setup**
  - [x] Configure Mastra with PostgresStore
  - [x] Register all agents (20 total: 15 Layer 1, 2 Layer 2, 2 Layer 3, 1 Layer 4)
  - [x] Register analyze-stock workflow
  - [x] Set up environment variables for Mastra (`env.ts`)
  - [x] Fix API key configuration (process.env setup)
  - [x] Test Mastra initialization
  - [ ] Add workflow execution logging

---

## Remote Functions (SvelteKit experimental)

Using [SvelteKit Remote Functions](https://svelte.dev/docs/kit/remote-functions) instead of traditional API routes for type-safe client-server communication.

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
  - [ ] Connect to Alpaca once API keys are configured

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
  - [ ] Connect to Alpaca for real data
  - [ ] Add charts/graphs

- [ ] **Trading**
  - [ ] Execute trade form page
  - [ ] Order confirmation modal
  - [ ] Order status tracking

---

## Docker & Deployment

- [ ] **Docker Configuration**
  - [ ] Create Dockerfile for app (Bun multi-stage)
  - [ ] Update docker-compose.yml (2 services: db, app)
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

- [ ] **Alpaca Integration**
  - [x] Create Alpaca service module (`src/lib/server/alpaca/index.ts`)
  - [x] Add helper functions (getAccount, getPositions, submitOrder, etc.)
  - [ ] Test Alpaca connection
  - [ ] Verify paper trading mode

- [ ] **Trading Workflow**
  - [ ] Create `execute-trade` workflow
  - [ ] Add trade validation logic
  - [ ] Add order execution
  - [ ] Test buy orders
  - [ ] Test sell orders
  - [ ] Handle errors gracefully

- [ ] **Order Tracking**
  - [ ] Add orders table to schema
  - [ ] Link orders to trade_history
  - [ ] Sync order status from Alpaca
  - [ ] Add order status updates

- [ ] **Testing**
  - [ ] Test with paper account
  - [ ] Verify order execution
  - [ ] Test position tracking
  - [ ] Test portfolio sync

---

## Testing & Quality

- [ ] **Unit Tests**
  - [x] FMP tools tests (103 tests passing)
  - [x] Agent tests (51 tests passing - all Layer 1 agents)
  - [x] Workflow tests (6 tests passing - analyze-stock workflow)
  - [ ] Remote function tests (integration tests)
  - [ ] Utility function tests

- [ ] **Integration Tests**
  - [ ] End-to-end workflow test
  - [ ] Database integration tests
  - [ ] Alpaca integration tests
  - [ ] Full stack tests

- [ ] **Code Quality**
  - [ ] Run linter
  - [ ] Fix all linting errors
  - [ ] Add type safety checks
  - [ ] Add error boundaries

---

## Future Enhancements (Out of Scope)

- [ ] **Scheduled Re-evaluation**
  - [ ] Set up pg-boss or similar
  - [ ] Create scheduled job system
  - [ ] Daily re-analysis of held positions
  - [ ] Auto-trade on decision changes

- [ ] **Human-in-the-Loop**
  - [ ] Implement pausable workflows
  - [ ] Add approval UI
  - [ ] Resume workflow on approval
  - [ ] Add trade threshold configuration

---

## Notes

- **Current Status:** ✅ **Database persistence complete!** Analysis results are now saved and retrievable. Full workflow pipeline functional end-to-end. Ready for Alpaca integration and trade execution.
- **Priority:** Alpaca integration → Trade execution → Environment config → Docker setup
- **Testing:** ✅ Agents tested, workflow tested, end-to-end analysis successful, database persistence verified
- **Reference:** See [rewrite.md](rewrite.md) for detailed architecture and implementation notes

## Recent Achievements 🎉

- ✅ **Workflow Execution Fixed**: Resolved API key configuration issue with Mastra
- ✅ **End-to-End Analysis Working**: Successfully ran full 4-layer analysis pipeline
- ✅ **Remote Functions Integrated**: Type-safe client-server communication working
- ✅ **UI Functional**: All pages created and tested with real workflow execution
- ✅ **Database Persistence**: Reports are now saved and retrievable from database

