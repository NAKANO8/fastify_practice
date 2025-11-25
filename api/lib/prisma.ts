import "dotenv/config"
import { PrismaClient } from '@prisma/client'
import { Pool } from "pg"
import { PrismaPg } from '@prisma/adapter-pg'

// Create a pg Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

// Pass Pool into PrismaPg adapter
const adapter = new PrismaPg(pool)

// Create Prisma Client with adapter
export const prisma = new PrismaClient({ adapter })

