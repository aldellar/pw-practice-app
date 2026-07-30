import { defineConfig, devices } from '@playwright/test';
import type { TestOptions } from './test-options';

  import dotenv from 'dotenv';
   import path from 'path';
   dotenv.config({ path: path.resolve(__dirname, '.env') });


export default defineConfig<TestOptions>({
  timeout : 40000, // 10,000 milliseconds manual timeout time global settings
   globalTimeout: 60000,
  expect: {
    timeout: 2000
  },
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {

    globalsQaURL: 'https://www.globalsqa.com/demo-site/draganddrop',
    baseURL: process.env.DEV === '1' ? 'http://localhost:4200/'
        : process.env.STAGING == '1' ? 'http://localhost/4202/'
        : 'http://localhost:4201',

    trace: 'on-first-retry',


    navigationTimeout: 5000,
    video: {
      mode: 'off',
      size: {width: 1920, height: 1080}
    }
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'dev',
      use: { ...devices['Desktop Chrome'],
        baseURL: 'https://localhost4202'
      },
    },
       {
      name: 'chromium',
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] ,
        video: {
      mode: 'off',
      size: {width: 1920, height: 1080}
    }
      },
      
    },
    {
        name: 'pageObjectFullScreen',
        testMatch: 'usePageObjects.spec.ts',
        use: {
          viewport: {width: 1920, height: 1080}
        }
    },
  ],


});
