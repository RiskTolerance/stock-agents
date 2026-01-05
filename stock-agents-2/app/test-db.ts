import { db } from './src/lib/server/db/index.js';
import { reports } from './src/lib/server/db/schema.js';
import { desc } from 'drizzle-orm';

async function test() {
  try {
    const allReports = await db.select().from(reports).orderBy(desc(reports.createdAt)).limit(5);
    console.log('✅ Database connection successful!');
    console.log(`Found ${allReports.length} reports`);
    if (allReports.length > 0) {
      console.log('Latest report:', {
        id: allReports[0].id,
        symbol: allReports[0].symbol,
        decision: allReports[0].decision,
        createdAt: allReports[0].createdAt
      });
    }
    process.exit(0);
  } catch (error) {
    console.error('❌ Database error:', error);
    process.exit(1);
  }
}

test();
