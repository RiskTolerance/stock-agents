import { createTool } from '@mastra/core/tools';
import { createFmpApi } from 'fmp-api';
import { z } from 'zod';

const fmpApi = createFmpApi(`${process.env.FMP_API_KEY}`);

const execute = async () => {
	const consumerSentiment = await fmpApi.Economics.economicIndicators('consumerSentiment');
	return { consumerSentiment };
};

export const consumerSentimentTool = createTool({
	id: 'fetch-consumer-sentiment',
	description: 'Fetch Consumer Sentiment data.',
	inputSchema: z.object({}),
	execute,
});
