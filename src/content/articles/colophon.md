---
title: Colophon, or how this study is put together
date: 2026-10-25
kind: site-note
summary: Notes on method and design, for anyone who wants to know why a portfolio looks like a parts catalogue.
related: fiscalstack, clubstack
---

This site is a study of one person, Tawanda Timire, made from his work. It is laid out as the operator's manual and parts catalogue for a machine that was never built, because his work spans software, data, testing, business and several things that are harder to file, and a machine is a good way to show separate parts that only make sense together.

## Method

The study draws on four things: the documentation, specifications and test reports in his repositories; the products and games he has put online; his writing; and his own account of his work. Source code, credentials and customer information were not reproduced. Where a sheet quotes a test result, it is the result recorded in the project's own reports.

## The drawing conventions

- **Sheets.** Every page is a numbered sheet. The footer is a title block, the box in the corner of an engineering drawing that says what it is and when it was last revised. The revision date is the date the site was built.
- **Balloons and the parts list.** On the front sheet, the circled letters around the index ring are mechanisms, and the numbered items in the parts list are projects. Each list points at the other.
- **Blue pencil.** Notes in blue are annotations, after the non-reproducing blue pencil that editors and draughtsmen used for marks that were not meant to print.
- **Highlighter.** The yellow-green is a highlighter and an indicator lamp. It marks what is selected, and where to reach the subject.

## The index ring

The machine on the front sheet is drawn in SVG, not rendered in 3D. It has six sectors, one per mechanism. Choosing a mechanism turns the ring until that sector sits under the pointer, and the paper tape lists the projects that use it. The keys underneath do the same thing and work from a keyboard. If the reader's system asks for reduced motion, the ring moves without animating. The schematic switch redraws the same geometry as a line drawing with part callouts.

## Pictures

The cartridge and plate illustrations are rendered for this study as dithered images, in the manner of early computer graphics. They are labelled as illustrations and do not stand in for screenshots of the products.

## Type and construction

Headlines are Archivo at its widest; running text is Newsreader; part numbers and labels are IBM Plex Mono. All three are open-source and served with the site.

React, TypeScript and Vite, with no 3D or animation library. Project content lives in typed data files, so adding a project is an edit to data rather than to layout. The site is tested with Vitest and Playwright, including automated accessibility checks.
