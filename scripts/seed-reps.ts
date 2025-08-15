import dotenv from 'dotenv'
import mongoose, { Types } from 'mongoose'
import Rep from '../server/src/models/Rep'

dotenv.config()

async function seed(tenantId: string) {
  const id = new Types.ObjectId(tenantId)
  const reps = ['rep1@example.com', 'rep2@example.com']

  await Rep.deleteMany({ tenantId: id })
  await Rep.insertMany(reps.map(email => ({ tenantId: id, email })))
  console.log('Reps seeded')
}

async function run() {
  const [, , tenantId] = process.argv
  if (!tenantId) {
    console.error('Usage: tsx scripts/seed-reps.ts <tenantId>')
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
