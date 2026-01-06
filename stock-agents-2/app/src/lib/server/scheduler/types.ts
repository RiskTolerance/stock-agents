export type ScheduleMode = 'monitor' | 'analyze' | 'trade' | 'rebalance' | 'full';

export interface ScheduleConfig {
	id: string;
	name: string;
	cronExpression: string;
	mode: ScheduleMode;
	maxActions?: number;
	symbols?: string[];
	enabled: boolean;
	timezone?: string;
}

export interface JobPayload {
	mode: ScheduleMode;
	maxActions: number;
	symbols?: string[];
}

