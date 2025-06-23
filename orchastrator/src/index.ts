import { Worker } from 'worker_threads';
import path from 'path';

if (process.env.NODE_ENV === 'development') {
	const monitor = new Worker(
		path.resolve(__dirname, './src/workers/monitor/index.ts'),
		{
			execArgv: ['-r', 'ts-node/register'],
		}
	);
	const main = new Worker(
		path.resolve(__dirname, './src/workers/main/index.ts'),
		{
			execArgv: ['-r', 'ts-node/register'],
		}
	);
} else {
	const monitor = new Worker(
		path.resolve(__dirname, '../dist/workers/monitor/index.js')
	);
	const main = new Worker(
		path.resolve(__dirname, '../dist/workers/main/index.js')
	);
}
