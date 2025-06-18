export const buildQuery = (endpoint: string, options: Record<string, any>) => {
	const baseUrl = `https://financialmodelingprep.com/stable/${endpoint}`;
	let queryParamString = '';
	(() => {
		for (const [key, value] of Object.entries(options)) {
			if (value !== undefined) {
				queryParamString += `${key}=${value}&`;
			}
		}
	})();
	return `${baseUrl}?${queryParamString}&apikey=${process.env.FMP_API_KEY}`;
};
