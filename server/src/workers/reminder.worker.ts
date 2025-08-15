import { reminderQueue, emailQueue } from '../queues/bull';
import { reminderDates } from '../services/steps.service';

interface ScheduleOptions {
  appointmentId: string;
  due: string;
  rules: number[];
  email: Record<string, any>;
}

reminderQueue.process('send', async job => {
  const { email } = job.data as { email: Record<string, any> };
  await emailQueue.add('send', email, { removeOnComplete: true });
});

export async function scheduleReminders({ appointmentId, due, rules, email }: ScheduleOptions) {
  const dueDate = new Date(due);
  const dates = reminderDates(dueDate, rules);
  for (const date of dates) {
    date.setHours(16, 0, 0, 0); // 4 PM
    const delay = date.getTime() - Date.now();
    if (delay > 0) {
      await reminderQueue.add(
        'send',
        { appointmentId, email },
        {
          delay,
          removeOnComplete: true,
          jobId: `${appointmentId}:${date.getTime()}`,
        },
      );
    }
  }
}

export async function cancelReminders(appointmentId: string) {
  const jobs = await reminderQueue.getDelayed();
  await Promise.all(
    jobs
      .filter(job => job.data.appointmentId === appointmentId)
      .map(job => job.remove()),
  );
}
