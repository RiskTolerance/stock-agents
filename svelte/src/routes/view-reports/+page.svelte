<script lang="ts">
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	const reports = [
		{
			id: 1,
			title: 'Report 1',
			description: 'This is the first report'
		},
		{
			id: 2,
			title: 'Report 2',
			description: 'This is the second report'
		}
	];
</script>

<div class="flex flex-col justify-start items-center gap-12 h-4/5 w-4/5">
	<h1 class="text-white text-4xl font-bold">All Reports</h1>
	<div class="flex flex-col w-full items-center gap-4">
		{#each reports as report}
			<a class="w-full max-w-prose" href={`/view-reports/${report.id}`}>
				<div
					class="flex justify-between items-center gap-2 p-6 bg-zinc-900/40 hover:bg-zinc-900/70 transition-all duration-300 shadow-2xl shadow-zinc-950/70 w-full rounded-lg text-lg text-white border-2 border-zinc-950/70"
				>
					<div class="flex flex-col justify-start items-start gap-2">
						<h2 class="text-2xl font-bold">{report.title}</h2>
						<p>{report.description}</p>
					</div>
					<ArrowRight class="w-6 h-6" />
				</div>
			</a>
		{/each}
	</div>
</div>
