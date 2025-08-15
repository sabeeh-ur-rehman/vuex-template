import { pdfQueue } from '../queues/bull';
import { htmlToPdfAndUpload } from '../services/pdf.service';

pdfQueue.process(async job => {
  const { html, key } = job.data;
  return htmlToPdfAndUpload(html, key);
});
