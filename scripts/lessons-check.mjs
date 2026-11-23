// Lists lessons whose feature files changed (in git) after the lesson was last updated.
// Run: npm run lessons:check
import { readdirSync, readFileSync } from 'node:fs'
import { execSync } from 'node:child_process'

const dir = 'src/lessons'
const last = f => { try { return execSync(`git log -1 --format=%cs -- "${f}"`).toString().trim() } catch { return '' } }
let stale = 0
for (const f of readdirSync(dir).filter(f => f.endsWith('.ts') && !['types.ts', 'index.ts'].includes(f))) {
  const src = readFileSync(`${dir}/${f}`, 'utf8')
  const updated = (src.match(/updated: '([\d-]+)'/) || [])[1] || ''
  const covers = [...(src.match(/covers: \[([^\]]*)\]/)?.[1] ?? '').matchAll(/'([^']+)'/g)].map(m => m[1])
  const newer = covers.filter(c => last(c) > updated)
  if (newer.length) { stale++; console.log(`⚠ ${f} (updated ${updated}) may be out of date: ${newer.map(c => `${c} changed ${last(c)}`).join(', ')}`) }
}
console.log(stale ? `\n${stale} lesson(s) to review.` : 'All lessons are up to date with their features.')
