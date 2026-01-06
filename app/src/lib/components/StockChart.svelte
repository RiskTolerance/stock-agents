<script lang="ts">
	import { AreaChart, Axis, Spline, Svg, Tooltip, Highlight } from 'layerchart';
	import dayjs from 'dayjs';
	import { getChartData } from '../../routes/data.remote';

	interface Props {
		symbol: string;
		initialData?: { date: Date; price: number }[];
	}

	let { symbol, initialData = [] }: Props = $props();

	let chartType = $state<'line' | 'candlestick' | 'bar'>('line');
	let dateRange = $state<'1d' | '7d' | '1m' | '3m' | '1y'>('3m');
	let stockData = $state<{ date: Date; price: number }[]>([]);
	let isLoading = $state(false);
	let lastFetchedSymbol = $state('');

	// Initialize from initialData on mount
	$effect(() => {
		if (initialData.length > 0 && stockData.length === 0) {
			stockData = [...initialData];
		}
	});

	// Fetch data when symbol changes (not on initial mount if we have initialData)
	$effect(() => {
		const sym = symbol.trim().toUpperCase();
		// Skip if no symbol, already loading, or same symbol already fetched
		if (!sym || isLoading || sym === lastFetchedSymbol) {
			return;
		}
		fetchChartData(symbol, dateRange);
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
		const normalizedSymbol = sym.trim().toUpperCase();
		if (!normalizedSymbol) return;
		
		isLoading = true;
		lastFetchedSymbol = normalizedSymbol;
		
		try {
			const days = getDaysForRange(range);
			const result = await getChartData({ symbol: sym, days });
			if (result && result.priceChart && result.priceChart.length > 0) {
				stockData = [...result.priceChart];
			} else {
				console.warn('No chart data returned');
			}
		} catch (error) {
			console.error('Error fetching chart data:', error);
			// Reset so user can retry
			lastFetchedSymbol = '';
		} finally {
			isLoading = false;
		}
	};

	const handleDateRangeChange = (range: typeof dateRange) => {
		dateRange = range;
		// Reset lastFetchedSymbol to allow refetch with new range
		lastFetchedSymbol = '';
		if (symbol.trim()) {
			fetchChartData(symbol, range);
		}
	};

	const handleChartTypeChange = (type: typeof chartType) => {
		chartType = type;
		// Chart type switching would require different chart components
		// For now, we'll just use AreaChart
	};
</script>

<div>
	<div class="flex justify-between items-end mb-2">
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
			</div>
		{/if}
	</div>
</div>

