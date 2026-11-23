// Dazzle Academy health check. Run: npm run lessons:check
// 1. Lists lessons whose feature files changed (in git) after the lesson was last updated.
// 2. Lists lessons that run shorter than the 15 minute target (or longer than 25).
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { register } from 'node:module'

const dir = 'src/lessons'
const last = f => { try { return execSync(`git log -1 --format=%cs -- "${f}"`).toString().trim() } catch { return '' } }
const files = d => readdirSync(d).flatMap(f => statSync(`${d}/${f}`).isDirectory() ? files(`${d}/${f}`) : [`${d}/${f}`])
let stale = 0
for (const f of files(dir).filter(f => f.endsWith('.ts') && !/\/(types|index|time|trends|resources|classes)\.ts$/.test(f))) {
  const src = readFileSync(f, 'utf8')
  const updated = (src.match(/updated: '([\d-]+)'/) || [])[1] || ''
  const covers = [...(src.match(/covers: \[([^\]]*)\]/)?.[1] ?? '').matchAll(/'([^']+)'/g)].map(m => m[1])
  const newer = covers.filter(c => last(c) > updated)
  if (newer.length) { stale++; console.log(`⚠ ${f} (updated ${updated}) may be out of date: ${newer.map(c => `${c} changed ${last(c)}`).join(', ')}`) }
}

// Load the real lessons (Node strips the TypeScript; this hook fills in the missing .ts on imports).
register('data:text/javascript,' + encodeURIComponent(`export async function resolve(s, c, n) { try { return await n(s, c) } catch (e) { if (s.startsWith('.') && !s.endsWith('.ts')) return n(s + '.ts', c); throw e } }`))
const { ALL_LESSONS, lessonMinutes } = await import('../src/lessons/index.ts')
let short = 0
console.log('\nLesson times (target 15 to 20 minutes):')
for (const l of ALL_LESSONS) {
  const m = lessonMinutes(l)
  const flag = m < 15 ? '  ⚠ too short' : m > 25 ? '  ⚠ long, think about splitting' : ''
  if (flag) short++
  console.log(`  ${String(m).padStart(3)} min  ${l.kind === 'course' ? 'course' : 'lesson'}  ${l.id}${flag}`)
}
console.log(stale || short ? `\n${stale} lesson(s) to bring up to date, ${short} with a time to fix.` : '\nAll lessons are up to date with their features and run 15 to 25 minutes.')
