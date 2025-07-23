<script lang="ts">
	import { Button } from 'bits-ui';
	import type { ReportRoot } from '$lib/reports';
	let inputVal: string | null = $state(null);
	let report: ReportRoot | null = $state(null);
	let isLoading: boolean = $state(false);
	let error: boolean = $state(false);
	import { marked } from 'marked';
	const queryMastra = async () => {
		try {
			error = false;
			isLoading = true;
			const res = await fetch(`/api/mastra?symbol=${inputVal}`);
			console.log(res);
			report = JSON.parse(await res.text());
			console.log(report);
		} catch (e) {
			error = true;
			console.error(e);
		} finally {
			isLoading = false;
		}
	};

	const placeholderReportText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit. A id nemo nesciunt officiis quidem reprehenderit sed. Architecto consectetur dignissimos illum iste quasi. Accusantium architecto blanditiis, consequatur dolorem dolores ducimus ea eaque eos excepturi exercitationem expedita facere fugit id necessitatibus neque nesciunt nisi, non nulla obcaecati officia ut velit, vero voluptatibus? Id iure libero maiores non obcaecati, placeat quidem sint soluta!
`;
</script>

<div class="flex flex-col justify-start items-center gap-6 h-4/5 w-4/5">
	<h1 class="text-white text-4xl font-bold">Generate Report</h1>
	<p class="text-white text-lg">Enter a ticker symbol to generate a report.</p>
	<div class="flex flex-col w-full items-center gap-4">
		<input bind:value={inputVal} type="text" class="w-full max-w-40 p-2 rounded-lg" />
		<Button.Root
			onclick={queryMastra}
			class="bg-teal-300 px-4 py-2 rounded-lg w-40 text-gray-600 cursor-pointer"
			>Generate Report</Button.Root
		>
	</div>
	<div class="flex w-full justify-start">
		<h2 class="text-white text-3xl font-bold">Report</h2>
	</div>
	<div class="flex flex-col gap-4 bg-gray-50/10 w-full h-3/4 max-h-[3/4] rounded-md">
		{#if isLoading}
			<div></div>
			<p class="text-green-400 text-lg col-span-2 text-center">Loading...</p>
			<div></div>
		{:else if error}
			<div></div>
			<p class="text-red-400 text-lg col-span-2 text-center">Error</p>
			<div></div>
		{/if}

		{#snippet resultCard(title: string, text: string, colspan: number)}
			<div
				style="grid-column: span {colspan} / span {colspan};"
				class="result-card overflow-clip bg-gray-50 rounded-md w-full h-[200px]"
			>
				<div class="w-full h-full overflow-y-scroll p-4">
					<h3 class="text-xl font-bold mb-2">
						{title}
					</h3>
					{#await marked.parse(text)}
						<p>Loading...</p>
					{:then value}
						{@html value}
					{/await}
				</div>
			</div>
		{/snippet}

		{#if report}
			<div class="grid grid-cols-4 gap-4 p-6 overflow-y-scroll h-full py-12">
				{@render resultCard('Analyst', report.result.context.layer1_data.analyst, 1)}

				{@render resultCard('Balance Sheet', report.result.context.layer1_data.balance_sheet, 1)}

				{@render resultCard(
					'Balance Sheet Growth',
					report.result.context.layer1_data.balance_sheet_growth,
					1
				)}

				{@render resultCard('Cash Flow', report.result.context.layer1_data.cash_flow, 1)}

				{@render resultCard(
					'Cash Flow Growth',
					report.result.context.layer1_data.cash_flow_growth,
					1
				)}

				{@render resultCard(
					'Income Statement',
					report.result.context.layer1_data.income_statement,
					1
				)}

				{@render resultCard('Insider', report.result.context.layer1_data.insider, 1)}

				{@render resultCard('Key Metrics', report.result.context.layer1_data.key_metrics, 1)}

				{@render resultCard('News', report.result.context.layer1_data.news, 1)}

				{@render resultCard('Technical', report.result.context.layer1_data.technical, 1)}

				<div></div>
				<div></div>

				{@render resultCard('Bullish', report.result.context.layer2_reasoning.bullish, 2)}

				{@render resultCard('Bearish', report.result.context.layer2_reasoning.bearish, 2)}

				{@render resultCard('Bullish Rebuttal', report.result.context.layer3_rebuttals.bullish, 2)}

				{@render resultCard('Bearish Rebuttal', report.result.context.layer3_rebuttals.bearish, 2)}

				{@render resultCard('Decision', report.result.decision, 4)}
			</div>
		{/if}
	</div>
</div>

<!-- <style>
	@reference 'tailwindcss';
	.result-card {
		@apply ;
	}
</style> -->
