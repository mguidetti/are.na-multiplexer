import { test, expect, mockChannel } from './fixtures'
import type { Page } from '@playwright/test'

const optionText = `${mockChannel.owner.name} / ${mockChannel.title}`

async function openChannelViaSearch (page: Page) {
  await page.getByRole('combobox').click()
  await page.keyboard.type('test')
  const option = page.locator('[id^="react-select"][id*="option"]', { hasText: optionText })
  await expect(option).toBeVisible()
  await option.click()
  await expect(page.getByTitle(optionText)).toBeVisible()
}

test.describe('Desktop (authenticated)', () => {
  test('shows the header with search input', async ({ authedPage: page }) => {
    await page.goto('/')
    await expect(page.getByText('Search channels')).toBeVisible()
  })

  test('search for a channel and open it', async ({ authedPage: page }) => {
    await page.goto('/')
    await openChannelViaSearch(page)
  })

  test('channel window renders blocks in grid view', async ({ authedPage: page }) => {
    await page.goto('/')
    await openChannelViaSearch(page)

    // Verify blocks appear (image block should have an img tag)
    await expect(page.locator('img[src*="small"]').first()).toBeVisible()

    // Verify text block content appears
    await expect(page.getByText('Hello world')).toBeVisible()
  })

  test('toggle between grid and list view', async ({ authedPage: page }) => {
    await page.goto('/')
    await openChannelViaSearch(page)

    // Wait for blocks to load
    await expect(page.locator('img[src*="small"]').first()).toBeVisible()

    // Switch to list view
    await page.getByTitle('Change view').click()

    // In list view, block titles should be visible
    await expect(page.getByText('Test Image Block')).toBeVisible()
  })

  test('remove a window', async ({ authedPage: page }) => {
    await page.goto('/')
    await openChannelViaSearch(page)

    // Remove the window
    await page.getByTitle('Remove').click()

    // Window should be gone — back to zero state
    await expect(page.getByTitle('Remove')).not.toBeVisible()
  })

  test('open block viewer by double-clicking a block', async ({ authedPage: page }) => {
    await page.goto('/')
    await openChannelViaSearch(page)

    // Wait for blocks
    await expect(page.getByText('Hello world')).toBeVisible()

    // Double-click the text block to open viewer
    // Note: Playwright's dblclick() is intercepted by @dnd-kit's PointerSensor
    // before the dblclick event fires, so we dispatch the event directly.
    await page.getByText('Hello world').dispatchEvent('dblclick')

    // Block viewer dialog should open with the block content
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByTitle('Close Block Viewer')).toBeVisible()
  })

  test('block viewer has next/previous navigation', async ({ authedPage: page }) => {
    await page.goto('/')
    await openChannelViaSearch(page)

    // Wait for blocks and open the text block (second of three blocks)
    await expect(page.getByText('Hello world')).toBeVisible()
    await page.getByText('Hello world').dispatchEvent('dblclick')
    await expect(page.getByRole('dialog')).toBeVisible()

    // Text block is in the middle — should have both Previous and Next
    await expect(page.getByTitle('Previous block')).toBeVisible()
    await expect(page.getByTitle('Next block')).toBeVisible()

    // Navigate to previous block (first block)
    await page.getByTitle('Previous block').click()

    // Should still be in the dialog but Previous should be gone (first block)
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByTitle('Previous block')).not.toBeVisible()
    await expect(page.getByTitle('Next block')).toBeVisible()

    // Navigate forward again
    await page.getByTitle('Next block').click()
    await expect(page.getByTitle('Previous block')).toBeVisible()
  })

  test('search results disable already-open channels', async ({ authedPage: page }) => {
    await page.goto('/')
    await openChannelViaSearch(page)

    // Search for the same channel again
    await page.getByRole('combobox').click()
    await page.keyboard.type('test')
    const option = page.locator('[id^="react-select"][id*="option"]', { hasText: optionText })
    await expect(option).toBeVisible()

    // The option should be disabled (aria-disabled)
    await expect(option).toHaveAttribute('aria-disabled', 'true')
  })
})

test.describe('Desktop (free tier)', () => {
  test('search is disabled for free tier users', async ({ freeTierPage: page }) => {
    await page.goto('/')
    await expect(page.getByText('Search requires Premium subscription')).toBeVisible()
  })
})
