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
	const KEY = process.env.FMP_API_KEY ?? 'pLziYh3bDTK9yioOpheiLREFHcpxbK1X';
	const query = `${baseUrl}?${queryParamString}&apikey=${KEY}`;
	console.log(query);
	return query;
};
