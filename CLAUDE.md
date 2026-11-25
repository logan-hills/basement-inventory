# Basement Inventory (Dynamic Dazzle)

## Lessons stay in step with features (standing rule)
- Every feature has an interactive lesson in `src/lessons/<id>.ts` (Dazzle Academy at `/lessons`).
- Whenever you add or change a feature, update its lesson in the same commit: fix the steps, button names, practice and quiz answers, bump `updated`, and keep `covers` pointing at the feature's files. New feature → new lesson file, added to `src/lessons/index.ts`.
- The Queen (our CEO) curates every lesson: each one carries her signed `queen` note (welcome + signoff) and at least two slides with a `queen` tip, advice in her voice. Never invent facts about her life.
- Lessons read like a work training: chapters are numbered modules; use `howto` (step-by-step walkthroughs with examples), `visual` pictures on learn slides (flow, compare, bars, stats, split), `term` (word to know) and a `recap` (key takeaways) near the end. Minutes are counted at a real 200 words a minute, so depth has to be real: aim for 2,000+ words of reading per lesson.
- Run `npm run lessons:check` before committing; it lists lessons whose covered files changed after the lesson, lessons outside 15 to 25 minutes, lessons missing the Queen's touch, and thin lessons (under 2,000 words, thinnest first: the to-do list for deepening).

## Other rules
- The repo is public: never commit keys, passwords or the database password.
- Supabase migrations live in `supabase/NNN_*.sql` and are run in the Supabase SQL editor.
- Design: "Golden Hour" tokens in `src/index.css`. Copy is warm, encouraging and plain-spoken.
