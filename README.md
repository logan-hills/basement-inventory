# The Basement Inventory

Inventory, barcode labels, warehouse locations and live-sale picking for sellers who run Facebook Live sales.

## Phase 1 (in progress)
1. Foundation: web app that installs on Android phones (later packaged for Google Play and the App Store)
2. Intake: items, variations, quantities, photos, 4-digit Live Numbers, printable barcode tags
3. Warehouse: location barcodes, scan to put away, 2D shelf map, "Get ready for live" sheet
4. Trial on real inventory

## Develop
```
npm install
npm run dev
```

## One-time setup
1. **Database:** in Supabase, open SQL Editor → New query, paste `supabase/001_foundation.sql`, click Run.
2. **Login links:** in Supabase, Authentication → URL Configuration, set Site URL to `https://logan-hills.github.io/basement-inventory/`.
3. **Hosting:** in GitHub, Settings → Pages → Source: GitHub Actions. Every push to `main` then publishes the app.

**Comment bot:** run `supabase/008_live_bot.sql` in the SQL Editor once. The bot reads Facebook Live comments on a business Page; until the Page is connected it runs in practice mode.

The Supabase URL and publishable key in `.env` are public by design. Never commit the database password or the `service_role`/secret key.

## Shared Page lives (one Facebook Page, many sellers)
Every account joins one community live calendar (the first shared Page created) and books whole-hour blocks. Accounts are either free **Just stream** (calendar, On Air, profile) or the **full seller app**. Each person has a profile (name always shown on the calendar; photo, bio, email, phone each Shown/Hidden) and agrees to the Terms of Use and Privacy Policy (`src/lib/legal.ts`, DRAFT, needs a lawyer's review) at sign-up.

Sellers book slots on a shared Page calendar (no overlaps allowed), get a private stream key for just their slot, and the server starts and ends the Facebook live at the hard start and hard stop. Nobody needs the Page password.

One-time setup:
1. **Database:** run `supabase/010_shared_page_slots.sql` in the SQL Editor.
2. **Meta app** (shared with the Live comment bot): at developers.facebook.com create a Business app, add Facebook Login for Business, add `logan-hills.github.io` to App Domains and the app URL as a valid OAuth redirect. The person connecting the Page must have a role on the Meta app while it is in Development mode, and a role on the Page. The app asks for: pages_show_list, pages_manage_posts, pages_read_engagement, pages_read_user_content (all four are needed; the last one gives the comment bot buyer names).
3. **Supabase secrets** (Edge Functions → Secrets): `FB_APP_ID`, `FB_APP_SECRET`.
4. **Edge Functions** (Edge Functions → Deploy new function → paste each file from `supabase/functions/`):
   `live-slots-tick` (turn **Verify JWT off**), `fb-page-connect`, `facebook-page-token`, `facebook-live-comments`.
5. **Timer:** run `supabase/011_slot_timer.sql` (runs the slot timer every 15 seconds).
6. **App ID:** add `VITE_FB_APP_ID=<app id>` to `.env` (public by design, like the Supabase publishable key).
7. **Sign in with Apple:** in Apple Developer create a Services ID and a Sign in with Apple key, then in Supabase → Authentication → Sign In / Providers → Apple paste the Services ID, Team ID, Key ID and key. Add the Supabase callback URL to the Services ID. (Apple's client secret expires every 6 months; Supabase reminds you.)
8. A Page admin opens **Shared Page lives → Host tools → Connect Facebook Page** once, then shares the invite code with sellers.

## iPhone app
The iPhone app wraps the same web app with Capacitor (`capacitor.config.ts`, Xcode project in `ios/`). Bundle ID: `com.basementinventory.app`.

To build on a Mac with Xcode:
1. `npm install`, then `npm run ios` (builds the web app and copies it into `ios/`).
2. Open `ios/App/App.xcodeproj` in Xcode.
3. Signing & Capabilities: pick your Apple Developer team.
4. Raise the Build number, then Product → Archive → Distribute App → App Store Connect (TestFlight).
