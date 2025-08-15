import { promises as fs } from 'fs';
import path from 'path';

const TEMPLATE_DIR = path.join(process.cwd(), 'server', 'templates');

async function ensureDir() {
  await fs.mkdir(TEMPLATE_DIR, { recursive: true });
}

export async function saveTemplate(name: string, data: Buffer): Promise<string> {
  await ensureDir();
  const filePath = path.join(TEMPLATE_DIR, `${name}.docx`);
  await fs.writeFile(filePath, data);
  return filePath;
}

/**
 * Merge tokens into a DOCX template. This implementation performs simple
 * string replacement which works for templates created with plain text tokens.
 */
export async function mergeTemplate(
  name: string,
  tokens: Record<string, string | number>
): Promise<Buffer> {
  const filePath = path.join(TEMPLATE_DIR, `${name}.docx`);
  let content = await fs.readFile(filePath, 'utf8');
  for (const [key, value] of Object.entries(tokens)) {
    const regex = new RegExp(`{{\s*${key}\s*}}`, 'g');
    content = content.replace(regex, String(value));
  }
  return Buffer.from(content);
}
