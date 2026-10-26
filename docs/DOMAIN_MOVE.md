# Moving to timire.co.zw

The plan (October 2026) is to move this portfolio, *Rumblings of a Fool* and the
games under `timire.co.zw`. FiscalStack, Zivvvo, EduStack and Chaos Cup keep
their own domains.

## What changes in this code

Every external address the site links to is in one file:
`src/data/places.ts`. When the blog and the games have their new addresses,
change `blog`, `stacked`, `speedRoulette` and `typeRace` there, run `npm test`,
and deploy. No page has a hard-coded link to them.

The portfolio itself builds with absolute paths, so it can be served from the
root of `timire.co.zw` as it is. `public/_redirects` (Netlify) and `vercel.json`
(Vercel) already send every page address to the app.
