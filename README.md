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
