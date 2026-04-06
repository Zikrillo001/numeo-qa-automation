import { Page, Locator, expect } from '@playwright/test';

export class ItemsPage {
  readonly page: Page;

  readonly pageRoot: Locator;
  readonly createButton: Locator;
  readonly refreshButton: Locator;
  readonly searchInput: Locator;
  readonly statusFilter: Locator;
  readonly itemsList: Locator;

  readonly titleInput: Locator;
  readonly descriptionInput: Locator;
  readonly statusSelect: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;

  readonly confirmDialog: Locator;
  readonly confirmDeleteButton: Locator;

  readonly pageError: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    this.pageRoot = page.getByTestId('items-page');
    this.createButton = page.getByTestId('btn-create-item');
    this.refreshButton = page.getByTestId('btn-refresh');
    this.searchInput = page.getByTestId('filter-search');
    this.statusFilter = page.getByTestId('filter-status');
    this.itemsList = page.getByTestId('items-list');

    this.titleInput = page.getByTestId('input-item-title');
    this.descriptionInput = page.getByTestId('input-item-description');
    this.statusSelect = page.getByTestId('select-item-status');
    this.saveButton = page.getByTestId('btn-modal-save');
    this.cancelButton = page.getByTestId('btn-modal-cancel');

    this.confirmDialog = page.getByTestId('confirm-dialog');
    this.confirmDeleteButton = page.getByTestId('btn-confirm-ok');

    this.pageError = page.getByTestId('page-error');
    this.successMessage = page.getByTestId('page-success');
  }

  async assertPageVisible(): Promise<void> {
    await expect(this.pageRoot).toBeVisible({ timeout: 15000 });
    await expect(this.itemsList).toBeVisible({ timeout: 15000 });
    }

  async clickCreateItem(): Promise<void> {
    await expect(this.createButton).toBeVisible();
    await this.createButton.click();
  }

  async createItem(
    title: string,
    description: string,
    status: 'active' | 'completed' = 'active'
  ): Promise<void> {
    await this.clickCreateItem();

    await expect(this.titleInput).toBeVisible();
    await this.titleInput.fill(title);
    await this.descriptionInput.fill(description);
    await this.statusSelect.selectOption(status);
    await this.saveButton.click();
  }

  async searchByTitle(title: string): Promise<void> {
    await expect(this.searchInput).toBeVisible();
    await this.searchInput.fill(title);
  }

  async clearSearch(): Promise<void> {
    await expect(this.searchInput).toBeVisible();
    await this.searchInput.fill('');
  }

  async filterByStatus(status: '' | 'active' | 'completed'): Promise<void> {
    await expect(this.statusFilter).toBeVisible();
    await this.statusFilter.selectOption(status);
  }

  async getItemCardByTitle(title: string): Promise<Locator> {
    return this.itemsList.locator('[data-testid^="item-card-"]').filter({
      has: this.page.locator('[data-testid^="item-title-"]').filter({
        hasText: title,
      }),
    }).first();
  }

  async assertItemVisible(title: string): Promise<void> {
    const card = await this.getItemCardByTitle(title);
    await expect(card).toBeVisible();
  }

  async assertItemNotVisible(title: string): Promise<void> {
    const card = await this.getItemCardByTitle(title);
    await expect(card).toHaveCount(0);
  }

  async clickEditForItem(title: string): Promise<void> {
    const card = await this.getItemCardByTitle(title);
    await expect(card).toBeVisible();

    const editButton = card.locator('[data-testid^="btn-edit-"]');
    await expect(editButton).toBeVisible();
    await editButton.click();
  }

  async updateItem(
    existingTitle: string,
    newTitle: string,
    newDescription: string,
    newStatus: 'active' | 'completed'
  ): Promise<void> {
    await this.clickEditForItem(existingTitle);

    await expect(this.titleInput).toBeVisible();
    await this.titleInput.fill(newTitle);
    await this.descriptionInput.fill(newDescription);
    await this.statusSelect.selectOption(newStatus);
    await this.saveButton.click();
  }

  async clickDeleteForItem(title: string): Promise<void> {
    const card = await this.getItemCardByTitle(title);
    await expect(card).toBeVisible();

    const deleteButton = card.locator('[data-testid^="btn-delete-"]');
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();
  }

  async deleteItem(title: string): Promise<void> {
    await this.clickDeleteForItem(title);

    await expect(this.confirmDialog).toBeVisible();
    await expect(this.confirmDeleteButton).toBeVisible();
    await this.confirmDeleteButton.click();
  }

  async assertSuccessVisible(): Promise<void> {
    await expect(this.successMessage).toBeVisible();
  }

  async assertErrorVisible(): Promise<void> {
    await expect(this.pageError).toBeVisible();
  }
}