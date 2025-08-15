import dotenv from 'dotenv'
import mongoose, { Types } from 'mongoose'
import PriceList from '../server/src/models/PriceList'

dotenv.config()

async function seed(tenantId: string) {
  const id = new Types.ObjectId(tenantId)
  const lists = ['Default', 'Premium']

  await PriceList.deleteMany({ tenantId: id })
  await PriceList.insertMany(lists.map(name => ({ tenantId: id, name })))
  console.log('Price lists seeded')
}

async function run() {
  const [, , tenantId] = process.argv
  if (!tenantId) {
    console.error('Usage: tsx scripts/seed-price-list.ts <tenantId>')
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
