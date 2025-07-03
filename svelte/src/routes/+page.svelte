<script lang="ts">
	// import dayjs from 'dayjs';

	import { AreaChart } from 'layerchart';
	import { curveLinear } from 'd3-shape';
	import { scaleUtc, scaleTime, scaleLog, scaleLinear } from 'd3-scale';
	import * as Chart from '$lib/components/ui/chart';

	let { data } = $props();
	let symbol = $state('AAPL');

	const chartConfig = {
		price: {
			label: 'Price',
			color: 'rgb(78, 197, 241)'
		}
	} satisfies Chart.ChartConfig;
</script>

{#if data}
	<pre>{JSON.stringify(data, null, 2)}</pre>
{/if}

<div class="p-8 bg-slate-900 w-fit grid grid-cols-2 gap-4">
	<div class="flex flex-col gap-1">
		<label class="text-xs font-medium" for="symbol">Ticker Symbol</label>
		<input id="symbol" class="w-24 bg-white rounded-md p-2" type="text" bind:value={symbol} />
	</div>
	<div class="w-[800px]">
		<Chart.Container config={chartConfig}>
			<AreaChart
				data={data.priceChart}
				x="date"
				xScale={scaleTime()}
				yScale={scaleLinear()}
				series={[{ key: 'price', label: 'Price', color: chartConfig.price.color }]}
				axis="x"
				props={{
					area: {
						curve: curveLinear,
						'fill-opacity': 0.5,
						line: { class: 'stroke-1' },
						motion: 'tween'
					},
					xAxis: {
						format: (v: Date) => v.toLocaleDateString('en-US', { month: 'short' })
					}
				}}
				y="price"
			>
				{#snippet tooltip()}
					<Chart.Tooltip
						labelFormatter={(v: Date) => v.toLocaleDateString('en-US', { month: 'long' })}
						indicator="line"
					/>
				{/snippet}
			</AreaChart>
		</Chart.Container>
	</div>
</div>
