<script lang="ts">
	let { data } = $props();
	let symbol = $state('AAPL');
	import { AreaChart } from 'layerchart';
</script>

<div class="w-full h-screen">
	<div
		class="bg w-full h-4/5 bg-linear-to-b from-zinc-800 to-zinc-900 relative flex justify-center items-center z-0"
	>
		<div class="absolute top-0 left-0 w-full h-full flex justify-center items-center">
			<div
				class="flex w-4/5 h-4/5 bg-zinc-900/40 rounded-lg flex-col items-center justify-center z-20"
			>
				<div class="z-20 text-3xl text-white font-bold p-8">
					<h1>Hello</h1>
					<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
				</div>
				<div
					style="height: 200px; width: 80%;"
					class="z-40 p-4 border-2 rounded-lg border-teal-400"
				>
					<AreaChart data={data.priceChart} x="date" y="price"></AreaChart>
				</div>
			</div>
		</div>
	</div>

	<div class="bg w-full h-1/5 bg-linear-to-b from-zinc-700 to-zinc-800 relative z-0"></div>
</div>

<!-- <div class="p-8 bg-slate-900 w-fit grid grid-cols-2 gap-4">
	<div class="flex flex-col gap-1">
		<label class="text-xs font-medium" for="symbol">Ticker Symbol</label>
		<input id="symbol" class="w-24 bg-white rounded-md p-2" type="text" bind:value={symbol} />
	</div>
</div> -->

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
