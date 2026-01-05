# Stock Agents Rewrite Plan

## Overview

Consolidate the multi-container architecture into a simpler, two-container setup while retaining Mastra for agent orchestration. Mastra will be integrated directly into SvelteKit rather than running as a separate service.

**Current Architecture (4 containers):**
- `db` (Postgres)
- `orchestrator` (Node.js workers - barely used)
- `mastra` (separate HTTP service)
- `svelte` (frontend, proxies to mastra)

**Target Architecture (2 containers):**
- `db` (Postgres)
- `app` (SvelteKit + Mastra integrated, adapter-node)

---

## Goals

1. **Simplify deployment** — fewer moving parts, easier to debug
2. **Keep Mastra** — retain agent orchestration capabilities for future complexity
3. **Direct integration** — call Mastra workflows from SvelteKit server routes (no HTTP proxy)
4. **Postgres for everything** — state, job queue, auth, reports
5. **Prepare for future legs** — trading execution, position monitoring, scheduled re-evaluation

---

## Phase 1: Project Structure

```
stock-agents/
├── docker-compose.yml
├── packages/
│   └── fmp-api/              # Keep as internal package (or continue using npm)
└── app/                       # SvelteKit application
    ├── Dockerfile
    ├── package.json
    ├── svelte.config.js       # adapter-node
    ├── drizzle.config.ts
    ├── src/
    │   ├── app.html
    │   ├── app.css
    │   ├── hooks.server.ts
    │   ├── lib/
    │   │   ├── server/
    │   │   │   ├── db/
    │   │   │   │   ├── index.ts         # Drizzle client
    │   │   │   │   └── schema/
    │   │   │   │       ├── users.ts
    │   │   │   │       ├── reports.ts
    │   │   │   │       ├── orders.ts
    │   │   │   │       ├── held-stocks.ts
    │   │   │   │       ├── trade-history.ts
    │   │   │   │       └── job-queue.ts
    │   │   │   ├── auth.ts              # Session management
    │   │   │   ├── alpaca/
    │   │   │   │   └── index.ts         # Alpaca client & helpers
    │   │   │   ├── mastra/
    │   │   │   │   ├── index.ts         # Mastra instance
    │   │   │   │   ├── agents/
    │   │   │   │   │   ├── analyst.ts
    │   │   │   │   │   ├── company.ts
    │   │   │   │   │   ├── insider.ts
    │   │   │   │   │   ├── news.ts
    │   │   │   │   │   ├── technical.ts
    │   │   │   │   │   ├── economic.ts
    │   │   │   │   │   ├── company-statements/
    │   │   │   │   │   │   ├── income-statement.ts
    │   │   │   │   │   │   ├── balance-sheet.ts
    │   │   │   │   │   │   ├── cash-flow.ts
    │   │   │   │   │   │   ├── financial-ratios.ts
    │   │   │   │   │   │   ├── key-metrics.ts
    │   │   │   │   │   │   ├── other-statement.ts
    │   │   │   │   │   │   ├── income-statement-growth.ts
    │   │   │   │   │   │   ├── balance-sheet-growth.ts
    │   │   │   │   │   │   └── cash-flow-growth.ts
    │   │   │   │   │   ├── bullish.ts
    │   │   │   │   │   ├── bearish.ts
    │   │   │   │   │   ├── bullish-rebuttal.ts
    │   │   │   │   │   ├── bearish-rebuttal.ts
    │   │   │   │   │   └── decision.ts
    │   │   │   │   ├── tools/
    │   │   │   │   │   ├── fmp-tools.ts    # All FMP API tools in one file
    │   │   │   │   │   └── ... 
    │   │   │   │   └── workflows/
    │   │   │   │       ├── analyze-stock.ts
    │   │   │   │       └── execute-trade.ts
    │   │   │   └── jobs/
    │   │   │       └── scheduler.ts      # pg-boss or similar
    │   │   ├── components/
    │   │   │   └── ui/
    │   │   └── utils.ts
    │   └── routes/
    │       ├── +layout.svelte
    │       ├── +page.svelte              # Dashboard
    │       ├── api/
    │       │   ├── analyze/
    │       │   │   └── [symbol]/
    │       │   │       └── +server.ts    # POST: run analysis workflow
    │       │   ├── reports/
    │       │   │   └── +server.ts        # CRUD for saved reports
    │       │   ├── trades/
    │       │   │   ├── +server.ts        # GET: list orders
    │       │   │   └── execute/
    │       │   │       └── +server.ts    # POST: execute trade
    │       │   └── portfolio/
    │       │       └── +server.ts        # GET: account & positions
    │       ├── analyze/
    │       │   └── +page.svelte          # UI to trigger analysis
    │       ├── reports/
    │       │   ├── +page.svelte          # List reports
    │       │   └── [id]/
    │       │       └── +page.svelte      # View single report
    │       ├── portfolio/
    │       │   └── +page.svelte          # Portfolio view
    │       ├── trades/
    │       │   ├── +page.svelte          # Trade history
    │       │   └── execute/
    │       │       └── +page.svelte      # Execute trade form
    │       └── (auth)/
    │           ├── login/
    │           └── register/
    └── static/
```

