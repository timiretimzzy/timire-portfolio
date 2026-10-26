import type { Project } from './types'
import { img } from '../lib/asset'
import { places } from './places'

/**
 * Bill of materials: every project in the study.
 *
 * Voice: the site is written by a researcher studying Tawanda Timire through
 * his work. Third person throughout. Dry where it helps; plain where it is
 * a fact.
 *
 * Provenance:
 * - `s(...)` per subject: Tawanda's own account, not independently checked.
 * - `v(...)` observed on a live public page; the text gives the date.
 * - `f(...)` from the files: read in the project's own documentation, source
 *            tree or test reports, which Tawanda showed the researcher. Only
 *            design and capability are described. No source code,
 *            credentials, device identifiers, customer data or licensing
 *            internals are published, and these sheets must stay that way.
 *
 * Incomplete material stays out of published sheets until it can be checked.
 */

const s = (text: string) => ({ text, evidence: 'stated' as const })
const v = (text: string) => ({ text, evidence: 'verified' as const })
const f = (text: string) => ({ text, evidence: 'inspected' as const })


const allProjectRecords: Project[] = [
  /* ------------------------------------------------------------------ */
  {
    slug: 'fiscalstack',
    item: 1,
    name: 'FiscalStack Solutions',
    kind: 'commercial',
    mechanisms: ['A', 'B', 'D'],
    status: 'operating',
    statusEvidence: 'stated',
    summary: 'The subject\u2019s company. Fiscal point-of-sale and business software designed for real tills, unreliable connectivity and the books that have to balance afterwards.',
    accent: 'ink',
    role: {
      body: 'Founder and Managing Director. The work spans product decisions, architecture, Windows and web development, fiscalisation and API integration, testing, deployment, customer onboarding and support.',
    },
    problem: {
      body: 'Businesses in Zimbabwe must issue tax-compliant fiscal receipts through ZIMRA\u2019s Fiscal Device Management System, keep stock and books straight, and often trade in more than one currency, on power and connectivity that nobody would call guaranteed. Most of them do not want an ERP. They want the till to work, the receipt to be valid, and the month-end numbers to agree.\n\nFiscalStack is his answer: a fiscal engine, point-of-sale systems built on it for shops and restaurants, a Lesotho edition for a different tax authority, and integrations that add fiscalisation to software a business already runs.',
    },
    constraints: {
      facts: [
        s('ZIMRA fiscalisation requirements for receipts, credit notes and the fiscal day.'),
        s('Multi-currency trading.'),
        s('Unreliable power and network, so a sale can never depend on being online.'),
        s('Customers who already have systems and will not replace all of them.'),
      ],
    },
    architecture: {
      body: 'The product line, as the files lay it out: one fiscal engine underneath; a retail POS, a restaurant POS and an Android edition on top of it; a Lesotho port against a different revenue authority; and integration work that places the same engine behind other people\u2019s software. ClubStack and EduStack sit alongside as separate products under the same company. Each has its own sheet.',
      facts: [
        f('Windows desktop applications in C# on .NET Framework 4.8 (WPF), with SQLite for local fiscal storage, BouncyCastle for certificates and signing, and Inno Setup installers.'),
        v(`The company website describes tax-compliant invoicing and point of sale: issuing fiscal receipts, managing inventory and working offline.`),
      ],
    },
    decisions: {
      body: 'The decisions that matter were taken at product level and are recorded on the product sheets. One rule recurs in every one of them: a sale is never blocked by the network. Receipts are fiscalised immediately when the authority can be reached and queued for batch submission when it cannot.',
    },
    challenges: {
      body: 'The difficult part of business software is rarely the screen. It is a sale made with no connection, a receipt fiscalised hours later, a transaction that must never be submitted twice, a counter that must never go backwards, and books that still have to reconcile. That problem space is drawn below.',
    },
    results: {
      body: 'FiscalStack operates a product line for fiscal point of sale, business workflows and integrations. The sheets that follow examine the engineering without publishing customer data or unsupported adoption figures.',
    },
    stack: [
      { name: 'C#', evidence: 'inspected' },
      { name: '.NET Framework 4.8 / WPF', evidence: 'inspected' },
      { name: 'SQLite', evidence: 'inspected' },
      { name: 'BouncyCastle', evidence: 'inspected' },
    ],
    links: [
      { label: 'fiscalstack.co.zw', href: places.fiscalstackZw, kind: 'company' },
      { label: 'fiscalstack.co.ls', href: places.fiscalstackLs, kind: 'company' },
    ],
    plates: [
      { alt: 'Reserved plate for the FiscalStack logo and product overview.', caption: 'FiscalStack brand plate. The company\u2019s own logo goes here, unaltered.', nature: 'awaiting' },
    ],
    related: ['fiscalstack-engine', 'fiscalstack-retail', 'fiscalstack-restaurant', 'fiscalstack-fieldpos', 'fiscalstack-web', 'fiscalstack-lesotho', 'fiscalstack-integrations', 'clubstack', 'edustack'],
    diagram: 'fiscal-problem-space',
  },

  /* ------------------------------------------------------------------ */
  {
    slug: 'fiscalstack-retail',
    item: 2,
    name: 'FiscalStack Retail POS',
    parent: 'fiscalstack',
    kind: 'commercial',
    mechanisms: ['A', 'B', 'D'],
    status: 'built',
    statusEvidence: 'inspected',
    summary: 'The Windows till: ring up, fiscalise, manage stock and keep trading offline. The queue is a ruthless load test.',
    accent: 'ink',
    role: {
      body: 'Product owner and developer. The recorded requirements focus on predictable environment switching, tax rates kept with product data, a clear day-close workflow and reliable receipt numbering.',
    },
    problem: {
      body: 'A retail till has to ring up a basket quickly, produce an accepted fiscal receipt, update stock and leave records the back office can reconcile. In a shop, the queue is the specification: a slow sale is visible to everyone waiting behind it.',
    },
    constraints: {
      facts: [
        f('Windows 10/11 desktop application (WPF, .NET Framework 4.8), shipped with an installer and in-app updates.'),
        f('For retail shops, supermarkets and any VAT-registered business in Zimbabwe that must issue ZIMRA-compliant receipts.'),
        f('Offline-first: sales complete without internet; receipts queue locally and are batch-submitted when the connection returns.'),
      ],
    },
    architecture: {
      body: 'Two components with a hard line between them. The POS application owns the screens, products, users, cart, receipt journal and printing. The fiscal engine owns everything the tax authority cares about: the protocol, certificates, signing, counters and the fiscal database. The application never speaks to ZIMRA except through the engine.',
      facts: [
        f('Fiscal day lifecycle handled end to end: register the device on first run, open the day, fiscalise each sale, close the day with signed counters, then submit any queued receipts.'),
        f('Each receipt is hashed and signed, and chained to the previous receipt of the day.'),
        f('Several tills can share one catalogue and stock: one till acts as host and owns products, stock, users and suppliers; the others send each sale to it over the shop\u2019s network and adopt the balance it reports back, checking for changes on a short polling cycle.'),
      ],
    },
    decisions: {
      facts: [
        f('Test and production configuration is explicit, and product tax data is maintained with the product catalogue.'),
        f('Day-close and credit-note workflows include operator checks intended to reduce avoidable errors.'),
      ],
    },
    challenges: {
      body: 'The core challenge is to keep a sale usable for the cashier while maintaining an accurate fiscal and stock record. The application separates the point-of-sale workflow from the shared fiscal component and keeps day-close operations explicit.',
    },
    results: {
      facts: [
        f('Features recorded in the product documentation: product catalogue with barcodes and per-product tax rates, holds (park and recall), till open and close with float, stock deduction and counts, X report and sales reports, user roles with PIN login, 48 mm and 58 mm thermal receipts.'),
        f('Interface in English and Simplified Chinese, switchable at runtime.'),
      ],
      awaiting: ['Publishable evidence of use: sectors or a customer you are allowed to name.'],
    },
    stack: [
      { name: 'C#', evidence: 'inspected' },
      { name: 'WPF, .NET Framework 4.8', evidence: 'inspected' },
      { name: 'SQLite', evidence: 'inspected' },
      { name: 'Inno Setup', evidence: 'inspected' },
    ],
    links: [{ label: 'fiscalstack.co.zw', href: places.fiscalstackZw, kind: 'company' }],
    plates: [
      { alt: 'Reserved plate: FiscalStack Retail POS sales screen.', caption: 'Sales screen at the till.', nature: 'awaiting' },
      { alt: 'Reserved plate: FiscalStack Retail POS onboarding or Close Day screen.', caption: 'Opening and closing the fiscal day.', nature: 'awaiting' },
      { alt: 'Reserved plate: a printed fiscal receipt from FiscalStack Retail POS.', caption: 'A fiscal receipt as printed.', nature: 'awaiting' },
    ],
    related: ['fiscalstack-engine', 'fiscalstack-restaurant', 'fiscalstack-lesotho'],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: 'fiscalstack-restaurant',
    item: 3,
    name: 'FiscalStack Restaurant POS',
    parent: 'fiscalstack',
    kind: 'commercial',
    mechanisms: ['A', 'B', 'D'],
    status: 'built',
    statusEvidence: 'inspected',
    summary: 'A restaurant is not a shop with plates. Tables, open bills, the kitchen, split cheques, and a fiscal receipt only when somebody finally pays.',
    accent: 'ink',
    role: {
      body: 'Product owner and developer. The restaurant edition is a fork of the retail POS, and the files show it being measured, feature by feature, against a long-established restaurant POS used as the functional reference.',
    },
    problem: {
      body: 'In a shop the sale starts and ends at the till. In a restaurant it starts at a table and wanders: orders stay open, tables move, somebody wants the bill split three ways, the kitchen needs to know before anybody has paid, and the receipt the authority cares about arrives at the end of all that. Bolting that onto a retail till produces a system that annoys waiters, and waiters remember.',
    },
    constraints: {
      facts: [
        f('Fiscalisation happens only at settlement: everything before payment (orders, proformas, kitchen dockets) is deliberately non-fiscal.'),
        f('Built on the same engine and shared data location as the retail POS.'),
      ],
    },
    architecture: {
      facts: [
        f('Areas and tables with colour-coded states; open bills that persist before payment; take-away; proforma printing.'),
        f('Kitchen dockets with a line state machine: new, submitted, ready, served. Courses for starter, main and dessert.'),
        f('Portions and order tags priced into the VAT base; mandatory tags enforced.'),
        f('Bill operations: merge, transfer, split and void; discounts and service charges with VAT apportioned proportionally; split and multi-tender payment.'),
        f('Work periods, customer accounts with printed statements, a time clock, and inventory with recipes consumed at settlement.'),
        f('Reports by date range: by server, category, table, payment method and tax.'),
      ],
    },
    decisions: {
      body: 'The product is organized around open orders and tables rather than a single checkout queue. That distinction drives the order, kitchen and payment flows; it is not a retail till with restaurant labels pasted on.',
    },
    challenges: { awaiting: ['A real service-time problem from a site and how it was fixed.'] },
    results: {
      facts: [f('Clean release build and 148 of 148 automated tests passing (77 retained from the retail POS, 71 restaurant-specific), as recorded in the project\u2019s QA inventory.')],
      awaiting: ['Publishable evidence of use.'],
    },
    stack: [
      { name: 'C#', evidence: 'inspected' },
      { name: 'WPF, .NET Framework 4.8', evidence: 'inspected' },
    ],
    links: [{ label: 'fiscalstack.co.zw', href: places.fiscalstackZw, kind: 'company' }],
    plates: [
      { alt: 'Reserved plate: FiscalStack Restaurant POS table map.', caption: 'Tables and open bills.', nature: 'awaiting' },
      { alt: 'Reserved plate: FiscalStack Restaurant POS kitchen screen.', caption: 'Kitchen dockets and line states.', nature: 'awaiting' },
    ],
    related: ['fiscalstack-retail', 'fiscalstack-engine', 'clubstack'],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: 'fiscalstack-integrations',
    item: 4,
    name: 'FiscalStack Integrations',
    parent: 'fiscalstack',
    kind: 'engineering',
    mechanisms: ['A', 'B', 'D'],
    status: 'built',
    statusEvidence: 'inspected',
    summary: 'For businesses that like their current software and still need valid fiscal receipts. He builds the bridge, not the replacement.',
    accent: 'cobalt',
    role: { body: 'Design, implementation and verification.' },
    problem: {
      body: 'Plenty of businesses already run software they like, or at least software they are not replacing this year. What they need is for that system to produce fiscal documents the authority accepts, and for the records on both sides to agree. Integration work lives in the gap between two systems that were never introduced to each other, and most of the job is making sure they cannot misunderstand each other quietly.',
    },
    constraints: {
      facts: [
        f('The host system is someone else\u2019s product and cannot be recompiled.'),
      ],
    },
    architecture: {
      body: 'Two integration patterns appear in the files.',
      facts: [
        f('A plug-in integration connects an existing Windows point-of-sale product to the FiscalStack fiscal engine without replacing its front end.'),
        f('A separate fiscal print-driver project is specified as a Windows application for receiving, fiscalising and printing invoices from billing software.'),
      ],
    },
    decisions: {
      facts: [
        f('Every integration runs through the same FiscalStack engine as the company\u2019s own tills, so counters, signing and offline queuing behave identically whoever owns the front end.'),
        s('The same approach extends to the widely known point-of-sale and business applications in use in the market; he integrates them as clients need.'),
      ],
    },
    challenges: { awaiting: ['One integration story that can be told without naming the client.'] },
    results: { awaiting: ['Print driver status: specified, in development or shipped.'] },
    stack: [
      { name: 'C#', evidence: 'inspected' },
      { name: '.NET Framework', evidence: 'inspected' },
      { name: 'PowerShell deployment', evidence: 'inspected' },
    ],
    links: [{ label: 'fiscalstack.co.zw', href: places.fiscalstackZw, kind: 'company' }],
    plates: [{ alt: 'Reserved plate: integration data-flow diagram.', caption: 'Integration data flow, client details removed.', nature: 'awaiting' }],
    related: ['fiscalstack-engine', 'fiscalstack-retail', 'fiscalstack-lesotho'],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: 'fiscalstack-engine',
    item: 16,
    name: 'FiscalStack Engine',
    parent: 'fiscalstack',
    kind: 'engineering',
    mechanisms: ['B', 'D', 'A'],
    status: 'built',
    statusEvidence: 'inspected',
    summary: 'The shared .NET component behind FiscalStack\u2019s fiscal products: one place for device operations, document signing and offline submission.',
    accent: 'cobalt',
    role: { body: 'Designed and built by the subject as the shared core of the product line.' },
    problem: {
      body: 'Every fiscal product needs a consistent way to communicate with the authority and keep working when a connection drops. The engine centralizes that work so the POS applications and integrations do not each implement their own version of the rules.',
    },
    constraints: {
      facts: [
        f('Runs server-to-server against the authority\u2019s API; no separate fiscal hardware box is needed at the till.'),
        f('Must keep counting and signing correctly while offline, and reconcile cleanly when the connection returns.'),
      ],
    },
    architecture: {
      facts: [
        f('A .NET class library provides a shared interface for device setup, fiscal status, day operations, receipt submission and batch submission.'),
        f('SQLite stores local fiscal records and queued work for offline operation.'),
        f('Fiscal document signing and response handling sit behind the shared engine interface.'),
      ],
    },
    decisions: { body: 'One engine, many front ends. The retail POS, restaurant POS, Lesotho edition and integrations share the same fiscal component instead of maintaining separate implementations.' },
    challenges: { awaiting: ['A hard bug in counters, signing or day close, and how it was found.'] },
    results: { awaiting: ['Anything publishable about devices registered or receipts processed.'] },
    stack: [
      { name: 'C#', evidence: 'inspected' },
      { name: 'SQLite', evidence: 'inspected' },
      { name: 'BouncyCastle', evidence: 'inspected' },
      { name: 'Newtonsoft.Json', evidence: 'inspected' },
    ],
    links: [{ label: 'fiscalstack.co.zw', href: places.fiscalstackZw, kind: 'company' }],
    plates: [],
    related: ['fiscalstack-retail', 'fiscalstack-lesotho', 'fiscalstack-integrations'],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: 'fiscalstack-lesotho',
    item: 17,
    name: 'FiscalStack Lesotho POS',
    parent: 'fiscalstack',
    kind: 'commercial',
    mechanisms: ['A', 'B'],
    status: 'built',
    statusEvidence: 'inspected',
    summary: 'The same till, taught a second country. Ported from Zimbabwe\u2019s ZIMRA rules to the Revenue Services Lesotho e-invoicing gateway.',
    accent: 'cobalt',
    role: { body: 'Porting, analysis and implementation. The files include his own written record of every difference between the two authorities and the decision taken for each.' },
    problem: {
      body: 'Two tax authorities, two ideas of what a fiscal receipt is. A port that only swaps the logo produces receipts the second authority rejects. This one starts from a side-by-side comparison of the two systems and changes the till wherever the rules genuinely differ, and nowhere else.',
    },
    constraints: {
      facts: [
        f('Lesotho trades in maloti only, so the dual-currency handling of the Zimbabwe edition is removed.'),
        f('The Lesotho gateway is offline-first by design: retryable failures queue receipts, which are then sent as batch files.'),
        f('The fiscal day is a local period reconciled at close, instead of a day number issued by a central server.'),
      ],
    },
    architecture: {
      facts: [
        f('Same POS application, re-pointed at a Lesotho edition of the engine through a thin, thread-safe wrapper.'),
        f('Submission service rewritten around the batch model: build the offline file, submit it, remove only the matching queued documents on success, archive what was sent, and never delete anything on a failure.'),
        f('Tax handling re-mapped to the Lesotho categories, including fixed and percentage levies configured per product.'),
      ],
    },
    decisions: {
      facts: [
        f('Any retryable result counts as accepted locally, so the till keeps selling whatever the gateway is doing.'),
        f('The environment can be switched between test and production at runtime without recreating the device.'),
        f('Points that need the authority\u2019s confirmation before production are listed as open decisions, not guessed.'),
      ],
    },
    challenges: { awaiting: ['What surprised you most about the Lesotho rules.'] },
    results: {
      facts: [f('Release build with zero warnings, as recorded in the port notes.')],
      awaiting: ['Status in Lesotho: pilot, live, or awaiting approval.'],
    },
    stack: [
      { name: 'C#', evidence: 'inspected' },
      { name: 'WPF', evidence: 'inspected' },
    ],
    links: [{ label: 'fiscalstack.co.ls', href: places.fiscalstackLs, kind: 'company' }],
    plates: [{ alt: 'Reserved plate: FiscalStack Lesotho POS checkout in maloti.', caption: 'Checkout, Lesotho edition.', nature: 'awaiting' }],
    related: ['fiscalstack-retail', 'fiscalstack-engine', 'fiscalstack'],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: 'zivvvo',
    item: 5,
    name: 'Zivvvo',
    kind: 'commercial',
    mechanisms: ['A', 'E', 'C'],
    status: 'live',
    statusEvidence: 'verified',
    summary: 'Learner\u2019s licence preparation that still works at the bus stop. Over 1,200 questions, offline, and it remembers what you keep getting wrong.',
    accent: 'chartreuse',
    role: {
      body: 'Product and engineering.',
      awaiting: ['Confirm role and whether anyone else worked on it.'],
    },
    problem: {
      body: 'People preparing for the VID provisional licence theory test mostly study on a phone, on data that is expensive when it exists. A study tool that needs a connection for every question stops working exactly when there are twenty minutes to kill. Zivvvo keeps       The practice loop works on the device, explains answers and returns attention to topics that need more study.',
    },
    constraints: {
      facts: [
        v(`Built for the Zimbabwe VID Class 2 provisional licence test.`),
        v('Works without an internet connection, according to the product page.'),
        s('Mobile-first Progressive Web App; progress stored locally in IndexedDB through Dexie.'),
      ],
    },
    architecture: {
      facts: [
        s('React, Vite, Tailwind CSS and Zustand on the client.'),
        s('IndexedDB via Dexie for local persistence.'),
        s('Supabase-related authentication or synchronisation.'),
        s('AI features run through a server-side integration, not from the browser.'),
      ],
      awaiting: ['Which of these are live, in development or planned.'],
    },
    decisions: {
      facts: [
        v('The product page advertises more than 1,200 questions on road signs, rules and vehicle controls.'),
        v('Every question carries an explanation, presented as AI-powered.'),
        v('Adaptive study plans that focus on weak topics.'),
        s('Progress tracking and a review of mistakes.'),
      ],
      awaiting: ['How the adaptive logic decides what to show next.', 'Whether the AI tutor in the brief is the same feature as the explanations on the site.'],
    },
    challenges: { awaiting: ['A real problem with offline state or sync and how it was handled.'] },
    results: { body: 'Live at zivvvo.co.zw. The subject reports a small number of clients so far.' },
    stack: [
      { name: 'React', evidence: 'stated' },
      { name: 'Vite', evidence: 'stated' },
      { name: 'Tailwind CSS', evidence: 'stated' },
      { name: 'Zustand', evidence: 'stated' },
      { name: 'Dexie / IndexedDB', evidence: 'stated' },
      { name: 'Supabase', evidence: 'stated' },
    ],
    links: [{ label: 'zivvvo.co.zw', href: places.zivvvo, kind: 'product' }],
    plates: [
      { src: img('illustrations/zivvvo-signs.png'), alt: 'Dithered illustration of three road signs: a give-way triangle, a no-entry disc and a stop octagon.', caption: 'Illustration, not a screenshot. Road signs, because that is what the test is about.', nature: 'illustration', width: 480, height: 300 },
      { alt: 'Reserved plate: Zivvvo practice question on a phone.', caption: 'A practice question on a phone.', nature: 'awaiting' },
      { alt: 'Reserved plate: Zivvvo mistake review screen.', caption: 'Reviewing mistakes.', nature: 'awaiting' },
    ],
    related: ['cricket-odi-prediction', 'edustack', 'brain-bunchy'],
    diagram: 'zivvvo-layers',
  },

  /* ------------------------------------------------------------------ */
  {
    slug: 'clubstack',
    item: 6,
    name: 'ClubStack',
    parent: 'fiscalstack',
    kind: 'commercial',
    mechanisms: ['A', 'B', 'D'],
    status: 'in-development',
    statusEvidence: 'inspected',
    summary: 'A whole club in one system: members, cards, accounts, the bar, the pro shop, the tee sheet and the books. It started at a golf club. It is not a golf product.',
    accent: 'ink',
    role: {
      body: 'Product owner, architect and developer. The repository records staged specifications, implementation work and QA plans for a modular club-management system.',
    },
    problem: {
      body: 'A club runs on connected workflows: membership, accounts, food and beverage, the pro shop, bookings and finance. ClubStack is designed to bring them into one system, rather than asking staff to reconcile several disconnected tools by hand.',
    },
    constraints: {
      facts: [
        f('Local-first: authentication, member lookup, card processing, POS, cashiering, inventory, bookings, tournaments, finance and printing must all work with the internet down.'),
        f('Financial integrity is non-negotiable: money is stored as decimals, never floating point; every transaction is traceable.'),
        f('Single-club installation on the club\u2019s own network; no cloud dependency for core operations.'),
      ],
    },
    architecture: {
      body: 'A modular monolith, chosen deliberately over microservices: members, accounts, POS, stock and finance are too tightly bound by transactions to split across a network on day one, and a club cannot be asked to run a distributed system. Each module is still kept as a separate bounded area inside.',
      facts: [
        f('ASP.NET Core on .NET 10, PostgreSQL through Entity Framework Core, a REST API, and a React and TypeScript front end delivered in a Windows WebView2 shell on terminals.'),
        f('Layered solution: domain, application, infrastructure, API, contracts, host, desktop shell and a hardware layer.'),
        f('Hardware behind adapters (receipt printers, cash drawers, barcode scanners, magnetic-stripe card readers), so no business module contains vendor-specific code.'),
        f('Idempotency on commands that move money, a durable outbox for domain events, audit logging, correlation IDs and health checks.'),
        f('ZIMRA fiscalisation built in, with its own verification stage against the authority\u2019s test environment.'),
      ],
    },
    decisions: {
      facts: [
        f('Modules in the source tree: membership, credentials and cards, member accounts, POS and cashiering, food and beverage, pro shop, golf and tournaments, inventory, procurement, finance, fiscalisation, identity and audit.'),
        f('The pro shop is not a separate shop system: it sells through the shared POS, product and stock model, with member pricing applied the same way in search and at sale.'),
        f('A food and beverage bill and a member-account charge both complete through the same shared sale, so stock is consumed in exactly one place and a retry cannot charge a member twice.'),
      ],
    },
    challenges: {
      body: 'The design has to keep member accounts, sales, inventory and finance consistent while allowing each module to evolve. The repository separates those concerns inside a modular application and records testing as a distinct stage before production readiness.',
    },
    results: {
      facts: [
        f('The repository records automated domain, application, API and PostgreSQL integration test suites, with browser testing using Playwright.'),
        f('The reviewed delivery stage is feature-complete with final QA still pending; no production deployment is claimed.'),
      ],
      awaiting: ['Delivery date or first site, if publishable.'],
    },
    stack: [
      { name: 'ASP.NET Core, .NET 10', evidence: 'inspected' },
      { name: 'Entity Framework Core', evidence: 'inspected' },
      { name: 'PostgreSQL', evidence: 'inspected' },
      { name: 'React + TypeScript', evidence: 'inspected' },
      { name: 'WebView2', evidence: 'inspected' },
      { name: 'xUnit, Playwright', evidence: 'inspected' },
    ],
    links: [{ label: 'fiscalstack.co.zw', href: places.fiscalstackZw, kind: 'company' }],
    plates: [
      { src: img('illustrations/clubstack-card.png'), alt: 'Dithered illustration of a blank membership card with a punched slot and a magnetic stripe.', caption: 'Illustration, not a screenshot. A member card, unissued.', nature: 'illustration', width: 480, height: 300 },
      { alt: 'Reserved plate: ClubStack member account or cashier screen.', caption: 'Member account or cashier screen.', nature: 'awaiting' },
    ],
    related: ['fiscalstack-restaurant', 'fiscalstack-engine', 'chaos-cup'],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: 'edustack',
    item: 7,
    name: 'EduStack',
    parent: 'fiscalstack',
    kind: 'commercial',
    mechanisms: ['A', 'B', 'F'],
    status: 'live',
    statusEvidence: 'verified',
    summary: 'A multi-tenant school platform with separate workspaces for school staff, teachers, students and parents. Each school gets its own colours, name and logo; the archive has checked the boundaries, not the adoption figures.',
    accent: 'ink',
    role: { body: 'Product and engineering, under FiscalStack Solutions.' },
    problem: {
      body: 'One school platform has to answer a different question for each person who enters it. Administrators need the school records; teachers need their assigned classes; students need their own attendance and published results; parents need a view of their child. EduStack puts those roles in separate workspaces and gives each school its own identity within a shared platform.',
    },
    constraints: {
      facts: [
        f('The project documentation and role-specific pages describe a platform administrator, school administrator, teacher, student and parent workspace.'),
        f('School branding uses tenant configuration for the school name, colours and logo.'),
      ],
    },
    architecture: {
      body: 'The reviewed checkout is a lightweight front end: vanilla JavaScript modules, HTML and CSS, without a bundler. Its docs describe Supabase Auth, PostgreSQL row-level security and Edge Functions; the current client also contains a custom API adapter, so this sheet does not claim the backend wiring is verified.',
      facts: [
        v('The public portal titled "EduStack | FiscalStack Solutions" was reachable at edustack.co.zw on 25 October 2026.'),
        f('School-admin pages cover academics, students, staff, announcements, report cards, timetable and finance.'),
        f('Teacher assignments are queried in the context of both the school and the teacher account.'),
        f('Student pages read the linked profile, enrolment, attendance, results and announcements; assessment results are filtered to those marked published.'),
        f('A platform-admin area includes tenant onboarding and platform metrics.'),
      ],
    },
    decisions: {
      body: 'The visible design separates school staff, teachers, students and parents by role, and carries the tenant identity into the interface. The documentation describes a database-backed tenancy model; the reviewed source snapshot does not contain its server implementation, so the data boundary remains a design claim rather than an independently validated guarantee.',
    },
    challenges: {
      body: 'The evidence file has two layers: working role-specific pages in the checkout, and documentation for backend services that are not present in the same snapshot. The sensible finding is to report the workflows that can be inspected and leave production behaviour unclaimed.',
    },
    results: {
      body: 'The subject reports a live sign-in portal. The checkout supports describing the front-end workflows, but does not establish school adoption or end-to-end production readiness.',
    },
    stack: [
      { name: 'HTML, CSS, vanilla JavaScript modules', evidence: 'inspected' },
      { name: 'Supabase Auth, PostgreSQL and RLS (documented)', evidence: 'stated' },
      { name: 'Supabase Edge Functions (documented)', evidence: 'stated' },
      { name: 'Static hosting', evidence: 'inspected' },
    ],
    links: [{ label: 'edustack.co.zw', href: places.edustack, kind: 'product' }],
    plates: [{ alt: 'Reserved plate: EduStack interface.', caption: 'Interface to follow.', nature: 'awaiting' }],
    related: ['clubstack', 'zivvvo', 'brain-bunchy'],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: 'supporta',
    item: 8,
    name: 'Supporta',
    kind: 'engineering',
    mechanisms: ['B'],
    status: 'prototype',
    statusEvidence: 'stated',
    summary: 'An early-stage support platform, with the scaffold in place and the actual service still to be built. The file is open; the evidence is not yet a product.',
    accent: 'ink',
    role: { body: 'The subject identifies Supporta as an experimental project. The inspected repository is an application scaffold rather than a finished service.' },
    problem: {
      body: 'Supporta is presented as a way to support people creating work others value. The repository currently establishes the technical starting point, not the full product workflow or a functioning payment service.',
    },
    constraints: {
      facts: [s('The project is experimental and should not be mistaken for an operating financial service.')],
    },
    architecture: {
      body: 'The scaffold declares a web application with authentication, database, audit and settlement as planned areas. Those directory names are an outline, not proof that the flows have been implemented.',
    },
    decisions: {
      facts: [f('The package manifest declares Next.js 14, React 18, TypeScript, NextAuth, Drizzle ORM, PostgreSQL, Zod, Jest and Tailwind CSS.')],
    },
    challenges: {
      body: 'At the inspected revision, the app routes, components, data layer and tests are not present. There is not yet enough implementation to describe how a payment, settlement or support flow works.',
    },
    results: { body: 'The repository is a scaffold. The subject has supplied supporta.co.zw as the intended public address; a live product or completed deployment was not established from the checked files.' },
    stack: [
      { name: 'Next.js 14, React 18, TypeScript', evidence: 'inspected' },
      { name: 'NextAuth, Zod', evidence: 'inspected' },
      { name: 'Drizzle ORM, PostgreSQL', evidence: 'inspected' },
      { name: 'Tailwind CSS, Jest', evidence: 'inspected' },
    ],
    links: [{ label: 'supporta.co.zw', href: places.supporta, kind: 'product' }],
    plates: [],
    related: ['fiscalstack-web', 'clubstack'],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: 'chaos-verify',
    item: 9,
    name: 'Chaos-Verify',
    parent: 'chaos-cup',
    kind: 'qa',
    mechanisms: ['D', 'B'],
    status: 'live',
    statusEvidence: 'stated',
    summary: 'A QR verification feature in the Chaos Cup event site, built for the check-in workflow. Event-day operation and validation rules are not claimed here.',
    accent: 'signal',
    role: { body: 'Built by the subject as part of the Chaos Cup software, which he wrote in full.' },
    problem: {
      body: 'The event site includes a /verify section for checking Chaos Cup entries. The feature is documented as part of the event software; the reviewed material does not establish its on-site operating process.',
      facts: [s('Chaos-Verify is the QR code checking system of the Chaos Cup, found at the /verify section of the event website.')],
      awaiting: ['What the QR codes are issued for (tickets, entries, results), and what a scan returns.'],
    },
    constraints: { awaiting: ['Event-day constraints: phones at the gate, venue connectivity.'] },
    architecture: { awaiting: ['How a code is checked and what it is checked against.'] },
    decisions: { awaiting: ['How duplicate or reused codes are handled.'] },
    challenges: { awaiting: ['What happened on the day.'] },
    results: { awaiting: ['Anything publishable: codes scanned, queues avoided.'] },
    stack: [],
    links: [{ label: 'chaoscup.co.zw', href: places.chaosCup, kind: 'product' }],
    plates: [],
    related: ['chaos-cup', 'clubstack'],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: 'cricket-odi-prediction',
    item: 10,
    name: 'Real-time ODI outcome prediction',
    kind: 'research',
    mechanisms: ['C'],
    status: 'completed',
    statusEvidence: 'stated',
    summary: 'A dissertation project on estimating One Day International match outcomes as the match unfolds, using ball-by-ball data.',
    accent: 'cobalt',
    role: { body: 'Sole researcher, BSc Honours in Data Science and Systems, University of Zimbabwe.' },
    problem: {
      body: 'A pre-match prediction misses the changing state of a match. The research asks how an outcome estimate should update ball by ball as wickets fall, overs pass and the required rate changes.',
      awaiting: ['Confirm exact title against the submitted dissertation.'],
    },
    constraints: {
      facts: [
        s('Time-series, ball-by-ball match data.'),
        s('Predictions may use only information available at that point in the match.'),
      ],
    },
    architecture: {
      facts: [
        s('Feature engineering on match state.'),
        s('A hybrid of Bayesian methods and machine learning for probability estimation.'),
        s('Model evaluation as part of the study.'),
      ],
      awaiting: ['Data source, model names, evaluation metrics.'],
    },
    decisions: { awaiting: ['Why a hybrid approach rather than a single model.'] },
    challenges: { awaiting: ['Leakage, calibration, class balance: whichever actually bit.'] },
    results: {
      body: 'This is academic research, not a deployed product. Performance figures are omitted until they can be checked against the submitted dissertation.',
      awaiting: ['Findings and metrics from the final dissertation.', 'PDF or abstract to link.'],
    },
    stack: [
      { name: 'Python', evidence: 'stated' },
      { name: 'pandas', evidence: 'stated' },
      { name: 'scikit-learn', evidence: 'stated' },
    ],
    links: [],
    plates: [
      { src: img('illustrations/cricket-ball.png'), alt: 'Dithered, low-resolution rendering of a cricket ball with its seam, lit from the upper left.', caption: 'Illustration rendered for this study, in the manner of 1980s computer graphics. No data was harmed.', nature: 'illustration', width: 480, height: 300 },
    ],
    related: ['zivvvo', 'brain-bunchy'],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: 'stacked',
    item: 11,
    name: 'STACKED',
    kind: 'game',
    mechanisms: ['E'],
    status: 'live',
    statusEvidence: 'verified',
    summary: 'Drop blocks. Chain perfects. Find out exactly how good your timing is, in front of a global leaderboard.',
    accent: 'signal',
    role: { awaiting: ['Role.'] },
    problem: {
      body: 'Every stacking game makes the same promise: one more go and you will beat it. STACKED keeps the promise small and the timing precise: the whole game is the gap between a perfect drop and an almost.',
      facts: [
        v(`A precision arcade stacking game: drop blocks, chain perfects and climb a global leaderboard.`),
        v('Built as a mobile web app, set up to run full-screen on phones.'),
      ],
      awaiting: ['Controls and scoring, in your words.'],
    },
    constraints: { awaiting: ['Platform and engine.'] },
    architecture: { awaiting: ['Implementation, and how the global leaderboard is stored.'] },
    decisions: { awaiting: ['A design decision that changed how it plays.'] },
    challenges: { awaiting: ['Something that was hard to get right.'] },
    results: { awaiting: ['Anything publishable about players or the leaderboard.'] },
    stack: [],
    links: [{ label: 'Play STACKED', href: places.stacked, kind: 'product' }],
    plates: [
      { src: img('illustrations/stacked-cover.png'), alt: 'Dithered cover-style illustration of a leaning tower of slabs.', caption: 'Cover illustration made for this study. Not a game capture.', nature: 'illustration', width: 480, height: 300 },
    ],
    related: ['speed-roulette', 'typerace'],
    experiment: { playable: 'playable', tagline: 'How high can you go? Lower than you think, the first ten times.' },
  },

  /* ------------------------------------------------------------------ */
  {
    slug: 'speed-roulette',
    item: 12,
    name: 'Reaction Speed Roulette',
    kind: 'game',
    mechanisms: ['E'],
    status: 'live',
    statusEvidence: 'verified',
    summary: 'Wait for green. Hit it. Five times. The average goes on a public leaderboard, which is either motivating or humbling.',
    accent: 'signal',
    role: { awaiting: ['Role.'] },
    problem: {
      body: 'Reaction tests are usually a single click and a number nobody remembers. This one is a round of five, averaged, so one lucky twitch cannot save you. Then it adds everything that brings people back: a leaderboard, levels, streaks, a daily challenge and a chatroom to complain in.',
      facts: [
        v(`A browser reaction-time game: tap or press space to arm, then hit green as fast as you can.`),
        v('Five games make a round; the round score is their average. Best average, rounds played and a form guide are kept.'),
        v('A leaderboard and a \u201chall of speed\u201d, levels, XP and streaks, and a daily challenge of three reactions under 300 ms.'),
        v('A chatroom, a players-online count, share cards and instant rematch; sound and light or dark themes; TypeRace linked from the menu.'),
      ],
      awaiting: ['How the timing is measured and how cheating is handled.'],
    },
    constraints: { awaiting: ['Platform and engine.'] },
    architecture: { awaiting: ['Implementation: realtime chat and online count, leaderboard storage.'] },
    decisions: { awaiting: ['Why rounds of five, and why averages rather than a best single time.'] },
    challenges: { awaiting: ['Something hard, e.g. timing accuracy across devices.'] },
    results: { awaiting: ['Anything publishable about players or the leaderboard.'] },
    stack: [],
    links: [{ label: 'Play Reaction Speed Roulette', href: places.speedRoulette, kind: 'product' }],
    plates: [
      { src: img('illustrations/roulette-cover.png'), alt: 'Dithered cover-style illustration of a roulette wheel seen from above, with a ball near the rim.', caption: 'Cover illustration made for this study. Not a game capture.', nature: 'illustration', width: 480, height: 300 },
    ],
    related: ['stacked', 'typerace'],
    experiment: { playable: 'playable', tagline: 'Tap to arm, then hit green. Five times. The leaderboard accepts no excuses.' },
  },

  /* ------------------------------------------------------------------ */
  {
    slug: 'typerace',
    item: 15,
    name: 'TypeRace',
    kind: 'game',
    mechanisms: ['E'],
    status: 'live',
    statusEvidence: 'verified',
    summary: 'A typing test that thinks it is a street race. Words per minute, nitro on Tab, and a grid position that has to be earned.',
    accent: 'signal',
    role: { awaiting: ['Role.'] },
    problem: {
      body: 'Typing tests are good for you in the way vegetables are. TypeRace wraps the same thing, a passage and a stopwatch, in a night-time grand prix: typing is speed, accuracy keeps the car on the road, and there is a nitro button for the moment the driver fancies their chances.',
      facts: [
        v(`A typing race subtitled \u201cNeon City GP\u201d, linked from the Reaction Speed Roulette menu.`),
        v('Live race position, time, words per minute, accuracy and a combo counter while typing; Tab fires one of three nitro boosts.'),
        v('Three difficulties: rookie, pro and demon. Solo practice, or a race room where the host gives everyone the same passage and starts the race for all.'),
        v('Results show time, top speed, average, accuracy, best combo and nitro used, with a rating change and personal-best tracking.'),
      ],
      awaiting: ['Who or what the other cars are in solo practice.', 'How multiplayer rooms are synchronised.'],
    },
    constraints: { awaiting: ['Platform and engine.'] },
    architecture: { awaiting: ['How race rooms stay in sync; how the rating is calculated.'] },
    decisions: { awaiting: ['Why a race instead of a plain typing test; how nitro is balanced.'] },
    challenges: { awaiting: ['Something hard, e.g. keeping several typists in sync.'] },
    results: { awaiting: ['Anything publishable about races run or players.'] },
    stack: [],
    links: [{ label: 'Play TypeRace', href: places.typeRace, kind: 'product' }],
    plates: [
      { src: img('illustrations/typerace-cover.png'), alt: 'Dithered cover-style illustration of a low race car crossing a row of keyboard keys.', caption: 'Cover illustration made for this study. Not a game capture.', nature: 'illustration', width: 480, height: 300 },
    ],
    related: ['speed-roulette', 'stacked'],
    experiment: { playable: 'playable', tagline: 'Neon City GP. The fingers are the engine; Tab is the nitro.' },
  },

  /* ------------------------------------------------------------------ */
  {
    slug: 'brain-bunchy',
    item: 13,
    name: 'Brain Bunchy Consultancy',
    kind: 'education',
    mechanisms: ['F', 'A'],
    status: 'operating',
    statusEvidence: 'stated',
    summary: 'School quiz tournaments, debate programmes and adjudication, alongside training and educational events.',
    accent: 'chartreuse',
    role: {
      body: 'Part-time co-owner involved in operations, quizmastering, adjudication, training and event organisation. He also accompanied winning students to Botswana as their patron.',
    },
    problem: {
      body: 'School competitions depend on clear questions, consistent scoring and steady event facilitation. The work combines preparation, adjudication and coordination with schools and participants.',
    },
    constraints: {
      facts: [
        s('School quiz tournaments and educational events.'),
        s('Debate and drama programmes, training and adjudication.'),
      ],
    },
    architecture: { body: 'No software architecture here. The machinery is people, schedules and a quizmaster who cannot afford to mark a correct answer wrong.' },
    decisions: { awaiting: ['Optional: a format or process you changed.'] },
    challenges: { awaiting: ['Optional: a difficult adjudication or event.'] },
    results: { awaiting: ['Exact legal company name and dates.', 'Optional photographs from events, with permission of anyone identifiable (minors especially).'] },
    stack: [],
    links: [],
    plates: [{ alt: 'Reserved plate: photograph from a Brain Bunchy event, used with permission.', caption: 'Event photograph to follow.', nature: 'awaiting' }],
    related: ['cricket-odi-prediction', 'zivvvo', 'chaos-cup'],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: 'chaos-cup',
    item: 14,
    name: 'Chaos Cup',
    kind: 'engineering',
    mechanisms: ['B', 'E', 'F'],
    status: 'live',
    statusEvidence: 'verified',
    summary: 'An adult field day in Harare, co-hosted by the subject and supported by event software for tickets, results, a Hall of Fame and QR verification.',
    accent: 'signal',
    role: {
      facts: [
        s('Co-host of the Chaos Cup.'),
        s('Wrote all of the event\u2019s software, including the /verify section (Chaos-Verify).'),
      ],
    },
    problem: {
      body: 'The event needs a clear path from ticket information to check-in, published results and a record of winners. As co-host and developer, the subject worked across both event operations and the supporting site.',
      facts: [
        v('Event site for the Chaos Cup Adult Field Day, 26 September 2026, at the Botanical Gardens, Harare.'),
        v('Sections for tickets and results and a Hall of Fame, with an admin area for organisers.'),
      ],
    },
    constraints: { awaiting: ['Event-day constraints: phones at the gate, connectivity at the venue, how results were entered.'] },
    architecture: { awaiting: ['Stack and hosting; how tickets and results are stored; what the admin area does.'] },
    decisions: { awaiting: ['A decision you made for event day.'] },
    challenges: { awaiting: ['What happened on the day.'] },
    results: { awaiting: ['Anything publishable: attendance, tickets issued, events run.'] },
    stack: [],
    links: [{ label: 'chaoscup.co.zw', href: places.chaosCup, kind: 'product' }],
    plates: [{ alt: 'Reserved plate: Chaos Cup site or event photograph.', caption: 'Site screenshot or event photograph to follow.', nature: 'awaiting' }],
    related: ['chaos-verify', 'brain-bunchy', 'clubstack'],
  },
  /* ------------------------------------------------------------------ */
  {
    slug: 'fiscalstack-fieldpos',
    item: 18,
    name: 'FiscalStack FieldPOS',
    parent: 'fiscalstack',
    kind: 'commercial',
    mechanisms: ['A', 'B'],
    status: 'in-development',
    statusEvidence: 'inspected',
    summary: 'FiscalStack away from the counter: a mobile POS with sales, inventory, reporting and ticketing screens, plus a separate desktop client. The source shows the surfaces; deployment is not assumed.',
    accent: 'ink',
    role: { body: 'Product development under FiscalStack Solutions, as reported by the subject.' },
    problem: {
      body: 'Not every sale happens at a counter. FieldPOS explores a mobile point of sale for work away from the fixed till, with code for sales and bus-ticketing workflows as well as inventory, customers, suppliers, expenses and reports.',
      facts: [
        f('The mobile package is an Expo and React Native application.'),
        f('The repository also contains a separate Electron desktop POS package with Windows and Linux build scripts.'),
      ],
    },
    constraints: {
      body: 'The mobile and desktop clients are separate packages. The reviewed source does not establish a production deployment or prove that every screen is connected to the same fiscal workflow as the Windows till.',
    },
    architecture: {
      facts: [
        f('The mobile app uses Expo and React Native; the web and API platform is a separate package in the repository.'),
        f('The desktop POS uses Electron and includes serial-port support.'),
        f('The mobile README describes shared sign-in/backend dependencies and local pause/resume state; transport-route integration is listed as future work.'),
      ],
    },
    decisions: {
      body: 'The codebase keeps the mobile client distinct from its Electron desktop counterpart. The product surface is being explored across devices rather than presented as one finished, interchangeable client.',
    },
    challenges: {
      body: 'The public record stops at what the checked files show: screens and packaging for multiple clients. Device support, fiscalisation behaviour, offline guarantees and operational use need separate evidence before they belong in the catalogue.',
    },
    results: { body: 'The repository contains active product code and platform build configuration. This sheet does not claim a live rollout or customer adoption.' },
    stack: [
      { name: 'Expo, React Native, TypeScript', evidence: 'inspected' },
      { name: 'Electron, React, TypeScript', evidence: 'inspected' },
      { name: 'Node.js, Express', evidence: 'inspected' },
      { name: 'PostgreSQL, Drizzle ORM', evidence: 'inspected' },
      { name: 'Supabase client libraries', evidence: 'inspected' },
    ],
    links: [{ label: 'fiscalstack.co.zw', href: places.fiscalstackZw, kind: 'company' }],
    plates: [{ alt: 'Reserved plate: FieldPOS on an Android phone.', caption: 'FieldPOS on a phone.', nature: 'awaiting' }],
    related: ['fiscalstack-retail', 'fiscalstack-engine', 'fiscalstack-web', 'fiscalstack'],
  },
  {
    slug: 'fiscalstack-web',
    item: 19,
    name: 'FiscalStack Web',
    parent: 'fiscalstack',
    kind: 'commercial',
    mechanisms: ['A', 'B', 'D'],
    status: 'in-development',
    statusEvidence: 'inspected',
    summary: 'A broad business platform with routes for invoicing, inventory, purchasing, manufacturing, accounting, reports, point of sale and bus ticketing. One menu; several industries.',
    accent: 'cobalt',
    role: { body: 'Product engineering under FiscalStack Solutions, as reported by the subject.' },
    problem: {
      body: 'A business platform is asked to be several things at once: write an invoice, keep stock, record a purchase, account for the money and answer the question the owner asks at month end. The web application brings those workflows into one product, with additional screens for point of sale and transport ticketing.',
    },
    constraints: {
      facts: [
        f('A shared permission catalog defines owner, administrator, cashier, accountant and manager roles, with navigation and action permissions.'),
        f('The codebase separates the browser client, server, shared data definitions and mobile/desktop packages.'),
      ],
    },
    architecture: {
      facts: [
        f('The web client uses React, TypeScript and Vite.'),
        f('The API is built with Node.js and Express; PostgreSQL persistence is accessed through Drizzle ORM.'),
        f('The repository includes separate Expo/React Native mobile and Electron desktop POS clients, described on the FieldPOS sheet.'),
      ],
    },
    decisions: {
      body: 'The application groups a wide set of business workflows behind shared roles and a common data layer. The permission catalog is the map; it is not, by itself, proof that every route or deployment has been independently security-reviewed.',
    },
    challenges: {
      body: 'The visible scope crosses accounts, stock, sales, manufacturing and transport. Keeping each workflow legible while reusing the same user and permission model is the engineering problem recorded in the source.',
    },
    results: {
      body: 'The repository contains client routes, API code, shared permission definitions and client packages. This sheet describes the implementation surface, not a verified production rollout or customer count.',
    },
    stack: [
      { name: 'React, TypeScript, Vite', evidence: 'inspected' },
      { name: 'Node.js, Express', evidence: 'inspected' },
      { name: 'PostgreSQL, Drizzle ORM', evidence: 'inspected' },
      { name: 'Supabase client libraries', evidence: 'inspected' },
    ],
    links: [{ label: 'FiscalStack Solutions', href: places.fiscalstackZw, kind: 'company' }],
    plates: [],
    related: ['fiscalstack', 'fiscalstack-fieldpos', 'fiscalstack-engine', 'fiscalstack-retail'],
  },
  {
    slug: 'the-interrogation',
    item: 20,
    name: 'The Interrogation',
    kind: 'game',
    mechanisms: ['E', 'B'],
    status: 'prototype',
    statusEvidence: 'stated',
    summary: 'A browser mystery in which the evidence is in what people say, what they omit and which version of events survives a second reading.',
    accent: 'signal',
    role: { body: 'An experimental project the subject is still developing, as reported by the subject.' },
    problem: {
      body: 'The player chooses a case, interviews its characters, reads the transcripts and decides who to accuse. The mystery is deterministic: the case has a solution, and a hunch is not the same thing as evidence.',
    },
    constraints: {
      facts: [
        f('The project brief describes deterministic cases, clue collection, contradiction checking and an accusation flow.'),
        f('The current public build offers case selection, character panels, transcripts and a reveal.'),
      ],
    },
    architecture: {
      body: 'A static browser application, packaged as a progressive web app. It can be hosted as files; the current build labels itself as a test build.',
    },
    decisions: {
      body: 'The player has to build a theory from interviews instead of waiting for a narrator to underline the answer. The current cases are test material, not a daily mystery service.',
    },
    challenges: {
      body: 'A deterministic mystery must make its evidence readable without making the answer obvious. The experiment is still being tuned; this file records a prototype, not a polished release.',
    },
    results: {
      body: 'The public page is explicitly marked as a test build. It remains an experiment while the case design and investigative loop are being worked out.',
    },
    stack: [
      { name: 'Preact, TypeScript', evidence: 'inspected' },
      { name: 'Vite', evidence: 'inspected' },
      { name: 'Progressive Web App plugin', evidence: 'inspected' },
      { name: 'Static client-side deployment', evidence: 'inspected' },
    ],
    links: [{ label: 'Open The Interrogation test build', href: places.interrogation, kind: 'product' }],
    plates: [],
    related: ['crazy-eights', 'stacked'],
    experiment: { playable: 'prototype', tagline: 'Interview first. Accuse only after the stories stop agreeing.' },
  },
  {
    slug: 'tee-and-co',
    item: 21,
    name: 'Tee & Co.',
    kind: 'engineering',
    mechanisms: ['B', 'E'],
    status: 'live',
    statusEvidence: 'stated',
    summary: 'A static website for an accounting and advisory firm: service information, clear routes for different audiences and an address book that does not make a visitor work for it.',
    accent: 'chartreuse',
    role: { body: 'Designed and built the company website, as reported by the subject.' },
    problem: {
      body: 'Professional services are easier to consider when the offer is clear. Tee & Co. needed a public site to explain its accounting, tax and advisory services and give prospective clients a straightforward way to find the relevant information.',
    },
    constraints: {
      facts: [
        f('The site is delivered as static HTML, CSS and JavaScript.'),
        f('The page structure includes service descriptions, audience-specific pages, contact information and knowledge/insights sections.'),
      ],
    },
    architecture: {
      body: 'A lightweight static site, with no application server in the project architecture. The build is mostly markup, styles and browser-side JavaScript; the content does the heavier lifting.',
    },
    decisions: {
      body: 'The presentation is organized around services and the people looking for them rather than around the machinery used to build the site.',
    },
    challenges: {
      body: 'The work is chiefly editorial and structural: make a broad set of services easy to scan, give different audiences a useful starting point, and keep the site deliberately simple to serve.',
    },
    results: { body: 'A live-facing company website, with deployment reported by the subject.' },
    stack: [
      { name: 'HTML', evidence: 'inspected' },
      { name: 'CSS', evidence: 'inspected' },
      { name: 'JavaScript', evidence: 'inspected' },
      { name: 'Static-site deployment', evidence: 'stated' },
    ],
    links: [{ label: 'Visit Tee & Co.', href: places.teeCo, kind: 'product' }],
    plates: [],
    related: ['fiscalstack-web', 'the-interrogation'],
  },
  {
    slug: 'crazy-eights',
    item: 22,
    name: 'Crazy Eights Arcade',
    kind: 'game',
    mechanisms: ['E', 'B'],
    status: 'prototype',
    statusEvidence: 'stated',
    summary: 'A card table for one or more: play against local AI, or invite people to a private online game. Still experimental; the table is being dealt, not declared tournament-ready.',
    accent: 'signal',
    role: { body: 'An experimental game project the subject is preparing for publication, as reported by the subject.' },
    problem: {
      body: 'A familiar card game is a compact test of state, turn order and hidden information. Crazy Eights Arcade pairs solo play against AI opponents with an optional invite-based multiplayer table.',
    },
    constraints: {
      facts: [
        f('The project documentation describes mobile-first play, solo AI opponents and optional online private tables.'),
        f('Online games support invite links and mixed human/AI lobbies.'),
      ],
    },
    architecture: {
      body: 'The client is built with React, TypeScript and Vite. Online sessions use Supabase database and Edge Function components; local solo play does not require the online backend.',
    },
    decisions: {
      body: 'Solo play stays available without a backend, while the online table is an optional mode. The game rules and server-side actions keep the shared table from becoming a shared trust exercise.',
    },
    challenges: {
      body: 'Multiplayer means controlling who can see private hands and who can change the game state. The repository includes database policies and server-side functions for those boundaries; online deployment still requires its Supabase setup.',
    },
    results: {
      body: 'The repository describes a deployment-ready experiment, but no public deployment is claimed here. The subject plans to publish it at timire.co.zw/crazy-eights.',
    },
    stack: [
      { name: 'React, TypeScript, Vite', evidence: 'inspected' },
      { name: 'Supabase client, database and Edge Functions', evidence: 'inspected' },
    ],
    links: [{ label: 'Planned Crazy Eights route', href: places.crazyEights, kind: 'other' }],
    plates: [],
    related: ['the-interrogation', 'stacked', 'speed-roulette'],
    experiment: { playable: 'prototype', tagline: 'A private table, a local opponent and one more card to get rid of.' },
  },
]

/** Every record, including sheets held back from publication. */
export const allProjects = allProjectRecords

/** What the published site shows. A sheet is held back with `hidden: true`. */
export const projects: Project[] = allProjectRecords.filter((p) => !p.hidden)

export function projectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug)
}

export function projectsForMechanism(id: string) {
  return projects.filter((p) => p.mechanisms.includes(id as Project['mechanisms'][number]))
}

export const kindLabels: Record<Project['kind'], string> = {
  commercial: 'Commercial product',
  engineering: 'Software engineering',
  research: 'Data science and research',
  qa: 'QA and verification',
  game: 'Games and experiments',
  education: 'Education and business',
}

export const statusLabels: Record<Project['status'], string> = {
  operating: 'Operating',
  built: 'Built',
  'in-development': 'In development',
  live: 'Live online',
  prototype: 'Prototype',
  completed: 'Completed',
  unconfirmed: 'Status to be confirmed',
}
