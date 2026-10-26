# The Timire Machine

Personal portfolio of Tawanda Timire, drawn as the operator's manual and parts
catalogue for a machine from an alternate 1989.

## Run it

```bash
npm install
npm run dev          # http://localhost:5173, shows owner notes for missing content
npm run build        # production build to dist/ (real URLs; host must rewrite to index.html)
npm run preview      # serve dist/ locally
npm run build:static # hash-routed build to dist-static/, works from any folder or file host
```

## Test it

```bash
npm test             # Vitest: data integrity, house rules, machine and navigation behaviour
npm run test:e2e     # Playwright against the production build (desktop + mobile projects)
npm run typecheck
```

`npm run test:e2e` builds the site, serves it with `vite preview`, and checks
every route (direct load and refresh), axe accessibility rules (WCAG 2.2 A/AA,
serious and critical), keyboard use of the machine, reduced motion, filters,
history, the 404 sheet, the contact links, and horizontal overflow at nine
widths from 320 to 2560 px. To use an existing Chromium binary, set
`PW_CHROMIUM=/path/to/chrome`; otherwise run `npx playwright install chromium` once.

## Deploy

Any static host. The build uses real paths (`/projects/zivvvo`), so unknown paths
must fall back to `index.html`:

- Netlify: `public/_redirects` is already included.
- Vercel: `vercel.json` is already included.
- Anything else (GitHub Pages, a plain folder): use `npm run build:static`.

## Where things are

```
src/
  app/            routes, shell, section definitions
  components/
    Machine/      the index ring (SVG), readout unit, keys, paper tape
    Navigation/   binder tabs (wide) / index bar (narrow)
    TitleBlock/   footer drawn as a drawing title block
    ProjectArchive/ parts list table
    CaseStudy/    numbered case-study sections, owner notes (dev only)
    TechnicalDiagram/ Figs. 2 and 3
    Plate/        images, illustrations and reserved frames
    Evidence/     "as stated" / "verified" provenance marks
  pages/          one folder per sheet
  data/           profile.ts, projects.ts, articles.ts, types.ts   <- edit content here
  content/articles/  Markdown articles with front matter
  styles/         tokens, typography, layout, textures, motion
scripts/plates/   generator for the dithered illustrations
public/images/    images, one folder per project (see docs/ASSETS.md)
docs/             ASSETS.md (public asset manifest)
tests/e2e/        Playwright
```

## Adding things

- **A project:** add a record to `src/data/projects.ts`. The parts list, archive
  filters, machine tape, mechanism pages and pager pick it up.
- **An article:** add `src/content/articles/my-slug.md` with front matter:

  ```
  ---
  title: The title
  date: 2026-11-01
  kind: essay            # essay | technical | research-summary | site-note
  series: rumblings      # optional; puts it on the Rumblings of a Fool shelf
  summary: One sentence.
  related: zivvvo, fiscalstack
  ---
  ```

- **A screenshot:** see `docs/ASSETS.md`.

## Editorial rules baked into the code

- Facts carry provenance: `stated` (from Tawanda), `verified` (checked), `pending`.
  A unit test fails if anything is marked verified beyond what has actually been checked.
- No emoji anywhere: a unit test scans the source.
- Illustrations can never be labelled as screenshots: a unit test checks.
- Missing material is tracked in data (`awaiting`) and shown only in dev builds.
