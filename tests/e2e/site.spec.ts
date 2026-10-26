import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROUTES = [
  { path: '/', title: /^Tawanda Timire/, h1: /Tawanda\s*Timire/ },
  { path: '/about', title: /^About/, h1: /The Specimen/ },
  { path: '/projects', title: /^Projects/, h1: /The Machinery/ },
  { path: '/projects/fiscalstack', title: /^FiscalStack Solutions/, h1: /FiscalStack Solutions/ },
  { path: '/projects/zivvvo', title: /^Zivvvo/, h1: /Zivvvo/ },
  { path: '/projects/clubstack', title: /^ClubStack/, h1: /ClubStack/ },
  { path: '/writing', title: /^Writing/, h1: /The Thinking Room/ },
  { path: '/writing/colophon', title: /^Colophon/, h1: /Colophon/ },
  { path: '/experiments', title: /^Experiments/, h1: /Experiments/ },
  { path: '/contact', title: /^Contact/, h1: /The Next Variable/ },
]

function watchErrors(page: Page) {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(String(e)))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('requestfailed', (r) => errors.push(`failed: ${r.url()}`))
  page.on('response', (r) => r.status() >= 400 && errors.push(`${r.status()} ${r.url()}`))
  return errors
}

for (const r of ROUTES) {
  test(`loads ${r.path} directly, with a title, a heading and no errors`, async ({ page }) => {
    const errors = watchErrors(page)
    await page.goto(r.path)
    await expect(page).toHaveTitle(r.title)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(r.h1)
    const description = await page.locator('meta[name="description"]').getAttribute('content')
    expect(description?.length).toBeGreaterThan(40)
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', await page.title())
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary')
    // contact details are reachable from every page via the title block
    await expect(page.locator('footer a[href="mailto:tawandattimire@gmail.com"]')).toBeVisible()
    await page.reload()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(r.h1)
    expect(errors).toEqual([])
  })

  test(`has no serious accessibility violations on ${r.path}`, async ({ page }) => {
    await page.goto(r.path)
    await page.getByRole('heading', { level: 1 }).waitFor()
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
    const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
    expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([])
  })
}

test('every project sheet and article resolves', async ({ page }) => {
  await page.goto('/projects')
  await page.locator('table').waitFor()
  const projectLinks = await page.locator('table a[href^="/projects/"]').evaluateAll((as) => as.map((a) => a.getAttribute('href')!))
  expect(projectLinks.length).toBeGreaterThanOrEqual(17)
  await page.goto('/writing')
  await page.getByRole('heading', { level: 1 }).waitFor()
  const articleLinks = await page.locator('a[href^="/writing/"]').evaluateAll((as) => as.map((a) => a.getAttribute('href')!))
  for (const href of [...new Set([...projectLinks, ...articleLinks])]) {
    await page.goto(href)
    await expect(page.getByRole('heading', { level: 1 }), href).not.toHaveText(/missing from the binder/)
    if (href.startsWith('/projects/')) {
      await expect(page.locator('main a[href="mailto:tawandattimire@gmail.com"]'), href).toBeVisible()
    }
  }
})

test('unknown paths show a noindexed 404 sheet', async ({ page }) => {
  await page.goto('/no-such-sheet')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/missing from the binder/)
  await expect(page).toHaveTitle(/^Sheet not found/)
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow')
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0)
})

test('primary navigation works and history goes back and forward', async ({ page, isMobile }) => {
  await page.goto('/')
  const nav = page.getByRole('navigation', { name: 'Primary' })
  const open = async () => {
    if (isMobile) await nav.getByRole('button', { name: /index/i }).click()
  }
  await open()
  await nav.getByRole('link', { name: /^Projects/ }).click()
  await expect(page).toHaveURL(/\/projects$/)
  await open()
  await nav.getByRole('link', { name: /^Contact/ }).click()
  await expect(page).toHaveURL(/\/contact$/)
  await page.goBack()
  await expect(page).toHaveURL(/\/projects$/)
  await page.goForward()
  await expect(page).toHaveURL(/\/contact$/)
})

test('the machine turns from the keyboard and the tape follows', async ({ page }) => {
  await page.goto('/')
  const disc = page.locator('.m-disc')
  const before = await disc.evaluate((el) => (el as SVGGElement).style.transform)
  const key = page.getByRole('radio', { checked: true })
  await key.focus()
  await page.keyboard.press('ArrowRight')
  await expect(page.getByRole('radio', { checked: true })).toHaveText(/C/)
  await expect(page).toHaveURL(/\?m=C/)
  const after = await disc.evaluate((el) => (el as SVGGElement).style.transform)
  expect(after).not.toBe(before)
  await expect(page.getByRole('link', { name: /Real-time ODI outcome prediction/ }).first()).toBeVisible()
})

