import { test } from '@playwright/test';
import { LoginPage } from '../../src/ui-pages/login.page';
import { ItemsPage } from '../../src/ui-pages/items.page';
import { credentials } from '../fixtures/test-data';
import { logStep } from '../../src/utils/logger';

test.describe('E2E Login', () => {
  test('should login successfully and open items page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const itemsPage = new ItemsPage(page);

    logStep('Opening login page');
    await loginPage.goto();

    logStep('Checking login page is visible');
    await loginPage.assertLoginPageVisible();

    logStep('Logging in with valid credentials');
    await loginPage.login(credentials.username, credentials.password);

    logStep('Checking items page is visible');
    await itemsPage.assertPageVisible();
  });
});