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
 * Anything still needed goes in `awaiting` (shown in dev builds only; listed
 * in docs/CONTENT_TODO.md).
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
    summary: 'The subject\u2019s company. Software that makes tills issue valid fiscal receipts, keeps the books honest, and does not fall over when the power does.',
    accent: 'ink',
    role: {
      body: 'Founder and Managing Director, and, on the evidence of the source trees, the person writing most of the code. The role as he describes it covers product decisions, architecture, Windows and web development, fiscalisation and API integration, testing, deployment, onboarding customers, and answering the phone when something breaks.',
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
      body: 'FiscalStack is a trading business with products in use. This study does not print customer counts; figures like that go stale the week they are published. The engineering is the evidence, and it is on the sheets that follow.',
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
    related: ['fiscalstack-engine', 'fiscalstack-retail', 'fiscalstack-restaurant', 'fiscalstack-fieldpos', 'fiscalstack-lesotho', 'fiscalstack-integrations', 'clubstack', 'edustack'],
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
    summary: 'The till. Ring it up, fiscalise it, move the stock, and do it before the queue starts sighing. Keeps selling with the internet gone.',
    accent: 'ink',
    role: {
      body: 'Product owner and developer. The project\u2019s own product description records his requirements as hard rules, and they read like someone who has stood behind a counter: the only difference between test and production must be the server address; tax rates come from the product list and are never typed twice; the end-of-day button says \u201cClose Day\u201d; and receipt counters must be secured so that \u201cthey can never be spoilt\u201d.',
    },
    problem: {
      body: 'A retail till does several jobs at once: ring up a basket quickly, produce a fiscal receipt the authority accepts, move stock, and leave a trail the back office can reconcile. In a shop, the queue is the specification. If the software makes the cashier wait, nobody cares how elegant the data model is, least of all the customer holding a loaf of bread and a grudge.',
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
        f('Test and production are told apart by the authority\u2019s server address alone; the matching tax identifiers follow automatically, so nobody edits configuration by hand to go live.'),
        f('Receipt counters are guarded so they can only move forward, with an audit trail and automatic correction of damaged values.'),
        f('A rejection from the authority is shown to the cashier as the real error and does not advance the day; a transport failure drops the till into offline mode instead.'),
        f('Credit and debit notes need a supervisor\u2019s approval and a lookup of the original invoice.'),
      ],
    },
    challenges: {
      body: 'The project notes keep an unusually candid list of what was fixed and what remains. Examples from the fixed column: an onboarding step that could wipe every user rather than only the seeded defaults; a database counter routine that could be fed unexpected input; a status check that could hang forever if the engine stalled; a till that could be opened twice. The remaining items are recorded as low severity and owned, not hidden.',
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
      body: 'The files keep a plain list of what the reference system does that this one does not do yet, ranked by priority. At the top: per-item printer routing, a customer-facing display, and refunds on settled restaurant bills. Further down: multi-terminal operation, department and delivery routing, and an automation rules engine. Keeping that list in the repository instead of in someone\u2019s head is a decision in itself.',
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
        s('Client details and credentials stay confidential.'),
      ],
    },
    architecture: {
      body: 'Two integration patterns appear in the files.',
      facts: [
        f('A plug-in module that turns a widely used Windows point-of-sale application into a ZIMRA fiscal device without recompiling it. It fiscalises each sale before the host saves it, so nothing is stored that the authority has not accepted (a fiscal failure aborts the sale, configurably), and it takes over the host\u2019s fiscal-printer service for end-of-day reports and reprints while still delegating to the host\u2019s own receipt layout.'),
        f('Installed and removed by script, with the host\u2019s original workflow file backed up first, so the host can be put back exactly as it was.'),
        f('The September 2026 specification for a fiscal print driver describes a stand-alone Windows application intended to accept A4 invoices from billing software, fiscalise them, print the fiscalised copy and keep a local journal for submission.'),
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
    summary: 'The part nobody sees and everybody depends on. Counters, signatures, certificates and the fiscal day, packaged as one library every FiscalStack product calls.',
    accent: 'cobalt',
    role: { body: 'Designed and built by the subject as the shared core of the product line.' },
    problem: {
      body: 'Every till, integration and driver FiscalStack sells has to say exactly the same thing to the tax authority, in exactly the same order, with counters that never repeat and signatures that always verify. Writing that logic once, and refusing to write it twice, is what makes the rest of the product line possible.',
    },
    constraints: {
      facts: [
        f('Runs server-to-server against the authority\u2019s API; no separate fiscal hardware box is needed at the till.'),
        f('Must keep counting and signing correctly while offline, and reconcile cleanly when the connection returns.'),
      ],
    },
    architecture: {
      facts: [
        f('A .NET class library exposing the fiscal device operations: configuration, status, open day, submit receipt, submit a batch file, close day.'),
        f('Local SQLite database for receipt counters, the global receipt number, fiscal day numbers and hashes, queued transactions and per-day tax summaries.'),
        f('Issues and manages the X.509 certificate chain the device needs, and signs receipts and day-close payloads.'),
        f('Every call returns the same small JSON envelope (success flag, message, payload), so callers in different products handle results the same way.'),
        f('Licensing verified on the device itself, with a grace period for sites that stay offline.'),
      ],
    },
    decisions: { body: 'One engine, many front ends. The retail POS, the restaurant POS, the Lesotho edition, the third-party POS module and the print driver all call this library rather than carrying their own copy of the fiscal rules.' },
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
      body: 'People preparing for the VID provisional licence theory test mostly study on a phone, on data that is expensive when it exists. A study tool that needs a connection for every question stops working exactly when there are twenty minutes to kill. Zivvvo keeps the practice loop on the device, explains every answer, and steers the learner back towards the road signs they keep insisting mean something else.',
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
      body: 'Product owner, architect and developer. The repository is the most disciplined thing in this study: nine numbered specification phases before the first line of code, then numbered delivery stages, each closed by a written report that has to prove its claims. The coding is done with AI agents working to his specifications, and his hand-over instructions to them are explicit: never invent product rules, never claim a test passed without running it, never call a failure \u201cpre-existing\u201d without evidence.',
    },
    problem: {
      body: 'A club runs on members. Members have accounts and cards; the bar, the restaurant and the pro shop charge to those accounts; subscriptions fall due; the tee sheet fills; and somebody at the gate needs to know who is a member and who is merely confident. Most clubs hold this together with several disconnected systems and a cashier\u2019s memory. ClubStack\u2019s product bible states the opposite principle first: one system, not many.',
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
      body: 'The stage reports read like an audit trail. One records an earlier version of a stage instruction as \u201cunauthorized\u201d and replaced. Another stops work and files a \u201cblocked\u201d report rather than guess at an unresolved rule. A third notes, against its own earlier claim, that a set of \u201crace-safety\u201d tests were state-machine tests and not true concurrency tests, and sends the work back until real concurrent tests exist.',
    },
    results: {
      facts: [
        f('Stage D11 (pro shop) recorded as feature-complete with QA pending, 15 October 2026: domain tests 391/391, application 87/87, API 304/304, integration against real PostgreSQL databases 334/335, with the one failure identified and recorded as unrelated.'),
        f('Browser-level tests with Playwright, and a dedicated full-system QA stage scheduled before production readiness.'),
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
    summary: 'School management for one platform and many schools, each pretending the others do not exist. Live behind a sign-in at edustack.co.zw.',
    accent: 'ink',
    role: { body: 'Product and engineering, under FiscalStack Solutions.' },
    problem: {
      body: 'Schools run on a mixture of spreadsheets, paper and goodwill, and the goodwill is doing most of the work. EduStack is multi-tenant school-management software: one platform serving many schools, where each school sees only its own administrators, teachers, students and parents, and a parent sees only their own child.',
    },
    constraints: {
      facts: [
        s('Multi-tenant: school data must stay separate.'),
        s('Roles: platform administrator, school administrator, teacher, student, parent.'),
      ],
    },
    architecture: {
      facts: [v('A sign-in portal titled \u201cEduStack | FiscalStack Solutions\u201d is live at edustack.co.zw, with invitation-based account acceptance.')],
      awaiting: ['Implementation details once the codebase has been reviewed.'],
    },
    decisions: { awaiting: ['Tenancy model and permission design.'] },
    challenges: { awaiting: ['Material from the build.'] },
    results: {
      body: 'The portal is deployed. What sits behind the sign-in is for schools, not for this study, until there is something publishable to show.',
      awaiting: ['Status: what is built, what is planned; whether any schools are using it.'],
    },
    stack: [],
    links: [{ label: 'edustack.co.zw', href: places.edustack, kind: 'product' }],
    plates: [{ alt: 'Reserved plate: EduStack interface.', caption: 'Interface to follow.', nature: 'awaiting' }],
    related: ['clubstack', 'zivvvo', 'brain-bunchy'],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: 'supporta',
    item: 8,
    hidden: true,
    name: 'Supporta',
    kind: 'engineering',
    mechanisms: ['B'],
    status: 'unconfirmed',
    statusEvidence: 'pending',
    summary: 'On the parts list, still in its crate. The folder offered to the researcher was empty, so this sheet waits.',
    accent: 'ink',
    role: { awaiting: ['Role.'] },
    problem: { awaiting: ['The D:\\SUPPORTA folder appeared empty when listed on 25 October 2026. Share the folder that holds the code.'] },
    constraints: { awaiting: ['Constraints.'] },
    architecture: { awaiting: ['Architecture, from the code.'] },
    decisions: { awaiting: ['Key decisions.'] },
    challenges: { awaiting: ['Testing evidence, with date.'] },
    results: { awaiting: ['Status, and a link if it is public.'] },
    stack: [],
    links: [],
    plates: [],
    related: ['clubstack'],
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
    summary: 'The bouncer of the operation. A QR code checking system on the Chaos Cup site, so the question \u201care you meant to be here?\u201d takes one scan instead of one argument.',
    accent: 'signal',
    role: { body: 'Built by the subject as part of the Chaos Cup software, which he wrote in full.' },
    problem: {
      body: 'An event with tickets has a gate, and a gate has a queue of people who are all quite sure they paid. Paper lists and squinting do not scale, and a co-host does not want to spend the day being the list. Chaos-Verify moves that job onto a phone: scan the code, get an answer, wave the person through.',
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
    summary: 'Can a model tell who is winning before the commentators admit it? The subject\u2019s dissertation, ball by ball.',
    accent: 'cobalt',
    role: { body: 'Sole researcher, BSc Honours in Data Science and Systems, University of Zimbabwe.' },
    problem: {
      body: 'A pre-match prediction is easy to make and easy to forget. His question was how the probability of each result should move ball by ball, as wickets fall and the required rate climbs, and whether a model can track that honestly instead of panicking after every boundary like a man in the stands.\n\nWorking title: \u201cPredictive Analytics in Cricket: A Hybrid Bayesian-Machine Learning Approach for Real-time ODI Outcome Prediction.\u201d',
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
      body: 'This is research, not a product, and it was not deployed. No accuracy figures appear here until they can be copied from the final document. Memory is a generous statistician.',
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
    summary: 'School quiz tournaments, debates and adjudication. The subject is usually the one holding the answer card.',
    accent: 'chartreuse',
    role: {
      body: 'Part-time co-owner, involved in day-to-day operations. Quizmaster, adjudicator, trainer and organiser. He also took winning students to Botswana as their patron, a sentence that contains a great deal of paperwork.',
    },
    problem: {
      body: 'School competitions need somebody to write fair questions, run the room, keep a score everybody trusts, and deal with teachers, parents, venues and buses. Most of that is operations wearing a blazer. The rest is standing in front of a hall of teenagers and being right.',
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
    summary: 'An adult field day in Harare that the subject co-hosts, and whose software he wrote in full: tickets, results, a Hall of Fame and QR code checking at the gate.',
    accent: 'signal',
    role: {
      facts: [
        s('Co-host of the Chaos Cup.'),
        s('Wrote all of the event\u2019s software, including the /verify section (Chaos-Verify).'),
      ],
    },
    problem: {
      body: 'A field day for adults needs the same things a school sports day needs, minus the parents shouting from the stands, plus grown-ups who will absolutely dispute a result. That means somewhere to issue tickets, somewhere to check them, somewhere to publish results quickly, and a Hall of Fame so the winners can be insufferable in an organised way. As co-host and sole developer, the subject was on both sides of every one of those problems.',
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
    status: 'built',
    statusEvidence: 'stated',
    summary: 'The till, in a pocket. FieldPOS is the Android edition of FiscalStack POS, for selling where a Windows machine on a counter is not an option.',
    accent: 'ink',
    role: { body: 'Product owner and developer, under FiscalStack Solutions.' },
    problem: {
      body: 'Not every sale happens at a counter. Some businesses sell from a vehicle, a stall, a doorstep or a crowd, and a desktop till does not travel. FieldPOS carries FiscalStack onto an Android device, so the same business can sell in the field and keep its records in one product family.',
      facts: [
        s('The Android edition of FiscalStack POS.'),
        s('Built with React. An earlier .NET MAUI version exists in the codebase but is not the one in use.'),
      ],
      awaiting: ['Which features match the Windows till; how fiscalisation is handled on the device; offline behaviour.'],
    },
    constraints: { awaiting: ['Devices and printers supported.'] },
    architecture: { awaiting: ['How FieldPOS talks to the fiscal engine or authority.'] },
    decisions: { awaiting: ['Why React for the Android edition.'] },
    challenges: { awaiting: ['Something hard about selling on a phone.'] },
    results: { awaiting: ['Status: pilot or in use.'] },
    stack: [{ name: 'React', evidence: 'stated' }, { name: 'Android', evidence: 'stated' }],
    links: [{ label: 'fiscalstack.co.zw', href: places.fiscalstackZw, kind: 'company' }],
    plates: [{ alt: 'Reserved plate: FieldPOS on an Android phone.', caption: 'FieldPOS on a phone.', nature: 'awaiting' }],
    related: ['fiscalstack-retail', 'fiscalstack-engine', 'fiscalstack'],
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