test('clicking a sector of the ring selects it', async ({ page, isMobile }) => {
  test.skip(isMobile, 'covered by the keys on touch layouts')
  await page.goto('/')
  await page.locator('[data-mechanism="D"] .m-sector-hit').click({ force: true })
  await expect(page.getByRole('radio', { checked: true })).toHaveText(/D/)
})

test('filters on the parts list are in the URL', async ({ page }) => {
  await page.goto('/projects?kind=game')
  await expect(page.getByRole('status')).toHaveText(/3 of 17 items/)
  await page.getByRole('link', { name: 'Clear filters' }).click()
  await expect(page.getByRole('status')).toHaveText(/17 of 17 items/)
})

test('invalid filter values are ignored without a runtime error', async ({ page }) => {
  const errors = watchErrors(page)
  await page.goto('/projects?kind=unknown&m=unknown&status=unknown')
  await expect(page.getByRole('status')).toHaveText(/17 of 17 items/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/The Machinery/)
  expect(errors).toEqual([])
})

test('case studies switch to the data sheet view', async ({ page }) => {
  await page.goto('/projects/zivvvo')
  await page.getByRole('button', { name: 'Data sheet' }).click()
  await expect(page).toHaveURL(/view=data/)
  await expect(page.getByRole('region', { name: 'Data sheet' })).toBeVisible()
})

test('skip link moves focus to the content', async ({ page, isMobile }) => {
  test.skip(isMobile, 'keyboard test')
  await page.goto('/about')
  await page.getByRole('heading', { level: 1 }).waitFor()
  await page.keyboard.press('Tab')
  const skip = page.getByRole('link', { name: 'Skip to content' })
  await expect(skip).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.locator('#main')).toBeFocused()
})

test('reduced motion: the ring does not animate', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' })
  const page = await ctx.newPage()
  await page.goto('/')
  const dur = await page.locator('.m-disc').evaluate((el) => getComputedStyle(el).transitionDuration)
  expect(parseFloat(dur)).toBeLessThan(0.01)
  await ctx.close()
})

test('contact sheet carries the real details and nothing invented', async ({ page }) => {
  await page.goto('/contact')
  await page.getByRole('heading', { level: 1 }).waitFor()
  const hrefs = await page.locator('main a[href]').evaluateAll((as) => as.map((a) => a.getAttribute('href')))
  expect(hrefs).toEqual(
    expect.arrayContaining([
      'mailto:tawandattimire@gmail.com',
      'tel:+263783341752',
      'https://wa.me/263783341752',
      'https://github.com/timiretimzzy',
      'https://www.linkedin.com/in/tawanda-timire-91137b149/',
      'https://www.instagram.com/timire.tawanda/',
      'https://x.com/timiretimzzy2',
      'https://www.facebook.com/tawanda.timire.98',
      'https://www.fiscalstack.co.zw/',
      'https://fiscalstack.co.ls/',
    ]),
  )
  expect(hrefs.some((h) => h?.includes('linkedin'))).toBe(true)
})

test('published pages carry no editing labels or placeholders', async ({ page }) => {
  const paths = ['/', '/about', '/projects', '/projects/fiscalstack', '/projects/fiscalstack-retail', '/projects/chaos-verify', '/projects/fiscalstack-fieldpos', '/experiments', '/writing', '/contact']
  for (const p of paths) {
    await page.goto(p)
    await page.getByRole('heading', { level: 1 }).waitFor()
    const text = await page.locator('main').innerText()
    for (const label of ['per subject', 'from the files', 'not obtained', 'Plate reserved', 'To follow.', 'Owner note', 'as stated']) {
      expect(text, `${p} contains "${label}"`).not.toContain(label)
    }
    expect(text, `${p} contains an em dash`).not.toContain('\u2014')
  }
})

test('held-back sheets are not published', async ({ page }) => {
  await page.goto('/projects/supporta')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/missing from the binder/)
  await expect(page).toHaveTitle(/^Sheet not found/)
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow')
})

test('the production bundle excludes owner-only and hidden content', async ({ page, isMobile }) => {
  test.skip(isMobile, 'the bundle is identical across device projects')
  await page.goto('/')
  const assets = join(process.cwd(), 'dist', 'assets')
  const output = [join(process.cwd(), 'dist', 'index.html')]
    .concat(readdirSync(assets).filter((name) => name.endsWith('.js')).map((name) => join(assets, name)))
    .map((path) => readFileSync(path, 'utf8'))
    .join('\n')
  const forbidden = [
    'Supporta',
    'D:\\SUPPORTA',
    'Owner note',
    'Plate reserved',
    'Reserved plate',
    'To follow.',
    'not drawn yet',
    'Confirm exact title',
    'Confirm role',
    'per subject',
    'from the files',
    'not obtained',
    '\u2014',
  ]
  for (const text of forbidden) expect(output, `bundle contains "${text}"`).not.toContain(text)
})
