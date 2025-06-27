<script lang="ts">
	let { data } = $props();
	import { onMount } from 'svelte';
	import Chart, { type ChartItem } from 'chart.js/auto';
	let myChart: HTMLCanvasElement;
	let symbol = $state('AAPL');

	onMount(() => {
		const lineChart = new Chart(myChart, {
			type: 'line',
			data: {
				labels: data.priceChart.map((item) => item.date),
				datasets: [
					{
						label: 'AAPL Price',
						data: data.priceChart.map((item) => item.price)
					}
				]
			},
			options: {
				color: 'rgb(78, 197, 241)',
				borderColor: 'rgba(78, 197, 241, 0.5)',
				backgroundColor: 'rgb(13, 242, 201)',
				scales: {
					x: {
						ticks: {
							color: 'rgba(238, 238, 238, 0.9)'
						},
						grid: {
							color: 'rgba(238, 238, 238, 0.1)'
						}
					},
					y: {
						ticks: {
							color: 'rgba(238, 238, 238, 0.9)'
						},
						grid: {
							color: 'rgba(238, 238, 238, 0.7)'
						}
					}
				},
				plugins: {
					legend: {
						display: true,
						labels: {
							color: 'rgba(238, 238, 238, 0.9)'
						}
					}
				}
			}
		});
	});
</script>

<!-- {#if data}
	<pre>{JSON.stringify(data, null, 2)}</pre>
{/if} -->

<div class="p-8 bg-slate-900 w-fit flex flex-col gap-4">
	<div class="flex flex-col gap-1">
		<label class="text-xs font-medium" for="symbol">Ticker Symbol</label>
		<input id="symbol" class="w-24 bg-white rounded-md p-2" type="text" bind:value={symbol} />
	</div>

	<div class="w-[800px]">
		<canvas bind:this={myChart} id="myChart"></canvas>
	</div>
</div>
