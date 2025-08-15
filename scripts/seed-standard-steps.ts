import dotenv from 'dotenv'
import mongoose, { Types } from 'mongoose'
import StandardStep from '../server/src/models/StandardStep'

dotenv.config()

async function seed(tenantId: string) {
  const id = new Types.ObjectId(tenantId)
  const steps = ['Pre-Construction', 'Construction', 'Post-Construction']

  await StandardStep.deleteMany({ tenantId: id })
  await StandardStep.insertMany(steps.map(name => ({ tenantId: id, name })))
  console.log('Standard steps seeded')
}

async function run() {
  const [, , tenantId] = process.argv
  if (!tenantId) {
    console.error('Usage: tsx scripts/seed-standard-steps.ts <tenantId>')
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
