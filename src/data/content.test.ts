import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { articles, parseFrontMatter } from './articles'
import { mechanisms, profile } from './profile'
import { allProjects, projects } from './projects'

const root = resolve(__dirname, '../..')

describe('project data', () => {
  it('has unique slugs and item numbers', () => {
    expect(new Set(projects.map((p) => p.slug)).size).toBe(projects.length)
    expect(new Set(projects.map((p) => p.item)).size).toBe(projects.length)
  })

  it('only references projects, parents and mechanisms that exist', () => {
    const slugs = new Set(projects.map((p) => p.slug))
    const ids = new Set(mechanisms.map((m) => m.id))
    for (const p of projects) {
      p.related.forEach((r) => expect(slugs, `${p.slug} -> ${r}`).toContain(r))
      if (p.parent) expect(slugs).toContain(p.parent)
      p.mechanisms.forEach((m) => expect(ids).toContain(m))
      expect(p.mechanisms.length).toBeGreaterThan(0)
    }
    for (const a of articles) a.related.forEach((r) => expect(slugs, `${a.slug} -> ${r}`).toContain(r))
  })

  it('every mechanism has at least one project on its tape', () => {
    for (const m of mechanisms) expect(projects.some((p) => p.mechanisms.includes(m.id)), m.id).toBe(true)
  })

  it('never presents an illustration as a screenshot, and every image file exists', () => {
    for (const p of projects) {
      for (const pl of p.plates) {
        if (pl.nature === 'awaiting') expect(pl.src).toBeUndefined()
        if (pl.src) {
          expect(pl.alt.length).toBeGreaterThan(10)
          const file = join(root, 'public', pl.src.replace(/^\/+/, ''))
          expect(existsSync(file), file).toBe(true)
          if (pl.src.includes('/illustrations/')) expect(pl.nature).toBe('illustration')
        }
      }
    }
  })

  it('only marks a project verified when the sheet carries a dated check of a live page', () => {
    const sections = ['role', 'problem', 'constraints', 'architecture', 'decisions', 'challenges', 'results'] as const
    for (const p of projects) {
      const facts = sections.flatMap((k) => p[k].facts ?? [])
      const verified = facts.filter((f) => f.evidence === 'verified')
      if (p.statusEvidence === 'verified') {
        expect(p.links.length, p.slug).toBeGreaterThan(0)
        expect(verified.length, p.slug).toBeGreaterThan(0)
      }
    }
    for (const slug of ['supporta', 'chaos-verify', 'fiscalstack-retail', 'fiscalstack-restaurant']) {
      const p = allProjects.find((x) => x.slug === slug)!
      expect(sections.flatMap((k) => p[k].facts ?? []).some((f) => f.evidence === 'verified'), slug).toBe(false)
    }
  })

  it('external writing points at the real blog', () => {
    const ext = articles.filter((x) => x.external)
    expect(ext.length).toBeGreaterThan(0)
    for (const a of ext) expect(a.external).toMatch(/^https:\/\/rumblings-of-a-fool\.blogspot\.com\/20\d\d\/\d\d\//)
  })
})

describe('publication', () => {
  it('holds back sheets marked hidden and never links to them', () => {
    const hidden = allProjects.filter((p) => p.hidden).map((p) => p.slug)
    expect(hidden).toContain('supporta')
    for (const p of projects) expect(hidden.includes(p.slug)).toBe(false)
  })

  it('carries no citation-style source notes in published text', () => {
    const text = JSON.stringify(projects)
    expect(text).not.toMatch(/checked \d{1,2} \w+ \d{4}/)
    expect(text).not.toMatch(/re-run by the researcher/i)
  })
})

describe('contact details', () => {
  it('match the details Tawanda supplied', () => {
    expect(profile.contact.email).toBe('tawandattimire@gmail.com')
    expect(profile.contact.phoneHref).toBe('tel:+263783341752')
    expect(profile.contact.whatsappHref).toBe('https://wa.me/263783341752')
    expect(profile.contact.github).toBe('https://github.com/timiretimzzy')
    expect(profile.contact.linkedin).toBe('https://www.linkedin.com/in/tawanda-timire-91137b149/')
    expect(profile.contact.instagram).toBe('https://www.instagram.com/timire.tawanda/')
    expect(profile.contact.x).toBe('https://x.com/timiretimzzy2')
    expect(profile.contact.facebook).toBe('https://www.facebook.com/tawanda.timire.98')
    expect(profile.companySites.map((s) => s.href)).toEqual(['https://www.fiscalstack.co.zw/', 'https://fiscalstack.co.ls/'])
  })
})

describe('articles', () => {
  it('parses front matter', () => {
    const { meta, body } = parseFrontMatter('---\ntitle: A: B\ndate: 2026-01-02\n---\nHello')
    expect(meta.title).toBe('A: B')
    expect(meta.date).toBe('2026-01-02')
    expect(body).toBe('Hello')
  })

  it('loads the shipped articles with titles and summaries', () => {
    expect(articles.length).toBeGreaterThan(0)
    for (const a of articles) {
      expect(a.title).not.toBe(a.slug)
      expect(a.summary.length).toBeGreaterThan(10)
    }
  })
})

describe('house rules', () => {
  const files: string[] = []
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name)
      if (statSync(p).isDirectory()) walk(p)
      else if (/\.(tsx?|css|md|html)$/.test(name)) files.push(p)
    }
  }
  walk(join(root, 'src'))
  walk(join(root, 'docs'))
  for (const name of ['index.html', 'README.md', 'PRODUCTION_READINESS_REPORT.md']) {
    const path = join(root, name)
    if (existsSync(path)) files.push(path)
  }

  it('contains no emoji anywhere in source, content or documentation', () => {
    const emoji = /\p{Extended_Pictographic}/u
    const offenders = files.filter((f) => emoji.test(readFileSync(f, 'utf8')))
    expect(offenders).toEqual([])
  })

  it('contains no em dash in site source or documentation', () => {
    const emDash = /\u2014/u
    const offenders = files.filter((f) => emDash.test(readFileSync(f, 'utf8')))
    expect(offenders).toEqual([])
  })
})
