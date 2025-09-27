import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { count, sql } from "drizzle-orm";
import { 
  users, hospitals, doctors, patients, labs, receptionists, 
  appointments, prescriptions, labReports, otpVerifications, 
  notifications, states, cities 
} from "../shared/schema";

// Create database connection
const connectionString = process.env.DATABASE_URL!;
const sql = postgres(connectionString);
const db = drizzle(sql);

async function checkDatabaseStatus() {
  try {
    console.log('📊 Checking database status...\n');
    
    // Check counts for all tables
    const tables = [
      { name: 'states', table: states },
      { name: 'cities', table: cities },
      { name: 'users', table: users },
      { name: 'hospitals', table: hospitals },
      { name: 'doctors', table: doctors },
      { name: 'patients', table: patients },
      { name: 'labs', table: labs },
      { name: 'receptionists', table: receptionists },
      { name: 'appointments', table: appointments },
      { name: 'prescriptions', table: prescriptions },
      { name: 'lab_reports', table: labReports },
      { name: 'otp_verifications', table: otpVerifications },
      { name: 'notifications', table: notifications },
    ];
    
    for (const { name, table } of tables) {
      try {
        const [result] = await db.select({ count: count() }).from(table);
        const count = result.count;
        const status = count > 0 ? '✅' : '❌';
        console.log(`${status} ${name}: ${count} records`);
      } catch (error) {
        console.log(`❌ ${name}: Error - ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    console.log('\n📋 Summary:');
    console.log('✅ = Table has data');
    console.log('❌ = Table is empty or has errors');
    
  } catch (error) {
    console.error('❌ Error checking database status:', error);
    throw error;
  } finally {
    await sql.end();
  }
}

// Run the check
checkDatabaseStatus()
  .then(() => {
    console.log('\n🎉 Database status check completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Database status check failed:', error);
    process.exit(1);
  });