---

## Phase 2: Mastra Integration

### Direct Import (No Separate Service)

Instead of running `mastra dev` as a separate container and calling it via HTTP, import and use Mastra directly in SvelteKit server code.

**Two options for integration:**

1. **Direct usage (recommended for SvelteKit):** Import the Mastra instance and call workflows directly
2. **Server adapter:** Use `MastraServer` with Hono/Express for additional features (auto-generated REST endpoints, middleware)

For this project, we'll use direct imports since SvelteKit's server routes already handle HTTP and we don't need Mastra's auto-generated API:

```typescript
// src/lib/server/mastra/index.ts
import { Mastra } from '@mastra/core/mastra';
import { analyzeStockWorkflow } from './workflows/analyze-stock';
import { PostgresStore } from '@mastra/pg';

export const mastra = new Mastra({
  workflows: { analyzeStockWorkflow },
  storage: new PostgresStore({
    id: 'stock-agents-storage',  // Required in current Mastra
    connectionString: process.env.DATABASE_URL!,
  }),
});
```

```typescript
// src/routes/api/analyze/[symbol]/+server.ts
import { mastra } from '$lib/server/mastra';
import { json } from '@sveltejs/kit';

export async function POST({ params }) {
  const { symbol } = params;
  
  const workflow = mastra.getWorkflow('analyzeStockWorkflow');
  const run = await workflow.createRun();
  
  const result = await workflow.start({
    runId: run.runId,
    inputData: { symbol }
  });
  
  // Save to reports table
  // ...
  
  return json(result);
}
```

### Agent Structure

**Decision:** Keep separate agents for each statement type to maintain specificity and separation of concerns. This reduces context per agent and improves focus.

**Layer 1 Data Collection Agents (15 total):**

| Agent | Purpose |
|-------|---------|
| analystAgent | Analyst ratings, price targets, estimates |
| companyAgent | Company profile, market cap, quote |
| incomeStatementAgent | Income statement analysis |
| balanceSheetAgent | Balance sheet analysis |
| cashFlowAgent | Cash flow statement analysis |
| financialRatiosAgent | Financial ratios analysis |
| keyMetricsAgent | Key metrics analysis |
| otherStatementAgent | Financial scores (Altman Z, Piotroski) |
| incomeStatementGrowthAgent | Income statement growth trends |
| balanceSheetGrowthAgent | Balance sheet growth trends |
| cashFlowGrowthAgent | Cash flow growth trends |
| insiderAgent | Insider trading activity |
| newsAgent | News articles and market sentiment |
| technicalAgent | Technical indicators and price action |
| economicAgent | Economic indicators and market performance |

**Result:** 15 specialized agents, each with focused context and single responsibility.

### Workflow Simplification

Keep the parallel workflow structure but with cleaner code. Per Mastra docs, after `.parallel()` the outputs are keyed by step ID:

