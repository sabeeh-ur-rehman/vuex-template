// scripts/seed-all.ts
import { spawn } from 'child_process'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const scripts = [
  '../server/src/db/seed.ts',
  'seed-councils.ts',
  'seed-reps.ts',
  'seed-standard-steps.ts',
  'seed-summer-times.ts',
  'seed-price-list.ts',
]

function run(script: string, tenantId: string) {
  return new Promise<void>((resolve, reject) => {
    const scriptPath = join(__dirname, script)

    const child = spawn(
      process.execPath,                   // Node binary
      ['--import', 'tsx', scriptPath, tenantId], // <- use tsx via --import
      { stdio: 'inherit' }
    )

    child.on('close', code => code === 0 ? resolve() : reject(new Error(`${script} exited with code ${code}`)))
    child.on('error', reject)
  })
}

async function main() {
  const [, , tenantId] = process.argv
  if (!tenantId) {
    console.error('Usage: npm run seed-all -- <tenantId>')
    process.exit(1)
  }
  for (const script of scripts) {
    await run(script, tenantId)
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
