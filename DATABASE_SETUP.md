# Neon Database Setup - PostgreSQL 15

## Step 1: Create Neon Account
1. Go to https://neon.tech
2. Sign up with GitHub/Google
3. Create new project: 'nexacare-medical'
4. **Choose PostgreSQL 15** (recommended version)

## Step 2: Get Connection String
1. Copy the connection string from Neon dashboard
2. It looks like: postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require

## Step 3: Update .env file
Replace the DATABASE_URL in .env with your Neon connection string

## Step 4: Run migrations
npm run db:push

## Step 5: Seed database
npm run seed

## Step 6: Test the system
npm run dev

## Why PostgreSQL 15?
- Most stable and widely supported version
- Compatible with Drizzle ORM
- Good performance and features
- Default version on Neon (free tier)
