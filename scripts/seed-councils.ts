import dotenv from 'dotenv'
import mongoose, { Types } from 'mongoose'
import Council from '../server/src/models/Council'

dotenv.config()

async function seed(tenantId: string) {
  const id = new Types.ObjectId(tenantId)
  const councils = ['Council A', 'Council B']

  await Council.deleteMany({ tenantId: id })
  await Council.insertMany(councils.map(name => ({ tenantId: id, name })))
  console.log('Councils seeded')
}

async function run() {
  const [, , tenantId] = process.argv
  if (!tenantId) {
    console.error('Usage: tsx scripts/seed-councils.ts <tenantId>')
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
