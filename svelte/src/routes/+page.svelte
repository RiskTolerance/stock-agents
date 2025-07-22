<script lang="ts">
	import Banknote from '@lucide/svelte/icons/banknote';
	import { Toggle } from '$lib/components/ui/toggle/index.js';
	let { data } = $props();

	let stockData: any = $state(null);

	$effect(() => {
		stockData = data.priceChart;
	});

	let symbol = $state('AAPL');
	import { AreaChart, Axis, Spline, Svg, Tooltip, Highlight } from 'layerchart';
	import dayjs from 'dayjs';

	const search = async () => {
		// const data = await getLightChart(symbol);
		console.log(data);
	};

	const getYDomain: () => { min: number; max: number } = () => {
		const priceArray = data.priceChart.map((d) => d.price);
		const min = Math.min(...priceArray) - 5;
		const max = Math.max(...priceArray) + 5;
		return {
			min,
			max
		};
	};
</script>

<div class="w-full h-screen">
	<div
		class="bg w-full h-4/5 bg-linear-to-b from-zinc-800 to-zinc-900 relative flex justify-center items-center z-0"
	>
		<div class="absolute top-0 left-0 w-full h-full flex justify-center items-center">
			<div
				class="flex w-4/5 h-4/5 bg-zinc-900/40 shadow-2xl shadow-zinc-950/70 rounded-lg flex-col justify-start z-20 p-8"
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
									<label class="text-[10px] text-white font-medium" for="symbol"
										>Ticker Symbol</label
									>
									<input
										id="symbol"
										class="w-24 h-10 bg-white rounded-md p-2"
										type="text"
										bind:value={symbol}
									/>
								</div>
								<button
									onclick={() => console.log(symbol)}
									class=" hover:bg-gray-50 text-white hover:text-teal-900 px-4 py-2 rounded-md h-10 cursor-pointer flex gap-2 group transition-colors duration-400"
									>Search <Banknote
										class="h-full aspect-square stroke-teal-400 transition-colors duration-400 group-hover:stroke-teal-900"
									/></button
								>
							</div>
							<div>
								<table>
									<tbody>
										<tr class="flex gap-3">
											<td>
												<Toggle
													size="sm"
													variant="default"
													class="text-white cursor-pointer px-4 py-2 rounded-lg">Line Chart</Toggle
												>
											</td>
											<td>
												<Toggle
													size="sm"
													variant="default"
													class="text-white cursor-pointer px-4 py-2 rounded-lg">Candlestick</Toggle
												>
											</td>
											<td>
												<Toggle
													size="sm"
													variant="default"
													class="text-white cursor-pointer px-4 py-2 rounded-lg">Bar Chart</Toggle
												>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
							<table class="text-white text-sm">
								<tbody>
									<tr class="flex gap-3">
										<td
											class="cursor-pointer hover:text-teal-300"
											onclick={() => console.log('1 day')}>1 day</td
										>
										<td
											class="cursor-pointer hover:text-teal-300"
											onclick={() => console.log('1 week')}>7 days</td
										>
										<td
											class="cursor-pointer hover:text-teal-300"
											onclick={() => console.log('1 month')}>1 month</td
										>
										<td class="cursor-pointer hover:text-teal-300">3 months</td>
										<td
											class="cursor-pointer hover:text-teal-300"
											onclick={() => console.log('1 year')}>1 year</td
										>
									</tr>
								</tbody>
							</table>
						</div>
						<div class="z-40 p-8 border-2 rounded-lg border-teal-400/20 w-full h-[300px]">
							<AreaChart
								data={stockData}
								x="date"
								y="price"
								yDomain={[getYDomain().min, getYDomain().max]}
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
									{@const data = stockData[0]}
									<Tooltip.Header>
										{dayjs(data.date).format('DD MMM YY')}
									</Tooltip.Header>
									<Tooltip.List>
										<Tooltip.Item label="value" value={data.price}></Tooltip.Item>
									</Tooltip.List>
								</Tooltip.Root>
							</AreaChart>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="bg w-full h-1/5 bg-linear-to-b from-zinc-800 to-zinc-900 relative z-0"></div>
</div>

{#if data}
	<pre>{JSON.stringify(data, null, 2)}</pre>
{/if}

<style>
	.bg::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-repeat: repeat;
		background-size: 500px 500px;
		opacity: 0.3;
		background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.dev/svgjs" viewBox="0 0 700 700" width="700" height="700"><defs><filter id="nnnoise-filter" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" color-interpolation-filters="linearRGB"><feTurbulence type="fractalNoise" baseFrequency="0.102" numOctaves="4" seed="15" stitchTiles="stitch" x="0%" y="0%" width="100%" height="100%" result="turbulence"></feTurbulence><feSpecularLighting surfaceScale="15" specularConstant="0.75" specularExponent="20" lighting-color="%237957A8" x="0%" y="0%" width="100%" height="100%" in="turbulence" result="specularLighting"><feDistantLight azimuth="3" elevation="100"></feDistantLight></feSpecularLighting><feColorMatrix type="saturate" values="0" x="0%" y="0%" width="100%" height="100%" in="specularLighting" result="colormatrix"></feColorMatrix></filter></defs><rect width="700" height="700" fill="transparent"></rect><rect width="100%" height="100%" fill="%237957a8" filter="url(%23nnnoise-filter)"></rect></svg>');
	}
</style>
