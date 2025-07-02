const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false }); // Show browser for manual login
  const context = await browser.newContext();
  const page = await context.newPage();

  // Navigate to the login page
  await page.goto('https://lt2srv.iar.kit.edu/');
  await page.getByRole('link', { name: 'Login Login' }).click();
  await page.getByRole('button', { name: 'Log in with KIT-Account (' }).click();

  console.log('⏳ Please log in manually in the browser window.');

  // Wait until redirected to the dashboard (or any page that confirms login)
  await page.waitForURL('**/login', { timeout: 120000 }); // Adjust URL pattern if needed

  // Save session state to auth.json
  await context.storageState({ path: 'auth.json' });
  console.log('✅ Login successful. Session saved to auth.json');

  await browser.close();
})();

