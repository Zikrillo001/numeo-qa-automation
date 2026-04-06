import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByTestId('input-username');
    this.passwordInput = page.getByTestId('input-password');
    this.loginButton = page.getByTestId('btn-login');
    this.errorMessage = page.getByTestId('login-error');
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async login(username: string, password: string): Promise<void> {
    await expect(this.usernameInput).toBeVisible({ timeout: 10000 });
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async assertLoginPageVisible(): Promise<void> {
    await expect(this.page.getByTestId('login-page')).toBeVisible({ timeout: 10000 });
    await expect(this.usernameInput).toBeVisible({ timeout: 10000 });
    await expect(this.passwordInput).toBeVisible({ timeout: 10000 });
    await expect(this.loginButton).toBeVisible({ timeout: 10000 });
  }

  async assertLoginErrorVisible(): Promise<void> {
    await expect(this.errorMessage).toBeVisible({ timeout: 10000 });
  }
}