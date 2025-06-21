import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
	test: {
		globals: true,
		environment: 'node',
		setupFiles: ['./test/setup.ts'],
		include: ['./src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		exclude: ['**/node_modules/**', '**/dist/**'],
	},
	resolve: {
		alias: {
			'#apis': path.resolve(__dirname, './src/apis'),
			'#agents': path.resolve(__dirname, './src/mastra/agents'),
			'#tools': path.resolve(__dirname, './src/mastra/tools'),
		},
	},
});
