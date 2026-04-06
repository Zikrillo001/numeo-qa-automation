import { test, expect } from '@playwright/test';
import { AuthClient } from '../../src/api-clients/auth.client';
import { ItemsClient } from '../../src/api-clients/items.client';
import { credentials, invalidCredentials } from '../fixtures/test-data';
import { logStep } from '../../src/utils/logger';

test.describe('API Auth', () => {
  test('should login successfully with valid credentials', async ({ request }) => {
    logStep('Creating auth client');
    const authClient = new AuthClient(request);

    logStep('Sending login request with valid credentials');
    const response = await authClient.login(
      credentials.username,
      credentials.password
    );

    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.success).toBeTruthy();
    expect(body.data).toBeTruthy();
    expect(body.data.token).toBeTruthy();
  });

  test('should reject login with invalid credentials', async ({ request }) => {
    logStep('Creating auth client');
    const authClient = new AuthClient(request);

    logStep('Sending login request with invalid credentials');
    const response = await authClient.login(
      invalidCredentials.username,
      invalidCredentials.password
    );

    const body = await response.json();

    expect([400, 401]).toContain(response.status());
    expect(body.success).toBeFalsy();
    expect(body.error).toBeTruthy();
  });

  test('should deny access to protected endpoint without token', async ({ request }) => {
    logStep('Creating items client without token');
    const itemsClient = new ItemsClient(request);

    logStep('Requesting protected items endpoint');
    const response = await itemsClient.getItems();

    const body = await response.json();

    expect([401, 403]).toContain(response.status());
    expect(body.success).toBeFalsy();
    expect(body.error).toBeTruthy();
  });
});