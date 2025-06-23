import { pgTable, serial, text, timestamp, json } from 'drizzle-orm/pg-core';
import { monitorOperations } from './base';

export const stock = pgTable('stock', {
	id: serial('id').primaryKey(),
	symbol: text('symbol').notNull(),
	companyName: text('company_name').notNull(),
	exchange: text('exchange').notNull(),
});

// dynamically create a table for a passed stock symbol
export const createStockTable = (stockSymbol: string) => {
	return pgTable(`${stockSymbol}_stock_data`, {
		id: serial('id').primaryKey(),
		stockSymbol: text('stock_symbol').notNull(),
		data: json('data').notNull(),
		createdAt: timestamp('created_at').notNull().defaultNow(),
		updatedAt: timestamp('updated_at').notNull().defaultNow(),
	});
};

export const jobQueue_type_monitor = pgTable('job_queue_type_monitor', {
	id: serial('id').primaryKey(),
	operation: monitorOperations('monitor_operation'),
	jobData: json('job_data').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
	status: text('status').notNull().default('pending'),
});
