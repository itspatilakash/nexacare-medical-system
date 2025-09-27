import { Router } from 'express';
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, and, ilike, sql } from "drizzle-orm";
import { cities, states } from "../../shared/schema";

const router = Router();

// Create database connection
const connectionString = process.env.DATABASE_URL!;
const sql = postgres(connectionString);
const db = drizzle(sql);

// Get all states
router.get('/states', async (req, res) => {
  try {
    console.log('🏛️ Fetching all states...');
    
    const allStates = await db
      .select({
        id: states.id,
        name: states.name,
        country: states.country,
        iso2: states.iso2,
      })
      .from(states)
      .orderBy(states.name);
    
    console.log(`✅ Found ${allStates.length} states`);
    res.json({
      success: true,
      data: allStates,
      count: allStates.length
    });
  } catch (error) {
    console.error('❌ Error fetching states:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch states',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get cities by state ID
router.get('/states/:stateId/cities', async (req, res) => {
  try {
    const { stateId } = req.params;
    console.log(`🏙️ Fetching cities for state ID: ${stateId}`);
    
    if (!stateId || isNaN(Number(stateId))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid state ID'
      });
    }
    
    const stateCities = await db
      .select({
        id: cities.id,
        name: cities.name,
        stateId: cities.stateId,
        latitude: cities.latitude,
        longitude: cities.longitude,
      })
      .from(cities)
      .where(eq(cities.stateId, Number(stateId)))
      .orderBy(cities.name);
    
    console.log(`✅ Found ${stateCities.length} cities for state ID: ${stateId}`);
    res.json({
      success: true,
      data: stateCities,
      count: stateCities.length
    });
  } catch (error) {
    console.error('❌ Error fetching cities by state:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cities',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get cities by state name
router.get('/states/:stateName/cities', async (req, res) => {
  try {
    const { stateName } = req.params;
    console.log(`🏙️ Fetching cities for state: ${stateName}`);
    
    if (!stateName) {
      return res.status(400).json({
        success: false,
        message: 'State name is required'
      });
    }
    
    const stateCities = await db
      .select({
        id: cities.id,
        name: cities.name,
        stateId: cities.stateId,
        latitude: cities.latitude,
        longitude: cities.longitude,
        stateName: states.name,
      })
      .from(cities)
      .innerJoin(states, eq(cities.stateId, states.id))
      .where(ilike(states.name, `%${stateName}%`))
      .orderBy(cities.name);
    
    console.log(`✅ Found ${stateCities.length} cities for state: ${stateName}`);
    res.json({
      success: true,
      data: stateCities,
      count: stateCities.length
    });
  } catch (error) {
    console.error('❌ Error fetching cities by state name:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cities',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Search cities
router.get('/cities/search', async (req, res) => {
  try {
    const { q, stateId } = req.query;
    console.log(`🔍 Searching cities with query: ${q}, stateId: ${stateId}`);
    
    if (!q || typeof q !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }
    
    let query = db
      .select({
        id: cities.id,
        name: cities.name,
        stateId: cities.stateId,
        latitude: cities.latitude,
        longitude: cities.longitude,
        stateName: states.name,
      })
      .from(cities)
      .innerJoin(states, eq(cities.stateId, states.id))
      .where(ilike(cities.name, `%${q}%`))
      .orderBy(cities.name)
      .limit(50);
    
    // Filter by state if provided
    if (stateId && !isNaN(Number(stateId))) {
      query = query.where(
        and(
          ilike(cities.name, `%${q}%`),
          eq(cities.stateId, Number(stateId))
        )
      );
    }
    
    const searchResults = await query;
    
    console.log(`✅ Found ${searchResults.length} cities matching "${q}"`);
    res.json({
      success: true,
      data: searchResults,
      count: searchResults.length,
      query: q,
      stateId: stateId || null
    });
  } catch (error) {
    console.error('❌ Error searching cities:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search cities',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get all cities (paginated)
router.get('/cities', async (req, res) => {
  try {
    const { page = '1', limit = '100', stateId } = req.query;
    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string)));
    const offset = (pageNum - 1) * limitNum;
    
    console.log(`🏙️ Fetching cities - page: ${pageNum}, limit: ${limitNum}, stateId: ${stateId}`);
    
    let query = db
      .select({
        id: cities.id,
        name: cities.name,
        stateId: cities.stateId,
        latitude: cities.latitude,
        longitude: cities.longitude,
        stateName: states.name,
      })
      .from(cities)
      .innerJoin(states, eq(cities.stateId, states.id))
      .orderBy(cities.name)
      .limit(limitNum)
      .offset(offset);
    
    // Filter by state if provided
    if (stateId && !isNaN(Number(stateId))) {
      query = query.where(eq(cities.stateId, Number(stateId)));
    }
    
    const citiesData = await query;
    
    // Get total count
    let countQuery = db
      .select({ count: sql`count(*)` })
      .from(cities);
    
    if (stateId && !isNaN(Number(stateId))) {
      countQuery = countQuery.where(eq(cities.stateId, Number(stateId)));
    }
    
    const [{ count: totalCount }] = await countQuery;
    
    console.log(`✅ Found ${citiesData.length} cities (total: ${totalCount})`);
    res.json({
      success: true,
      data: citiesData,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: Number(totalCount),
        pages: Math.ceil(Number(totalCount) / limitNum)
      }
    });
  } catch (error) {
    console.error('❌ Error fetching cities:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cities',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get city by ID
router.get('/cities/:cityId', async (req, res) => {
  try {
    const { cityId } = req.params;
    console.log(`🏙️ Fetching city ID: ${cityId}`);
    
    if (!cityId || isNaN(Number(cityId))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid city ID'
      });
    }
    
    const cityData = await db
      .select({
        id: cities.id,
        name: cities.name,
        stateId: cities.stateId,
        latitude: cities.latitude,
        longitude: cities.longitude,
        stateName: states.name,
        stateCountry: states.country,
        stateIso2: states.iso2,
      })
      .from(cities)
      .innerJoin(states, eq(cities.stateId, states.id))
      .where(eq(cities.id, Number(cityId)))
      .limit(1);
    
    if (cityData.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'City not found'
      });
    }
    
    console.log(`✅ Found city: ${cityData[0].name}, ${cityData[0].stateName}`);
    res.json({
      success: true,
      data: cityData[0]
    });
  } catch (error) {
    console.error('❌ Error fetching city:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch city',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