```typescript
// src/lib/server/mastra/workflows/analyze-stock.ts
import { createWorkflow, createStep } from '@mastra/core/workflows';
import { z } from 'zod';

// Layer 1: Data Collection (parallel)
const dataCollectionSteps = [
  createDataStep('analyst', analystAgent),
  createDataStep('company', companyAgent),
  createDataStep('income_statement', incomeStatementAgent),
  createDataStep('balance_sheet', balanceSheetAgent),
  createDataStep('cash_flow', cashFlowAgent),
  createDataStep('financial_ratios', financialRatiosAgent),
  createDataStep('key_metrics', keyMetricsAgent),
  createDataStep('other_statement', otherStatementAgent),
  createDataStep('income_statement_growth', incomeStatementGrowthAgent),
  createDataStep('balance_sheet_growth', balanceSheetGrowthAgent),
  createDataStep('cash_flow_growth', cashFlowGrowthAgent),
  createDataStep('insider', insiderAgent),
  createDataStep('news', newsAgent),
  createDataStep('technical', technicalAgent),
  createDataStep('economic', economicAgent),
];

// Combine step receives all parallel outputs
const combineDataStep = createStep({
  id: 'combine-layer1',
  inputSchema: z.object({
    analyst: z.any(),
    company: z.any(),
    income_statement: z.any(),
    balance_sheet: z.any(),
    cash_flow: z.any(),
    financial_ratios: z.any(),
    key_metrics: z.any(),
    other_statement: z.any(),
    income_statement_growth: z.any(),
    balance_sheet_growth: z.any(),
    cash_flow_growth: z.any(),
    insider: z.any(),
    news: z.any(),
    technical: z.any(),
    economic: z.any(),
  }),
  outputSchema: z.object({ layer1Data: z.any() }),
  execute: async ({ inputData }) => ({
    layer1Data: inputData  // Pass all data forward
  }),
});

// Layer 2: Reasoning (parallel)
const reasoningSteps = [
  createReasoningStep('bullish', bullishAgent),
  createReasoningStep('bearish', bearishAgent),
];

// Layer 3: Rebuttals (parallel)  
const rebuttalSteps = [
  createRebuttalStep('bullish-rebuttal', bullishRebuttalAgent),
  createRebuttalStep('bearish-rebuttal', bearishRebuttalAgent),
];

// Layer 4: Decision
const decisionStep = createDecisionStep(decisionAgent);

export const analyzeStockWorkflow = createWorkflow({
  id: 'analyze-stock',
  inputSchema: z.object({ symbol: z.string() }),
  outputSchema: z.object({ decision: z.string(), context: z.any() }),
})
  .parallel(dataCollectionSteps)
  .then(combineDataStep)
  .parallel(reasoningSteps)
  .then(combineReasoningStep)
  .parallel(rebuttalSteps)
  .then(combineRebuttalsStep)
  .then(decisionStep)
  .commit();
```

> **Note:** The `.map()` helper still works, but `.then(combineStep)` is the documented pattern for aggregating parallel outputs.

---

## Phase 3: Database Schema

```sql
-- Users & Auth
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL
);

-- Reports (analysis results)
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  symbol TEXT NOT NULL,
  layer1_data JSONB,
  layer2_reasoning JSONB,
  layer3_rebuttals JSONB,
  decision TEXT,
  confidence INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Portfolio State (for future trading legs)
CREATE TABLE held_stocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  symbol TEXT NOT NULL,
  quantity DECIMAL NOT NULL,
  entry_price DECIMAL NOT NULL,
  entry_date TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'held', -- held, sold, pending_sell
  UNIQUE(user_id, symbol)
);

CREATE TABLE trade_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  symbol TEXT NOT NULL,
  action TEXT NOT NULL, -- buy, sell
  quantity DECIMAL NOT NULL,
  price DECIMAL NOT NULL,
  report_id UUID REFERENCES reports(id),
  executed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job Queue (for scheduled re-evaluation)
CREATE TABLE job_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL, -- 'analyze', 'reevaluate', 'execute_trade'
  payload JSONB NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, running, completed, failed
  scheduled_for TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  result JSONB,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Phase 4: Docker Setup

```yaml
# docker-compose.yml
services:
  db:
    image: postgres:16
    restart: always
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-postgres}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-postgres}
      POSTGRES_DB: ${POSTGRES_DB:-stockagents}
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  app:
    build:
      context: ./app
      dockerfile: Dockerfile
    restart: always
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgres://${POSTGRES_USER:-postgres}:${POSTGRES_PASSWORD:-postgres}@db:5432/${POSTGRES_DB:-stockagents}
      FMP_API_KEY: ${FMP_API_KEY}
      OPENAI_API_KEY: ${OPENAI_API_KEY}
      ALPACA_API_KEY: ${ALPACA_API_KEY}
      ALPACA_API_SECRET: ${ALPACA_API_SECRET}
      ALPACA_PAPER: "true"
      NODE_ENV: production
    depends_on:
      db:
        condition: service_healthy

volumes:
  pgdata:
```

```dockerfile
# app/Dockerfile (Bun)
FROM oven/bun:1 AS builder
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

FROM oven/bun:1-slim AS runner
WORKDIR /app

COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["bun", "run", "./build/index.js"]
```

---

## Phase 5: Migration Checklist

### Step 1: Scaffold New Structure
- [ ] Create `app/` directory
- [ ] Initialize SvelteKit with adapter-node
- [ ] Set up Tailwind, shadcn-svelte components
- [ ] Configure Drizzle with Postgres

### Step 2: Migrate Database
- [ ] Create Drizzle schema files
- [ ] Run initial migration
- [ ] Set up auth (sessions, password hashing)

### Step 3: Port Mastra Code
- [ ] Copy and split agents into `$lib/server/mastra/agents/` (15 Layer 1 agents total)
- [ ] Consolidate tools (especially FMP tools)
- [ ] Port workflow with simplified structure
- [ ] Test workflow execution locally

### Step 4: Build API Routes
- [ ] `POST /api/analyze/[symbol]` — run analysis
- [ ] `GET /api/reports` — list user's reports
- [ ] `GET /api/reports/[id]` — get single report
- [ ] `DELETE /api/reports/[id]` — delete report

### Step 5: Build UI
- [ ] Dashboard page
- [ ] Analysis trigger page (input symbol, run, show results)
- [ ] Reports list page
- [ ] Single report view page
- [ ] Auth pages (login, register)

### Step 6: Docker & Deploy
- [ ] Create Dockerfile for app
- [ ] Update docker-compose.yml
- [ ] Test full stack locally with `docker compose up`
- [ ] Document environment variables

---

## Leg 2: Paper Trading (Alpaca)

Paper trading is **in scope** for this rewrite. Using Alpaca's paper trading API.

### Alpaca Setup

**Package:** `@alpacahq/alpaca-trade-api`

**Environment Variables:**
```env
ALPACA_API_KEY=your_paper_api_key
ALPACA_API_SECRET=your_paper_api_secret
ALPACA_PAPER=true
```

**Base URLs:**
- Paper: `https://paper-api.alpaca.markets`
- Live: `https://api.alpaca.markets` (future)

### Alpaca Service Module

```typescript
// src/lib/server/alpaca/index.ts
import Alpaca from '@alpacahq/alpaca-trade-api';

export const alpaca = new Alpaca({
  keyId: process.env.ALPACA_API_KEY!,
  secretKey: process.env.ALPACA_API_SECRET!,
  paper: true,  // Always paper for now
});

// Helper functions
export async function getAccount() {
  return alpaca.getAccount();
}

export async function getPositions() {
  return alpaca.getPositions();
}

export async function getPosition(symbol: string) {
  try {
    return await alpaca.getPosition(symbol);
  } catch (e) {
    return null; // No position
  }
}

export async function submitOrder(params: {
  symbol: string;
  qty: number;
  side: 'buy' | 'sell';
  type: 'market' | 'limit';
  time_in_force: 'day' | 'gtc' | 'ioc';
  limit_price?: number;
}) {
  return alpaca.createOrder(params);
}

export async function getOrders(status: 'open' | 'closed' | 'all' = 'all') {
  return alpaca.getOrders({ status });
}

export async function cancelOrder(orderId: string) {
  return alpaca.cancelOrder(orderId);
}
```

### Trading Workflow

```typescript
// src/lib/server/mastra/workflows/execute-trade.ts
import { createWorkflow, createStep } from '@mastra/core/workflows';
import { z } from 'zod';
import { submitOrder, getAccount, getPosition } from '$lib/server/alpaca';

const tradeInputSchema = z.object({
  symbol: z.string(),
  action: z.enum(['buy', 'sell']),
  quantity: z.number().optional(),      // If not provided, calculate based on allocation
  allocation: z.number().optional(),    // Percentage of portfolio (e.g., 0.05 = 5%)
  reportId: z.string().optional(),      // Link to the analysis report
});

// Step 1: Validate trade
const validateTradeStep = createStep({
  id: 'validate-trade',
  inputSchema: tradeInputSchema,
  outputSchema: z.object({
    valid: z.boolean(),
    reason: z.string().optional(),
    calculatedQty: z.number(),
  }),
  execute: async ({ inputData }) => {
    const account = await getAccount();
    const buyingPower = parseFloat(account.buying_power);
    
    // Check if selling: do we have the position?
    if (inputData.action === 'sell') {
      const position = await getPosition(inputData.symbol);
      if (!position) {
        return { valid: false, reason: 'No position to sell', calculatedQty: 0 };
      }
      const qty = inputData.quantity || parseFloat(position.qty);
      return { valid: true, calculatedQty: qty };
    }
    
    // Buying: calculate quantity based on allocation or use provided qty
    // (Would need current price - simplified here)
    const qty = inputData.quantity || 1;
    return { valid: true, calculatedQty: qty };
  },
});

// Step 2: Execute trade
const executeTradeStep = createStep({
  id: 'execute-trade',
  inputSchema: z.object({
    symbol: z.string(),
    action: z.enum(['buy', 'sell']),
    calculatedQty: z.number(),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    orderId: z.string().optional(),
    error: z.string().optional(),
  }),
  execute: async ({ inputData }) => {
    try {
      const order = await submitOrder({
        symbol: inputData.symbol,
        qty: inputData.calculatedQty,
        side: inputData.action,
        type: 'market',
        time_in_force: 'day',
      });
      return { success: true, orderId: order.id };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },
});

export const executeTradeWorkflow = createWorkflow({
  id: 'execute-trade',
  inputSchema: tradeInputSchema,
  outputSchema: z.object({
    success: z.boolean(),
    orderId: z.string().optional(),
    error: z.string().optional(),
  }),
})
  .then(validateTradeStep)
  .then(executeTradeStep)
  .commit();
```

