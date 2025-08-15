/**
 * Generate a PDF from HTML using Playwright and upload to S3.
 * Returns the public URL of the uploaded PDF.
 */
export async function htmlToPdfAndUpload(html: string, key: string): Promise<string> {
  const { chromium } = await import('playwright');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent(html);
  const buffer = await page.pdf({ format: 'A4' });
  await browser.close();

  const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3');
  const bucket = process.env.S3_BUCKET || 'tmp-bucket';
  const region = process.env.AWS_REGION || 'us-east-1';
  const client = new S3Client({ region });
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: 'application/pdf',
    })
  );
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}
