import { expect, test } from '@playwright/test'

/** No horizontal overflow at any of the widths the brief names. */
const WIDTHS = [320, 375, 430, 768, 1024, 1280, 1440, 1920, 2560]
const PATHS = ['/', '/about', '/projects', '/projects/fiscalstack', '/projects/zivvvo', '/writing', '/writing/colophon', '/experiments', '/contact']

test.describe('layout', () => {
  test.skip(({ isMobile }) => isMobile, 'width sweep runs once, in the desktop project')

  for (const w of WIDTHS) {
    test(`no horizontal overflow at ${w}px`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: 900 })
      for (const p of PATHS) {
        await page.goto(p)
        await page.getByRole('heading', { level: 1 }).waitFor()
        const sw = await page.evaluate(() => document.documentElement.scrollWidth)
        expect(sw, `${p} at ${w}px`).toBeLessThanOrEqual(w)
      }
    })
  }
})
