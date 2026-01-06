<script lang="ts">
	import { AreaChart, Axis, Spline, Svg, Tooltip, Highlight } from 'layerchart';
	import dayjs from 'dayjs';
	import { getChartData } from './data.remote';
	import { analyzeStock } from './analyze/data.remote.js';
	import ReportDisplay from '$lib/components/ReportDisplay.svelte';

	let { data } = $props();

	// Use derived for reactive prop values
	const initialPriceChart = $derived(data.priceChart || []);
	const initialSymbol = $derived(data.defaultSymbol || 'GOOGL');

	let stockData = $state(initialPriceChart);
	let symbol = $state(initialSymbol);
	let chartType = $state<'line' | 'candlestick' | 'bar'>('line');
	let dateRange = $state<'1d' | '7d' | '1m' | '3m' | '1y'>('3m');
	let isLoading = $state(false);
	
	// Analysis state
	let isAnalyzing = $state(false);
	let result = $state<Awaited<ReturnType<typeof analyzeStock>> | null>(null);
	let error = $state<string | null>(null);

	// Initialize stockData from server data
	$effect(() => {
		if (initialPriceChart.length > 0) {
			stockData = [...initialPriceChart]; // Create a new array to ensure reactivity
		}
	});

	const getYDomain = (): { min: number; max: number } => {
		if (!stockData || stockData.length === 0) {
			return { min: 0, max: 100 };
		}
		const priceArray = stockData.map((d: { price: number }) => d.price);
		const min = Math.min(...priceArray) - 5;
		const max = Math.max(...priceArray) + 5;
		return { min, max };
	};

	const getDaysForRange = (range: string): number => {
		switch (range) {
			case '1d':
				return 1;
			case '7d':
				return 7;
			case '1m':
				return 30;
			case '3m':
				return 90;
			case '1y':
				return 365;
			default:
				return 90;
		}
	};

	const fetchChartData = async (sym: string, range: string) => {
		if (!sym.trim()) return;
		isLoading = true;
		try {
			const days = getDaysForRange(range);
			const result = await getChartData({ symbol: sym, days });
			if (result && result.priceChart && result.priceChart.length > 0) {
				stockData = [...result.priceChart]; // Create a new array to ensure reactivity
			} else {
				console.warn('No chart data returned');
			}
		} catch (error) {
			console.error('Error fetching chart data:', error);
		} finally {
			isLoading = false;
		}
	};

	const handleSymbolSearch = () => {
		console.log('Search clicked for symbol:', symbol);
		if (symbol.trim()) {
			fetchChartData(symbol, dateRange);
		}
	};

	const handleDateRangeChange = (range: typeof dateRange) => {
		console.log('Date range changed to:', range);
		dateRange = range;
		if (symbol.trim()) {
			fetchChartData(symbol, range);
		}
	};

	const handleChartTypeChange = (type: typeof chartType) => {
		console.log('Chart type changed to:', type);
		chartType = type;
		// Chart type switching would require different chart components
		// For now, we'll just use AreaChart
	};

	// Computed values for result data
	const layer1Data = $derived(result?.context?.layer1Data || {});
	const layer2Reasoning = $derived(result?.context?.layer2Reasoning);
	const layer3Rebuttals = $derived(result?.context?.layer3Rebuttals);
	const decision = $derived(result?.decision || null);

	async function handleAnalyze() {
		if (!symbol.trim()) return;

		isAnalyzing = true;
		error = null;
		result = null;

		try {
			result = await analyzeStock({ symbol: symbol.toUpperCase() });
		} catch (e) {
			error = e instanceof Error ? e.message : 'Analysis failed';
		} finally {
			isAnalyzing = false;
		}
	}
</script>

<svelte:head>
	<title>Stock Agents | AI-Powered Stock Analysis</title>
</svelte:head>

