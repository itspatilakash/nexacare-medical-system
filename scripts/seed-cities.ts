import bcrypt from "bcrypt";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { cities, states } from "../shared/schema";
import fs from 'fs';

// Create database connection
const connectionString = process.env.DATABASE_URL!;
const sql = postgres(connectionString);
const db = drizzle(sql);

// Function to parse CSV data
function parseCSV(csvContent: string) {
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',');
  const data = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim()) {
      const values = lines[i].split(',');
      const row: any = {};
      headers.forEach((header, index) => {
        row[header.trim()] = values[index]?.trim();
      });
      data.push(row);
    }
  }
  
  return data;
}

async function seedCitiesAndStates() {
  try {
    console.log('🌍 Starting cities and states seeding...');
    
    // Read the CSV file
    const csvPath = '/Users/akashpatil/Downloads/Indian Cities Database.csv';
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const citiesData = parseCSV(csvContent);
    
    console.log(`📊 Found ${citiesData.length} cities in CSV`);
    
    // Extract unique states
    const uniqueStates = new Map();
    citiesData.forEach((city: any) => {
      if (city.State && city.State.trim()) {
        uniqueStates.set(city.State.trim(), {
          name: city.State.trim(),
          country: city.country || 'India',
          iso2: city.iso2 || 'IN'
        });
      }
    });
    
    console.log(`🏛️ Found ${uniqueStates.size} unique states`);
    
    // Insert states first
    const stateMap = new Map();
    for (const stateData of uniqueStates.values()) {
      try {
        const [insertedState] = await db.insert(states).values(stateData).returning();
        stateMap.set(stateData.name, insertedState.id);
        console.log(`✅ Inserted state: ${stateData.name} (ID: ${insertedState.id})`);
      } catch (error) {
        console.log(`⚠️ State ${stateData.name} might already exist, checking...`);
        // Try to find existing state
        const existingState = await db.select().from(states).where(eq(states.name, stateData.name)).limit(1);
        if (existingState[0]) {
          stateMap.set(stateData.name, existingState[0].id);
          console.log(`✅ Found existing state: ${stateData.name} (ID: ${existingState[0].id})`);
        }
      }
    }
    
    // Insert cities
    let insertedCities = 0;
    let skippedCities = 0;
    
    for (const cityData of citiesData) {
      if (!cityData.City || !cityData.State) continue;
      
      const stateId = stateMap.get(cityData.State.trim());
      if (!stateId) {
        console.log(`⚠️ State not found for city: ${cityData.City}`);
        continue;
      }
      
      try {
        const cityInsertData = {
          name: cityData.City.trim(),
          stateId: stateId,
          latitude: cityData.Lat ? cityData.Lat.trim() : null,
          longitude: cityData.Long ? cityData.Long.trim() : null,
        };
        
        await db.insert(cities).values(cityInsertData);
        insertedCities++;
        
        if (insertedCities % 100 === 0) {
          console.log(`📍 Inserted ${insertedCities} cities...`);
        }
      } catch (error) {
        skippedCities++;
        if (skippedCities % 500 === 0) {
          console.log(`⚠️ Skipped ${skippedCities} duplicate cities...`);
        }
      }
    }
    
    console.log(`✅ Cities seeding completed!`);
    console.log(`📍 Inserted: ${insertedCities} cities`);
    console.log(`⚠️ Skipped: ${skippedCities} duplicate cities`);
    console.log(`🏛️ States: ${uniqueStates.size} states`);
    
  } catch (error) {
    console.error('❌ Error seeding cities:', error);
    throw error;
  } finally {
    await sql.end();
  }
}

// Run the seeding
seedCitiesAndStates()
  .then(() => {
    console.log('🎉 Cities and states seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Cities and states seeding failed:', error);
    process.exit(1);
  });
