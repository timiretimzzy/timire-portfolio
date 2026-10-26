import type { Article } from './types'
import { places } from './places'

/**
 * Articles are Markdown files in src/content/articles with a small
 * front-matter block. Drop a new .md file in that folder to publish it.
 */
const files = import.meta.glob('../content/articles/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

export function parseFrontMatter(raw: string): { meta: Record<string, string>; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw)
  if (!match) return { meta: {}, body: raw }
  const meta: Record<string, string> = {}
  for (const line of match[1].split(/\r?\n/)) {
    const i = line.indexOf(':')
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim()
  }
  return { meta, body: match[2] }
}

function toArticle(path: string, raw: string): Article {
  const slug = path.split('/').pop()!.replace(/\.md$/, '')
  const { meta, body } = parseFrontMatter(raw)
  return {
    slug,
    title: meta.title ?? slug,
    date: meta.date || undefined,
    series: meta.series || undefined,
    kind: (meta.kind as Article['kind']) ?? 'essay',
    summary: meta.summary ?? '',
    body,
    related: meta.related ? meta.related.split(',').map((s) => s.trim()).filter(Boolean) : [],
  }
}

/**
 * Rumblings of a Fool lives on Blogger for now (it moves to timire.co.zw
 * later). These are the most recent posts as listed on the blog on
 * 25 October 2026: titles as published (with a missing space and the
 * spelling of "Cosmological" corrected), summaries written for this index. The archive also lists 19 earlier posts from April 2025.
 */
const BLOG = places.blog
const rumblings: Article[] = [
  {
    slug: 'rumblings-executive-consolidation',
    title: 'Executive Consolidation by Constitutional Disruption',
    date: '2026-05-19',
    summary: 'On the Constitution Amendment (No. 3) Bill, 2026, and what it does to the checks on executive power.',
    external: `${BLOG}/2026/05/executive-consolidation-by_01332368097.html`,
  },
  {
    slug: 'rumblings-rights',
    title: 'Rights: a mere suggestion if violating them has no consequence.',
    date: '2025-11-12',
    summary: 'Rights on paper are only as strong as the price of ignoring them.',
    external: `${BLOG}/2025/11/rights-mere-suggestion-if-violating.html`,
  },
  {
    slug: 'rumblings-make-it',
    title: 'We Won\u2019t All \u201cMake It\u201d And That\u2019s Fine',
    date: '2025-11-01',
    summary: 'Against motivational arithmetic that only works if everyone wins.',
    external: `${BLOG}/2025/11/we-wont-all-make-itand-thats-fine.html`,
  },
  {
    slug: 'rumblings-kids',
    title: 'Why I\u2019m Not Having Kids (And It\u2019s Partly Your Fault)',
    date: '2025-10-12',
    summary: 'His reluctance to have children, and how much of it comes from watching how children get treated.',
    external: `${BLOG}/2025/10/why-im-not-having-kids-and-its-partly.html`,
  },
  {
    slug: 'rumblings-20-fine-tuning',
    title: '20. The Fine Tuning Argument',
    date: '2025-05-07',
    summary: 'Are the constants of physics tuned for life, and if so, does that point anywhere?',
    external: `${BLOG}/2025/05/20-fine-tuning-argument.html`,
  },
  {
    slug: 'rumblings-19-first-cause',
    title: '19. First Cause and The Kalam Cosmological Argument',
    date: '2025-05-07',
    summary: 'The argument from a first cause, in its Kalam form, examined.',
    external: `${BLOG}/2025/05/19-first-cause-and-kalam-cosmotological.html`,
  },
  {
    slug: 'rumblings-18-cognitive-dissonance',
    title: '18. Cognitive Dissonance',
    date: '2025-05-01',
    summary: 'What it costs to hold beliefs that contradict each other, with religion as the case study.',
    external: `${BLOG}/2025/05/cognitive-dissonance.html`,
  },
].map((a) => ({ ...a, kind: 'essay' as const, series: 'rumblings', body: '', related: [] }))

export const rumblingsHome = BLOG
export const rumblingsEarlierCount = 19

export const articles: Article[] = [
  ...Object.entries(files).map(([path, raw]) => toArticle(path, raw)),
  ...rumblings,
].sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))

export function articleBySlug(slug: string) {
  return articles.find((a) => a.slug === slug)
}

/** Series and shelves in the Thinking Room. Empty shelves say so plainly. */
export const shelves = [
  {
    id: 'rumblings',
    title: 'Rumblings of a Fool',
    description:
      'The subject\u2019s blog. It began as a numbered series on belief, doubt and the classic arguments for God, taken seriously rather than mocked, and has since wandered into rights, constitutions, ambition and why he is not having children.',
    match: (a: Article) => a.series === 'rumblings',
  },
  {
    id: 'technical',
    title: 'Technical notes',
    description: 'Engineering write-ups: integrations, offline systems, testing, and things that broke in instructive ways.',
    match: (a: Article) => a.kind === 'technical' || a.kind === 'site-note',
  },
  {
    id: 'research',
    title: 'Research',
    description: 'Summaries of research work, starting with the cricket dissertation.',
    match: (a: Article) => a.kind === 'research-summary',
  },
]

export const kindLabels: Record<Article['kind'], string> = {
  essay: 'Essay',
  technical: 'Technical note',
  'research-summary': 'Research summary',
  'site-note': 'Site note',
}
