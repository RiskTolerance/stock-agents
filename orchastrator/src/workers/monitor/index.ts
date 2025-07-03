async function main() {
	while (true) {
		console.log('hello from worker process');
		await new Promise((resolve) => setTimeout(resolve, 3000));
	}
}

main();
