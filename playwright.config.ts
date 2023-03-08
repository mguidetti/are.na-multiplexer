import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
      use: {
        contextOptions: {
          ignoreHTTPSErrors: true
        }
      }
    },

    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: '.playwright/.auth/user.json'
      },
      dependencies: ['setup']
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: '.playwright/.auth/user.json'
      },
      dependencies: ['setup']
    },

    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        storageState: '.playwright/.auth/user.json'
      },
      dependencies: ['setup']
    }
  ]
})
