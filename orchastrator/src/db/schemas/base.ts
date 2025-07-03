import { pgSchema } from 'drizzle-orm/pg-core';

export const projectSchema = pgSchema('project_schema');

export const jobTypes = projectSchema.enum('job_types', [
	'monitor',
	'evaluate',
	'broker',
]);
// operations are the second level of the job type
export const monitorOperations = projectSchema.enum('monitor_operations', [
	'initial',
	'scheduled',
	're-evaluate',
]);
export const evaluateOperations = projectSchema.enum('evaluate_operations', [
	'evaluate',
	're-evaluate',
]);
export const brokerOperations = projectSchema.enum('broker_operations', [
	'buy',
	'sell',
]);