### API Routes for Trading

```typescript
// src/routes/api/trades/+server.ts
import { json } from '@sveltejs/kit';
import { getOrders } from '$lib/server/alpaca';

// GET /api/trades - list orders
export async function GET({ url }) {
  const status = url.searchParams.get('status') || 'all';
  const orders = await getOrders(status as 'open' | 'closed' | 'all');
  return json(orders);
}
```

```typescript
// src/routes/api/trades/execute/+server.ts
import { json } from '@sveltejs/kit';
import { mastra } from '$lib/server/mastra';
import { db } from '$lib/server/db';
import { tradeHistory } from '$lib/server/db/schema';

// POST /api/trades/execute - execute a trade
export async function POST({ request, locals }) {
  const { symbol, action, quantity, reportId } = await request.json();
  
  const workflow = mastra.getWorkflow('executeTradeWorkflow');
  const run = await workflow.createRun();
  
  const result = await workflow.start({
    runId: run.runId,
    inputData: { symbol, action, quantity, reportId },
  });
  
  // Log to trade history
  if (result.success) {
    await db.insert(tradeHistory).values({
      userId: locals.user.id,
      symbol,
      action,
      quantity,
      price: 0, // Would get from order fill
      reportId,
    });
  }
  
  return json(result);
}
```

```typescript
// src/routes/api/portfolio/+server.ts
import { json } from '@sveltejs/kit';
import { getAccount, getPositions } from '$lib/server/alpaca';

// GET /api/portfolio - get account and positions
export async function GET() {
  const [account, positions] = await Promise.all([
    getAccount(),
    getPositions(),
  ]);
  
  return json({
    account: {
      equity: account.equity,
      buyingPower: account.buying_power,
      cash: account.cash,
    },
    positions: positions.map(p => ({
      symbol: p.symbol,
      qty: p.qty,
      marketValue: p.market_value,
      avgEntryPrice: p.avg_entry_price,
      unrealizedPl: p.unrealized_pl,
      unrealizedPlpc: p.unrealized_plpc,
    })),
  });
}
```

### UI Components for Trading

Add to project structure:
```
src/routes/
├── portfolio/
│   └── +page.svelte          # Portfolio view with positions
├── trades/
│   ├── +page.svelte          # Trade history
│   └── execute/
│       └── +page.svelte      # Execute trade form
```

### Database Schema Additions

```sql
-- Add order tracking
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  alpaca_order_id TEXT UNIQUE,
  symbol TEXT NOT NULL,
  side TEXT NOT NULL,  -- buy, sell
  qty DECIMAL NOT NULL,
  type TEXT NOT NULL,  -- market, limit
  status TEXT NOT NULL,  -- pending, filled, cancelled, rejected
  filled_avg_price DECIMAL,
  filled_qty DECIMAL,
  report_id UUID REFERENCES reports(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Update trade_history to link to orders
ALTER TABLE trade_history ADD COLUMN order_id UUID REFERENCES orders(id);
```

### Environment Variables Update

```env
# .env.example
DATABASE_URL=postgres://postgres:postgres@localhost:5432/stockagents
FMP_API_KEY=your_fmp_key
OPENAI_API_KEY=your_openai_key

# Alpaca Paper Trading
ALPACA_API_KEY=your_paper_key
ALPACA_API_SECRET=your_paper_secret
ALPACA_PAPER=true
```

### Migration Checklist Update

