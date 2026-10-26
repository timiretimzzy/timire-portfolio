# Publishing under timire.co.zw

The portfolio is published at `timire.co.zw`. STACKED and Reaction Speed
Roulette are linked at `/stacked` and `/speed-roulette`. TypeRace and the blog
still use their current addresses; update them here when their routes move.
FiscalStack, Zivvvo, EduStack and Chaos Cup keep their own domains.

## What changes in this code

Every external address the site links to is in one file:
`src/data/places.ts`. Change the relevant entry there, run `npm test`, and
deploy. No page has a hard-coded link to these products.

The portfolio itself builds with absolute paths, so it can be served from the
root of `timire.co.zw` as it is. `public/_redirects` (Netlify) and `vercel.json`
(Vercel) already send every page address to the app.
