import { spawn } from 'child_process'
import { join } from 'path'

const scripts = [
  'seed.ts',
  'seed-councils.ts',
  'seed-reps.ts',
  'seed-standard-steps.ts',
  'seed-summer-times.ts',
  'seed-price-list.ts',
]

function run(script: string, tenantId: string) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn('tsx', [join(__dirname, script), tenantId], { stdio: 'inherit' })

    child.on('close', code => {
      if (code === 0) resolve()
      else reject(new Error(`${script} exited with code ${code}`))
    })
  })
}

async function main() {
  const [, , tenantId] = process.argv

  if (!tenantId) {
    console.error('Usage: tsx scripts/seed-all.ts <tenantId>')
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
