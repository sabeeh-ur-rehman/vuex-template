import mongoose from 'mongoose';

interface CounterDoc {
  tenantCode: string;
  key: string;
  value: number;
}

/**
 * Generates next job number for tenant in format TENANTCODE-YYYYMM-SEQ
 */
export async function nextJobNo(tenantCode: string): Promise<string> {
  const Counters = mongoose.connection.collection<CounterDoc>('counters');
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');

  const res = await Counters.findOneAndUpdate(
    { tenantCode, key: 'jobNo' },
    { $inc: { value: 1 } },
    { upsert: true, returnDocument: 'after' }
  );

  const seq = res.value?.value || 1;
  return `${tenantCode}-${year}${month}-${seq}`;
}
