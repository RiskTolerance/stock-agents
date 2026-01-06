import {
	pgTable,
	uuid,
	text,
	timestamp,
	jsonb,
	integer,
	decimal,
	unique,
	index
} from 'drizzle-orm/pg-core';

// ============================================================================
// Auth
// ============================================================================

export const users = pgTable('users', {
	id: uuid('id').primaryKey().defaultRandom(),
	email: text('email').unique().notNull(),
	passwordHash: text('password_hash').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

export const sessions = pgTable('sessions', {
	id: text('id').primaryKey(),
	userId: uuid('user_id')
		.references(() => users.id, { onDelete: 'cascade' })
		.notNull(),
	expiresAt: timestamp('expires_at', { withTimezone: true }).notNull()
});

// ============================================================================
// Reports (Analysis Results)
// ============================================================================

export const reports = pgTable('reports', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id').references(() => users.id),
	symbol: text('symbol').notNull(),
	layer1Data: jsonb('layer1_data'),
	layer2Reasoning: jsonb('layer2_reasoning'),
	layer3Rebuttals: jsonb('layer3_rebuttals'),
	decision: text('decision'), // BUY, SELL, HOLD
	confidence: integer('confidence'), // 1-10
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

// ============================================================================
// Trading
// ============================================================================

export const orders = pgTable('orders', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id').references(() => users.id),
	alpacaOrderId: text('alpaca_order_id').unique(),
	symbol: text('symbol').notNull(),
	side: text('side').notNull(), // buy, sell
	qty: decimal('qty').notNull(),
	type: text('type').notNull(), // market, limit
	status: text('status').notNull(), // pending, filled, cancelled, rejected
	filledAvgPrice: decimal('filled_avg_price'),
	filledQty: decimal('filled_qty'),
	reportId: uuid('report_id').references(() => reports.id),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
});

export const heldStocks = pgTable(
	'held_stocks',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		userId: uuid('user_id').references(() => users.id),
		symbol: text('symbol').notNull(),
		quantity: decimal('quantity').notNull(),
		entryPrice: decimal('entry_price').notNull(),
		entryDate: timestamp('entry_date', { withTimezone: true }).notNull(),
		status: text('status').default('held') // held, sold, pending_sell
	},
	(table) => [unique('user_symbol_unique').on(table.userId, table.symbol)]
);

export const tradeHistory = pgTable('trade_history', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id').references(() => users.id),
	symbol: text('symbol').notNull(),
	action: text('action').notNull(), // buy, sell
	quantity: decimal('quantity').notNull(),
	price: decimal('price').notNull(),
	orderId: uuid('order_id').references(() => orders.id),
	reportId: uuid('report_id').references(() => reports.id),
	executedAt: timestamp('executed_at', { withTimezone: true }).defaultNow()
});

// ============================================================================
// Job Queue (for scheduled tasks)
// ============================================================================

export const jobQueue = pgTable('job_queue', {
	id: uuid('id').primaryKey().defaultRandom(),
	type: text('type').notNull(), // analyze, reevaluate, execute_trade
	payload: jsonb('payload').notNull(),
	status: text('status').default('pending'), // pending, running, completed, failed
	scheduledFor: timestamp('scheduled_for', { withTimezone: true }),
	startedAt: timestamp('started_at', { withTimezone: true }),
	completedAt: timestamp('completed_at', { withTimezone: true }),
	result: jsonb('result'),
	error: text('error'),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

// ============================================================================
// Agent Activity Tracking
// ============================================================================

export const agentActivity = pgTable('agent_activity', {
	id: uuid('id').primaryKey().defaultRandom(),
	activityType: text('activity_type').notNull(), // 'monitor', 'analyze', 'trade', 'wake_up'
	symbol: text('symbol'), // optional, for stock-specific activities
	details: jsonb('details'),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

// ============================================================================
// Agent Sessions (for tracking complete agent runs)
// ============================================================================

export const agentSessions = pgTable('agent_sessions', {
	id: uuid('id').primaryKey().defaultRandom(),
	startedAt: timestamp('started_at', { withTimezone: true }).defaultNow(),
	endedAt: timestamp('ended_at', { withTimezone: true }),
	status: text('status').default('running'), // 'running', 'completed', 'failed'
	trigger: text('trigger').notNull(), // 'heartbeat', 'manual', 'api'
	toolCalls: jsonb('tool_calls'), // Array of {tool, input, output, timestamp} (kept for backward compatibility)
	decisionsMade: jsonb('decisions_made'), // Array of {symbol, decision, confidence}
	actionsTaken: jsonb('actions_taken'), // Array of {type, symbol, details}
	fullReasoning: text('full_reasoning'), // Agent's complete output text (kept for backward compatibility)
	conversationHistory: jsonb('conversation_history'), // Array of {role: 'user' | 'assistant', content: string}
	initialContext: jsonb('initial_context'), // Snapshot of initial state (portfolio, market status, idle time, etc.)
	finalContext: jsonb('final_context'), // Snapshot of final state
	error: text('error')
});

// ============================================================================
// Agent Session Iterations (for per-iteration tracking)
// ============================================================================

export const agentSessionIterations = pgTable(
	'agent_session_iterations',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		sessionId: uuid('session_id')
			.references(() => agentSessions.id, { onDelete: 'cascade' })
			.notNull(),
		iteration: integer('iteration').notNull(),
		reasoning: text('reasoning').notNull(), // Agent's text response for this iteration
		toolCalls: jsonb('tool_calls'), // Array of {tool: string, input: unknown, output: unknown, timestamp: string, success: boolean, error?: string}
		context: jsonb('context'), // State snapshot (portfolio summary, market status, analyzed symbols, etc.)
		decisionsConsidered: jsonb('decisions_considered'), // Array of {action: string, symbol?: string, reasoning: string, decided: boolean, reasonNotExecuted?: string}
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
	},
	(table) => [
		index('session_id_idx').on(table.sessionId),
		index('session_iteration_idx').on(table.sessionId, table.iteration)
	]
);

// ============================================================================
// Type exports for use in app
// ============================================================================

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;

export type Report = typeof reports.$inferSelect;
export type NewReport = typeof reports.$inferInsert;

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;

export type HeldStock = typeof heldStocks.$inferSelect;
export type NewHeldStock = typeof heldStocks.$inferInsert;

export type TradeHistoryRecord = typeof tradeHistory.$inferSelect;
export type NewTradeHistoryRecord = typeof tradeHistory.$inferInsert;

export type Job = typeof jobQueue.$inferSelect;
export type NewJob = typeof jobQueue.$inferInsert;

export type AgentActivity = typeof agentActivity.$inferSelect;
export type NewAgentActivity = typeof agentActivity.$inferInsert;

export type AgentSession = typeof agentSessions.$inferSelect;
export type NewAgentSession = typeof agentSessions.$inferInsert;

export type AgentSessionIteration = typeof agentSessionIterations.$inferSelect;
export type NewAgentSessionIteration = typeof agentSessionIterations.$inferInsert;
