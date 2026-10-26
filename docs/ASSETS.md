# Asset manifest

All images live under `public/images/`. Pages never hard-code image paths: each
image is referenced from data (`src/data/projects.ts` plates, or
`src/data/profile.ts` for the portrait) with the `img()` helper.

Rules: real screenshots for real software; photographs only with permission of
anyone identifiable (especially minors at school events); illustrations are
labelled as illustrations; nothing generated is ever presented as a screenshot.

## In the site now

| File | What it is | Source and licence |
|---|---|---|
| `illustrations/cricket-ball.png` | Dithered render of a cricket ball | Generated for this site by `scripts/plates/generate.py`. Original work, no third-party material. |
| `illustrations/zivvvo-signs.png` | Dithered road signs | Same script. Generic sign shapes. |
| `illustrations/clubstack-card.png` | Blank member card | Same script. |
| `illustrations/stacked-cover.png` | Cartridge cover art for STACKED | Same script. Not taken from the game. |
| `illustrations/roulette-cover.png` | Cartridge cover art for Speed Roulette | Same script. Not taken from the game. |
| `profile/tawanda-timire.jpg` | Portrait of Tawanda Timire | Supplied by Tawanda for this site. |
| `/favicon.svg` | Index-ring favicon | Drawn for this site. |
| Fonts | Archivo, Newsreader, IBM Plex Mono | SIL Open Font License 1.1, bundled via Fontsource; served with the site. |

The machine (Fig. 1), the diagrams (Figs. 2 and 3) and all textures are SVG/CSS
written for this site. No stock imagery, no external image hosts.

## Wanted

Aspect ratio 8:5 suits the plate frames; screenshots in other ratios are fine,
they are shown whole. PNG for UI screenshots, JPEG or WebP for photographs.
Keep the long edge between 1600 and 2400 px.

| Project | Asset | Suggested file | Nature | For launch? |
|---|---|---|---|---|
| FiscalStack | Company logo, as supplied | `fiscalstack/brand/logo.svg` | Logo, unaltered | Recommended |
| FiscalStack Retail | Sales screen at the till | `fiscalstack/retail/01-sales.png` | Screenshot | Recommended |
| FiscalStack Retail | Stock / back office | `fiscalstack/retail/02-stock.png` | Screenshot | Later |
| FiscalStack Retail | A printed fiscal receipt (customer details removed) | `fiscalstack/retail/03-receipt.jpg` | Photograph or scan | Later |
| FiscalStack Restaurant | Tables and open orders | `fiscalstack/restaurant/01-tables.png` | Screenshot | Recommended |
| FiscalStack Restaurant | Bill and payment | `fiscalstack/restaurant/02-bill.png` | Screenshot | Later |
| FiscalStack Integrations | Data-flow diagram, client names removed | `fiscalstack/integrations/01-flow.svg` | Diagram | Recommended |
| FiscalStack Web | Business workflow screen with all real customer data removed | `fiscalstack/web/01-workflow.png` | Screenshot | Later |
| FieldPOS | Mobile POS screen with all real customer data removed | `fiscalstack/fieldpos/01-mobile.png` | Screenshot | Later |
| Zivvvo | Practice question on a phone | `zivvvo/01-question.png` (portrait) | Screenshot | Recommended |
| Zivvvo | Mistake review | `zivvvo/02-review.png` | Screenshot | Later |
| ClubStack | Member account or cashier screen | `clubstack/01-member.png` | Screenshot | Later |
| EduStack | Any interface | `edustack/01.png` | Screenshot | Later |
| Tee & Co. | Home or service page | `tee-and-co/01-home.png` | Screenshot | Later |
| The Interrogation | Case selection without story spoilers | `interrogation/01-cases.png` | Screenshot | Later |
| Crazy Eights Arcade | Gameplay screen with names and invite codes removed | `games/crazy-eights/01-game.png` | Screenshot | Later |
| Chaos-Verify | Output or architecture | `chaos-verify/01.png` | Screenshot or diagram | Later |
| STACKED | Gameplay capture (still or short WebM) | `games/stacked/01.png` | Capture | Recommended |
| Speed Roulette | Gameplay capture | `games/speed-roulette/01.png` | Capture | Recommended |
| Cricket research | A figure from the dissertation | `research/01-figure.png` | Diagram | Later |
| Brain Bunchy | Event photograph, with permission | `brain-bunchy/01.jpg` | Photograph | Later |

## How to add one

1. Put the file in the folder above.
2. In `src/data/projects.ts`, find the project's `plates` and set `src: img('fiscalstack/retail/01-sales.png')`,
   `nature: 'screenshot'`, and give it real `alt` text and `width`/`height`.
3. The reserved frame is replaced automatically.

To regenerate the illustrations: `npm run plates` (needs Python 3 with numpy and Pillow).
