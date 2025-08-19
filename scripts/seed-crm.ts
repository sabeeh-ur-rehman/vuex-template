import mongoose from 'mongoose';
import dotenv from 'dotenv';
import StandardStep from '../src/server/db/models/StandardStep';
import User from '../src/server/db/models/User';

dotenv.config();

async function run() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/test';
  await mongoose.connect(uri);

  const tenantId = new mongoose.Types.ObjectId();

  const steps = Array.from({ length: 26 }, (_, i) => {
    const stepNo = (i + 1) * 100;
    return {
      tenantId,
      stepNo,
      description: `Step ${stepNo}`,
      hasAppointment: false,
      reminderHours1: 24,
      reminderHours2: 0,
      reminderHours3: -24
    };
  });
  for (const step of steps) {
    await StandardStep.updateOne({ tenantId, stepNo: step.stepNo }, { $set: step }, { upsert: true });
  }

  await User.updateOne({ email: 'rep@example.com' }, {
    $setOnInsert: {
      email: 'rep@example.com',
      password: 'changeme',
      role: 'rep',
      tenantId
    }
  }, { upsert: true });

  await mongoose.disconnect();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
