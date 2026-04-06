import { test } from '@playwright/test';
import { LoginPage } from '../../src/ui-pages/login.page';
import { ItemsPage } from '../../src/ui-pages/items.page';
import { credentials } from '../fixtures/test-data';
import { buildItemPayload } from '../../src/factories/item.factory';
import { logStep } from '../../src/utils/logger';

test.describe('E2E Items CRUD', () => {
  test('should complete happy-path CRUD flow', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const itemsPage = new ItemsPage(page);

    const item = buildItemPayload();
    const updatedTitle = `${item.title}-updated`;
    const updatedDescription = `${item.description}-updated`;

    logStep('Opening login page');
    await loginPage.goto();

    logStep('Logging in');
    await loginPage.login(credentials.username, credentials.password);

    logStep('Checking items page');
    await itemsPage.assertPageVisible();

    logStep('Creating a new item');
    await itemsPage.createItem(item.title, item.description, item.status);

    logStep('Searching for created item');
    await itemsPage.searchByTitle(item.title);
    await itemsPage.assertItemVisible(item.title);

    logStep('Updating the created item');
    await itemsPage.updateItem(
      item.title,
      updatedTitle,
      updatedDescription,
      'completed'
    );

    logStep('Searching for updated item');
    await itemsPage.searchByTitle(updatedTitle);
    await itemsPage.assertItemVisible(updatedTitle);

    logStep('Deleting the updated item');
    await itemsPage.deleteItem(updatedTitle);

    logStep('Verifying deleted item is no longer visible');
    await itemsPage.searchByTitle(updatedTitle);
    await itemsPage.assertItemNotVisible(updatedTitle);
  });
});