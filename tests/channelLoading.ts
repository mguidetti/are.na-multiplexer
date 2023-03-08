import { test, expect } from '@playwright/test'

test('Can load channel through search', async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await page.getByText('Search channels/').click()
  await page.getByText('Search channels/').type('zxc')
  await page.getByText('Mogpt Tester / zxc', { exact: true }).click()

  await expect(page.getByTitle('Mogpt Tester / zxc')).toBeVisible()
})

test('Can load channel through index menu', async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await page.getByTitle('Channel index menu').click()
  await page.getByRole('button', { name: 'zxc' }).click()

  await expect(page.getByTitle('Mogpt Tester / zxc')).toBeVisible()
})
