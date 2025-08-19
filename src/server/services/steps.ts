import StandardStep from '../db/models/StandardStep';
import JobStep from '../db/models/JobStep';

interface SeedParams {
  tenantId: string;
  projectId: string;
}

export async function seedJobStepsFromStandard({ tenantId, projectId }: SeedParams): Promise<void> {
  const steps = await StandardStep.find({ tenantId }).sort({ stepNo: 1 }).lean();
  for (const s of steps) {
    await JobStep.updateOne(
      { tenantId, projectId, stepNo: s.stepNo },
      {
        $setOnInsert: {
          description: s.description,
          reminderHours1: s.reminderHours1,
          reminderHours2: s.reminderHours2,
          reminderHours3: s.reminderHours3,
        }
      },
      { upsert: true }
    );
  }
}
