/**
 * Rate limit utilities for handling Groq API rate limits
 */

export interface RetryOptions {
	maxRetries?: number;
	initialDelayMs?: number;
	maxDelayMs?: number;
	backoffMultiplier?: number;
}

const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
	maxRetries: 3,
	initialDelayMs: 1000, // Start with 1 second
	maxDelayMs: 30000, // Max 30 seconds
	backoffMultiplier: 2 // Double delay each retry
};

/**
 * Check if an error is a rate limit error
 */
export function isRateLimitError(error: any): boolean {
	if (!error) return false;
	
	const errorMessage = error.message || error.toString() || '';
	const errorString = JSON.stringify(error).toLowerCase();
	
	return (
		errorMessage.includes('Rate limit') ||
		errorMessage.includes('rate limit') ||
		errorMessage.includes('TPM') ||
		errorMessage.includes('RPM') ||
		errorString.includes('rate limit') ||
		errorString.includes('429') ||
		(errorMessage.includes('Please try again in') && errorMessage.includes('ms'))
	);
}

/**
 * Extract retry delay from rate limit error message
 * Groq errors include: "Please try again in 229.92ms"
 */
export function extractRetryDelay(error: any): number | null {
	if (!error) return null;
	
	const errorMessage = error.message || error.toString() || '';
	const match = errorMessage.match(/Please try again in ([\d.]+)\s*ms/i);
	
	if (match && match[1]) {
		const delayMs = parseFloat(match[1]);
		if (!isNaN(delayMs) && delayMs > 0) {
			// Add a small buffer (10%) to the delay
			return Math.ceil(delayMs * 1.1);
		}
	}
	
	return null;
}

/**
 * Calculate delay for exponential backoff
 */
function calculateDelay(retryAttempt: number, options: Required<RetryOptions>): number {
	const delay = options.initialDelayMs * Math.pow(options.backoffMultiplier, retryAttempt);
	return Math.min(delay, options.maxDelayMs);
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff on rate limit errors
 */
export async function retryOnRateLimit<T>(
	fn: () => Promise<T>,
	options: RetryOptions = {}
): Promise<T> {
	const opts = { ...DEFAULT_RETRY_OPTIONS, ...options };
	let lastError: any;
	
	for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
		try {
			return await fn();
		} catch (error: any) {
			lastError = error;
			
			// If it's not a rate limit error, throw immediately
			if (!isRateLimitError(error)) {
				throw error;
			}
			
			// If this was the last attempt, throw
			if (attempt === opts.maxRetries) {
				throw new Error(
					`Rate limit error after ${opts.maxRetries + 1} attempts: ${error.message}`
				);
			}
			
			// Extract delay from error message if available, otherwise use exponential backoff
			let delay = extractRetryDelay(error);
			if (!delay) {
				delay = calculateDelay(attempt, opts);
			}
			
			console.warn(
				`[Rate Limit] Attempt ${attempt + 1}/${opts.maxRetries + 1} failed. Retrying in ${delay}ms...`
			);
			
			await sleep(delay);
		}
	}
	
	throw lastError;
}

/**
 * Simple throttle to limit concurrent executions
 */
class Throttle {
	private queue: Array<() => Promise<void>> = [];
	private running = 0;
	private maxConcurrent: number;
	
	constructor(maxConcurrent: number = 1) {
		this.maxConcurrent = maxConcurrent;
	}
	
	async execute<T>(fn: () => Promise<T>): Promise<T> {
		return new Promise((resolve, reject) => {
			this.queue.push(async () => {
				try {
					const result = await fn();
					resolve(result);
				} catch (error) {
					reject(error);
				}
			});
			
			this.processQueue();
		});
	}
	
	private async processQueue(): Promise<void> {
		if (this.running >= this.maxConcurrent || this.queue.length === 0) {
			return;
		}
		
		this.running++;
		const task = this.queue.shift()!;
		
		try {
			await task();
		} finally {
			this.running--;
			this.processQueue();
		}
	}
}

// Global throttle for analysis workflows (only 1 concurrent analysis at a time)
export const analysisThrottle = new Throttle(1);

