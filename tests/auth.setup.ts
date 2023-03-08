import { test as setup } from '@playwright/test'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const authFile = '.playwright/.auth/user.json'

if (process.env.TEST_USER_EMAIL === undefined) {
  throw new Error('TEST_USER_EMAIL is missing!')
}

if (process.env.TEST_USER_PASSWORD === undefined) {
  throw new Error('TEST_USER_PASSWORD is missing!')
}

setup('authenticate', async ({ page }) => {
  await page.goto('https://localhost:3001')
  await page.getByRole('button', { name: 'Sign in with Are.na' }).click()
  await page.getByPlaceholder('Email').fill(process.env.TEST_USER_EMAIL)
  await page.getByPlaceholder('Password').fill(process.env.TEST_USER_PASSWORD)
  await page.getByRole('button', { name: 'Log in' }).click()

  await page.context().storageState({ path: authFile })
})
