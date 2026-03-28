import { test, expect } from '@playwright/test'

test.describe('Welcome page (unauthenticated)', () => {
  test('shows sign in button', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
  })

  test('does not show the desktop UI', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByPlaceholder('Search channels')).not.toBeVisible()
  })
})
