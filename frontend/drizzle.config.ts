import {defineConfig} from 'drizzle-kit'
import {resolve} from 'path'
import dotenv from 'dotenv'

dotenv.config({path: resolve(__dirname, '.env.local')})

export default defineConfig({
  out: './drizzle',
  schema: './db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
