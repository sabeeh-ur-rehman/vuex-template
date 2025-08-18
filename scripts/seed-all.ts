import { spawn } from 'child_process'
import { join } from 'path'

const tsxBin = join(
  __dirname,
  '..',
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'tsx.cmd' : 'tsx',
)

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
    const child = spawn(tsxBin, [join(__dirname, script), tenantId], { stdio: 'inherit' })

    child.on('close', code => {
      if (code === 0) resolve()
      else reject(new Error(`${script} exited with code ${code}`))
    })

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
