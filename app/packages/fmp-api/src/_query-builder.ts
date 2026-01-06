import dayjs from 'dayjs';

export const buildQuery = (
	endpoint: string,
	options: Record<string, any>,
	apiKey: string
) => {
	const baseUrl = `https://financialmodelingprep.com/stable/${endpoint}`;
	let queryParamString = '';
	(() => {
		for (const [key, value] of Object.entries(options)) {
			if (value !== undefined) {
				if (value instanceof Date) {
					queryParamString += `${key}=${dayjs(value).format('YYYY-DD-MM')}&`;
				} else {
					queryParamString += `${key}=${value}&`;
				}
			}
		}
	})();
	const query = `${baseUrl}?${queryParamString}apikey=${apiKey}`;
	return query;
};
