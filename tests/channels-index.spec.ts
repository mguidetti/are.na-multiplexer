import { test, expect, mockChannel } from './fixtures'

test.describe('Channels index menu', () => {
  test('opens and shows user channels', async ({ authedPage: page }) => {
    await page.goto('/')

    // Click the channels index button (Bars4Icon)
    const menuButtons = page.locator('header button')
    // The channels index button is the first button after the search
    await menuButtons.filter({ has: page.locator('svg') }).nth(0).click()

    // Wait for the popover with "Your Channels" heading
    await expect(page.getByText('Your Channels')).toBeVisible()

    // Verify the mock channel appears in the list
    await expect(page.getByText(mockChannel.title)).toBeVisible()

    // Verify block count is displayed
    await expect(page.getByText(`${mockChannel.counts.contents} blocks`)).toBeVisible()
  })

  test('clicking a channel opens it as a window', async ({ authedPage: page }) => {
    await page.goto('/')

    // Open the channels index
    const menuButtons = page.locator('header button')
    await menuButtons.filter({ has: page.locator('svg') }).nth(0).click()
    await expect(page.getByText('Your Channels')).toBeVisible()

    // Click the channel
    await page.getByText(mockChannel.title).click()

    // Verify a window opens — the channel title should appear in the window toolbar
    await expect(page.getByTitle(`${mockChannel.owner.name} / ${mockChannel.title}`)).toBeVisible()
  })
})