<div class="absolute top-0 left-0 w-full h-full flex justify-center items-center pointer-events-none">
	<div
		class="flex w-4/5 h-4/5 bg-zinc-900/40 shadow-2xl shadow-zinc-950/70 rounded-lg flex-col justify-start z-20 p-8 backdrop-blur-sm pointer-events-auto"
	>
		<div class="container mx-auto">
			<div class="z-20 prose-lg text-white font-bold p-8">
				<h1 class="text-white">AI Stock Counsel</h1>
				<p class="text-sm">The future of stock trading is here.</p>
			</div>
			<div>
				<div class="flex justify-between items-end mb-2">
					<div class="flex items-end gap-2">
						<div class="flex flex-col gap-1">
							<label class="text-[10px] text-white font-medium" for="symbol">Ticker Symbol</label>
							<input
								id="symbol"
								class="w-24 h-10 bg-white rounded-md p-2 text-gray-900"
								type="text"
								bind:value={symbol}
								onkeydown={(e) => {
									if (e.key === 'Enter') {
										handleSymbolSearch();
									}
								}}
								disabled={isLoading}
							/>
						</div>
						<button
							type="button"
							onclick={handleSymbolSearch}
							disabled={isLoading}
							class="bg-teal-400 hover:bg-teal-500 text-gray-900 hover:text-white px-4 py-2 rounded-md h-10 cursor-pointer flex gap-2 group transition-colors duration-400 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Search
							<svg
								class="h-full aspect-square stroke-teal-900 group-hover:stroke-white transition-colors duration-400"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</button>
					</div>
					<div>
						<div class="flex gap-3">
							<button
								type="button"
								onclick={() => handleChartTypeChange('line')}
								class="text-white cursor-pointer px-4 py-2 rounded-lg transition-colors {chartType === 'line'
									? 'bg-teal-500/50'
									: 'hover:bg-zinc-800/50'}"
							>
								Line Chart
							</button>
							<button
								type="button"
								onclick={() => handleChartTypeChange('candlestick')}
								class="text-white cursor-pointer px-4 py-2 rounded-lg transition-colors {chartType === 'candlestick'
									? 'bg-teal-500/50'
									: 'hover:bg-zinc-800/50'}"
							>
								Candlestick
							</button>
							<button
								type="button"
								onclick={() => handleChartTypeChange('bar')}
								class="text-white cursor-pointer px-4 py-2 rounded-lg transition-colors {chartType === 'bar'
									? 'bg-teal-500/50'
									: 'hover:bg-zinc-800/50'}"
							>
								Bar Chart
							</button>
						</div>
					</div>
					<div class="flex gap-3 text-white text-sm">
						<button
							type="button"
							onclick={() => handleDateRangeChange('1d')}
							class="cursor-pointer hover:text-teal-300 transition-colors {dateRange === '1d' ? 'text-teal-400' : ''}"
						>
							1 day
						</button>
						<button
							type="button"
							onclick={() => handleDateRangeChange('7d')}
							class="cursor-pointer hover:text-teal-300 transition-colors {dateRange === '7d' ? 'text-teal-400' : ''}"
						>
							7 days
						</button>
						<button
							type="button"
							onclick={() => handleDateRangeChange('1m')}
							class="cursor-pointer hover:text-teal-300 transition-colors {dateRange === '1m' ? 'text-teal-400' : ''}"
						>
							1 month
						</button>
						<button
							type="button"
							onclick={() => handleDateRangeChange('3m')}
							class="cursor-pointer hover:text-teal-300 transition-colors {dateRange === '3m' ? 'text-teal-400' : ''}"
						>
							3 months
						</button>
						<button
							type="button"
							onclick={() => handleDateRangeChange('1y')}
							class="cursor-pointer hover:text-teal-300 transition-colors {dateRange === '1y' ? 'text-teal-400' : ''}"
						>
							1 year
						</button>
					</div>
				</div>
				<div class="z-40 p-8 border-2 rounded-lg border-teal-400/20 w-full h-[300px] bg-zinc-900/20 relative">
					{#if isLoading}
						<div class="flex items-center justify-center h-full">
							<div class="text-teal-400">Loading chart data...</div>
						</div>
					{:else if stockData && stockData.length > 0}
						{@const yDomain = getYDomain()}
						{@const chartData = stockData}
						<!-- Debug: {JSON.stringify({ dataLength: chartData.length, firstPoint: chartData[0], yDomain })} -->
						<AreaChart
							data={chartData}
							x="date"
							y="price"
							yDomain={[yDomain.min, yDomain.max]}
							tooltip={{ mode: 'bisect-x' }}
						>
							<Svg>
								<Axis class="fill-white" placement="left" grid rule></Axis>
								<Axis
									class="fill-white"
									placement="bottom"
									format={(d) => dayjs(d).format('DD MMM YY')}
									rule
								></Axis>
								<Spline class="stroke-2 stroke-teal-500"></Spline>
								<Highlight points lines></Highlight>
							</Svg>
							<Tooltip.Root>
								{@const point = chartData && chartData.length > 0 ? chartData[0] : null}
								{#if point}
									<Tooltip.Header>
										{dayjs(point.date).format('DD MMM YY')}
									</Tooltip.Header>
									<Tooltip.List>
										<Tooltip.Item label="Price" value={point.price}></Tooltip.Item>
									</Tooltip.List>
								{/if}
							</Tooltip.Root>
						</AreaChart>
					{:else}
						<div class="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
							<div>No chart data available</div>
							<div class="text-xs">Data: {JSON.stringify({ hasData: initialPriceChart.length > 0, dataLength: initialPriceChart.length })}</div>
						</div>
					{/if}
				</div>
			</div>
			
			<!-- Analysis Section -->
			<div class="mt-8 pt-8 border-t border-teal-400/20">
				<h2 class="text-white text-2xl font-bold mb-4">Stock Analysis</h2>
				<div class="flex flex-col gap-4">
					<div class="flex gap-3 items-end">
						<div class="flex flex-col gap-1">
							<label class="text-sm text-white font-medium" for="analysis-symbol">Analyze Symbol</label>
							<input
								id="analysis-symbol"
								bind:value={symbol}
								type="text"
								placeholder="Enter stock symbol (e.g., AAPL)"
								class="w-48 h-10 bg-white rounded-md p-2 text-gray-900"
								disabled={isAnalyzing}
								onkeydown={(e) => e.key === 'Enter' && handleAnalyze()}
							/>
						</div>
						<button
							onclick={handleAnalyze}
							disabled={isAnalyzing || !symbol.trim()}
							class="bg-teal-400 hover:bg-teal-500 text-gray-900 hover:text-white px-6 py-2 rounded-md h-10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							{isAnalyzing ? 'Analyzing...' : 'Generate Report'}
						</button>
					</div>

					{#if isAnalyzing}
						<div class="flex flex-col gap-4 bg-gray-50/10 w-full rounded-md items-center justify-center p-8 min-h-[200px]">
							<div class="text-teal-400 text-lg">Analyzing {symbol.toUpperCase()}...</div>
						</div>
					{:else if error}
						<div class="flex flex-col gap-4 bg-gray-50/10 w-full rounded-md items-center justify-center p-8 min-h-[200px]">
							<p class="text-red-400 text-lg">Error: {error}</p>
						</div>
					{:else if result}
						<div class="w-full">
							<h3 class="text-white text-xl font-bold mb-4">Analysis Report</h3>
							<ReportDisplay
								{layer1Data}
								{layer2Reasoning}
								{layer3Rebuttals}
								{decision}
							/>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	:global(body) {
		background: linear-gradient(to bottom, rgb(39 39 42), rgb(24 24 27));
		color: #e2e8f0;
	}
</style>
