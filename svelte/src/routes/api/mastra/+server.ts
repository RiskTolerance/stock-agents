import { MastraClient } from '@mastra/client-js';

export async function GET(event) {
	console.log(event.url);
	const client = new MastraClient({
		baseUrl: 'http://localhost:4111'
	});

	const workflow = client.getWorkflow('tradingWorkflow');

	const run = await workflow.createRun();
	console.log('Oh yeah, its AI time.');
	const symbol = event.url.searchParams.get('symbol');
	console.log(`Maybe this gets the symbol? ${symbol}`);

	const res = await workflow.startAsync({
		runId: run.runId,
		inputData: {
			symbol: symbol ?? 'AAPL'
		}
	});
	console.log(res);
	console.log(`The response is ${res.steps}`);
	return new Response(JSON.stringify(res));
}