Add to Phase 5:

### Step 7: Paper Trading Integration
- [ ] Install `@alpacahq/alpaca-trade-api`
- [ ] Create Alpaca service module (`$lib/server/alpaca/`)
- [ ] Create `execute-trade` workflow
- [ ] Add trading API routes
- [ ] Add portfolio API route
- [ ] Create portfolio UI page
- [ ] Create trade execution UI
- [ ] Add orders table to schema
- [ ] Test buy/sell with paper account

---

## Future Legs (Out of Scope for Initial Rewrite)

### Leg 3: Scheduled Re-evaluation
- Background worker using pg-boss
- Daily job: re-analyze all held positions
- If decision changes (HOLD → SELL), create pending trade
- UI: Scheduled jobs view, pending actions

### Leg 4: Human-in-the-Loop Approvals
- This is where Mastra's pausable workflows shine
- Workflow pauses before executing trades > threshold
- User approves via UI
- Workflow resumes and executes

---

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Keep Mastra | Provides workflow orchestration, leaves door open for HITL and complex flows later |
| Integrate directly, no separate service | Eliminates network hop, simplifies deployment, easier debugging |
| Postgres for storage | Already planned, Mastra supports it via `@mastra/pg` |
| Split statement agents | Keep 9 separate statement agents + 6 other agents (15 total) for specificity and separation of concerns |
| SvelteKit adapter-bun | Runs as a Bun server, faster startup, native TypeScript |
| fmp-api as package | Keep using it as npm dependency (it's already published) |
| Alpaca for paper trading | Well-documented API, easy paper/live switch, popular with algo traders |
| Paper trading in initial scope | Test full loop before going live, validate workflow end-to-end |

---

## Open Questions

1. **Mastra storage**: Use `@mastra/pg` (Postgres) or stick with `@mastra/libsql`? 
   - ✅ **Decided: Use Postgres** — Docs confirm `PostgresStore` from `@mastra/pg` works well
   - Note: `id` property is now required: `new PostgresStore({ id: 'storage-id', connectionString: ... })`
   
2. **Agent memory**: Should agents have persistent memory across sessions?
   - Docs show `Memory` with `PostgresStore` for agent memory, plus `PgVector` for semantic recall
   - Recommendation: Skip for MVP (each analysis is stateless), add later if needed

3. **Background jobs**: Use pg-boss, BullMQ, or Mastra's built-in scheduling?
   - Recommendation: Start with pg-boss for simplicity, evaluate Mastra scheduling later

4. **fmp-api**: Keep as local package or continue using npm version?
   - Recommendation: Use npm version (`fmp-api`) unless you need local changes

5. **Model selection**: Currently using Groq's `gpt-oss-20b` for all agents
   - ✅ **Decided: Use `groq/openai/gpt-oss-20b`** — Fast, cost-effective, supports tool usage
   - All Layer 1 agents use same model for consistency

---

## Validated Against Mastra Docs (Context7)

The following patterns have been confirmed against current Mastra documentation:

### PostgresStore Configuration
```typescript
import { PostgresStore } from "@mastra/pg";

const storage = new PostgresStore({
  id: 'mastra-storage',           // Required
  connectionString: process.env.DATABASE_URL,
  schemaName: 'mastra',           // Optional, defaults to 'public'
});
```

### Parallel Workflow Pattern  
```typescript
createWorkflow({...})
  .parallel([step1, step2, step3])
  .then(combineStep)  // Receives { "step1": output1, "step2": output2, "step3": output3 }
  .commit();
```

### Tool Creation
```typescript
import { createTool } from "@mastra/core/tools";

export const myTool = createTool({
  id: "tool-id",
  description: "What this tool does",
  inputSchema: z.object({ ... }),
  outputSchema: z.object({ ... }),
  execute: async ({ context, mastra }) => {
    // context contains input data
    // mastra gives access to other agents/workflows
    return { ... };
  },
});
```

### Agent Memory with Postgres (Optional)
```typescript
import { Memory } from "@mastra/memory";
import { PostgresStore } from "@mastra/pg";

new Agent({
  // ...
  memory: new Memory({
    storage: new PostgresStore({
      id: 'agent-memory',
      connectionString: process.env.DATABASE_URL!,
    }),
  }),
});
```

### Server Integration Options
- **Express:** `@mastra/express` with `MastraServer`
- **Hono:** `@mastra/hono` with `MastraServer`
- **Direct:** Just import and use Mastra instance (our approach for SvelteKit)

