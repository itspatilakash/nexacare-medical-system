import 'dotenv/config';
import { seedDummyData } from './seed-data';

seedDummyData().then(() => {
  console.log('✅ Seed complete');
  process.exit(0);
}).catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
