import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/ui-pages/login.page';
import { ItemsPage } from '../../src/ui-pages/items.page';
import { credentials, invalidCredentials } from '../fixtures/test-data';
import { logStep } from '../../src/utils/logger';

test.describe('E2E Error Handling', () => {
  test('should show error for invalid login', async ({ page }) => {
    const loginPage = new LoginPage(page);

    logStep('Opening login page');
    await loginPage.goto();

    logStep('Checking login page is visible');
    await loginPage.assertLoginPageVisible();

    logStep('Trying to login with invalid credentials');
    await loginPage.login(
      invalidCredentials.username,
      invalidCredentials.password
    );

    logStep('Checking login error is visible');
    await loginPage.assertLoginErrorVisible();
  });

  test('should prevent creating item with empty required title', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const itemsPage = new ItemsPage(page);

    logStep('Opening login page');
    await loginPage.goto();

    logStep('Logging in with valid credentials');
    await loginPage.login(credentials.username, credentials.password);

    logStep('Checking items page is visible');
    await itemsPage.assertPageVisible();

    logStep('Opening create item modal');
    await itemsPage.clickCreateItem();

    logStep('Submitting invalid item form');
    await expect(itemsPage.titleInput).toBeVisible();
    await itemsPage.titleInput.fill('');
    await itemsPage.descriptionInput.fill('Invalid item description');
    await itemsPage.statusSelect.selectOption('active');
    await itemsPage.saveButton.click();

    logStep('Checking validation prevents submission');
    await expect(itemsPage.titleInput).toBeVisible();
  });
});