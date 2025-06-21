/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  webServer: {
    command: 'npm run build && npm run preview',
    port: 4173
  },
  testDir: './tests',
  use: {
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  }
};

export default config;
