<script lang="ts">
	import '../app.css';
	import Navigation from '$lib/components/ui/Navigation.svelte';
	let { children } = $props();
</script>

<div class="w-full h-screen max-h-screen max-w-screen">
	<div
		class="bg w-full h-[90%] bg-linear-to-b from-zinc-800 to-zinc-900 relative flex justify-center items-center z-0"
	>
		{@render children()}
	</div>
	<div class="bg w-full h-[10%] bg-linear-to-b from-zinc-800 to-zinc-900 relative">
		<Navigation />
	</div>
</div>

<style>
	.bg::after {
		content: '';
		position: absolute;
		pointer-events: none;
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
