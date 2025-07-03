import { createTool } from '@mastra/core/tools';
import { createFmpApi } from 'fmp-api';
import { z } from 'zod';

const fmpApi = createFmpApi(`${process.env.FMP_API_KEY}`);

const execute = async () => {
	const newPrivatelyOwnedHousingUnitsStartedTotalUnits = await fmpApi.Economics.economicIndicators('newPrivatelyOwnedHousingUnitsStartedTotalUnits');
	return { newPrivatelyOwnedHousingUnitsStartedTotalUnits };
};

export const newPrivatelyOwnedHousingUnitsStartedTotalUnitsTool = createTool({
	id: 'fetch-new-privately-owned-housing-units-started-total-units',
	description: 'Fetch New Privately Owned Housing Units Started Total Units data.',
	inputSchema: z.object({}),
	execute,
});
