import dotenv from 'dotenv'
import mongoose, { Types } from 'mongoose'
import SummerTime from '../server/src/models/SummerTime'

dotenv.config()

async function seed(tenantId: string) {
  const id = new Types.ObjectId(tenantId)
  const years = [2024, 2025]

  await SummerTime.deleteMany({ tenantId: id })
  await SummerTime.insertMany(years.map(year => ({ tenantId: id, year })))
  console.log('Summer times seeded')
}

async function run() {
  const [, , tenantId] = process.argv
  if (!tenantId) {
    console.error('Usage: tsx scripts/seed-summer-times.ts <tenantId>')
    process.exit(1)
  }

  const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/test'
  await mongoose.connect(mongoUrl)
  await seed(tenantId)
  await mongoose.disconnect()
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
