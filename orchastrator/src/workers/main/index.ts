import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import { jobQueue_type_monitor } from '../../db/schemas/extends';
import { eq } from 'drizzle-orm';

// const client = new Client({
// 	host: process.env.DB_HOST,
// 	port: Number(process.env.DB_PORT) ?? 5432,
// 	user: process.env.DB_USER,
// 	password: process.env.DB_PASSWORD,
// 	database: process.env.DB_NAME,
// });
// client.connect();
// const db = drizzle(client);

async function main() {
	console.log('Starting monitor');
	while (true) {
		// const jobs = await db
		// 	.select()
		// 	.from(jobQueue_type_monitor)
		// 	.where(eq(jobQueue_type_monitor.status, 'pending'));
		console.log('hello from main worker');
		await new Promise((resolve) => setTimeout(resolve, 3000));
	}
}
main();
