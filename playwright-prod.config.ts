import { defineConfig, devices } from '@playwright/test';
import type { TestOptions } from './test-options';

  import dotenv from 'dotenv';
   import path from 'path';
   dotenv.config({ path: path.resolve(__dirname, '.env') });


export default defineConfig<TestOptions>({

  use: {

    globalsQaURL: 'https://www.globalsqa.com/demo-site/draganddrop',
    baseURL: 'http://localhost:4200/',

  },
  projects: [
   
       {
      name: 'chromium',
    },
   
  ],
});
