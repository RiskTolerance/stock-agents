/**
 * Environment variable setup for Mastra
 * This file MUST be imported before any Mastra agents or workflows
 */
import { env } from '$env/dynamic/private';

// Ensure API keys are available in process.env for Mastra
// Mastra's model router looks for keys in process.env
if (env.GROQ_API_KEY) {
	process.env.GROQ_API_KEY = env.GROQ_API_KEY;
}
if (env.OPENAI_API_KEY) {
	process.env.OPENAI_API_KEY = env.OPENAI_API_KEY;
}
if (env.FMP_API_KEY) {
	process.env.FMP_API_KEY = env.FMP_API_KEY;
}
if (env.DATABASE_URL) {
	process.env.DATABASE_URL = env.DATABASE_URL;
}

// Verify required keys are set
if (!process.env.GROQ_API_KEY) {
	throw new Error('GROQ_API_KEY is not set in environment');
}
if (!process.env.FMP_API_KEY) {
	throw new Error('FMP_API_KEY is not set in environment');
}
if (!process.env.DATABASE_URL) {
	throw new Error('DATABASE_URL is not set in environment');
}

