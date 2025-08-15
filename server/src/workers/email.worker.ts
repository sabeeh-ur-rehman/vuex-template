import { emailQueue } from '../queues/bull';
import { sendEmail } from '../services/email.service';

emailQueue.process(async job => {
  const { config, options } = job.data;
  await sendEmail(config, options);
});
