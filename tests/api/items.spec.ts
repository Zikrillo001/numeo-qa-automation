import { test, expect, APIRequestContext } from '@playwright/test';
import { AuthClient } from '../../src/api-clients/auth.client';
import { ItemsClient } from '../../src/api-clients/items.client';
import { credentials, invalidItemPayload } from '../fixtures/test-data';
import { buildItemPayload } from '../../src/factories/item.factory';
import { logStep, logInfo } from '../../src/utils/logger';

async function getAuthToken(request: APIRequestContext): Promise<string> {
  const authClient = new AuthClient(request);

  logStep('Logging in to get auth token');
  const loginResponse = await authClient.login(
    credentials.username,
    credentials.password
  );

  const loginBody = await loginResponse.json();

  expect(loginResponse.status()).toBe(200);
  expect(loginBody.success).toBeTruthy();
  expect(loginBody.data).toBeTruthy();
  expect(loginBody.data.token).toBeTruthy();

  return loginBody.data.token;
}

test.describe('API Items CRUD', () => {
  test('should get items list for authorized user', async ({ request }) => {
    const token = await getAuthToken(request);
    const itemsClient = new ItemsClient(request, token);

    logStep('Requesting items list');
    const response = await itemsClient.getItems();
    const body = await response.json();

    logInfo(`GET /items status: ${response.status()}`);
    logInfo(`GET /items body: ${JSON.stringify(body)}`);

    expect(response.status()).toBe(200);
    expect(body.success).toBeTruthy();
    expect(body.data).toBeTruthy();
    expect(Array.isArray(body.data.items)).toBeTruthy();
  });

  test('should create item with valid payload', async ({ request }) => {
    const token = await getAuthToken(request);
    const itemsClient = new ItemsClient(request, token);
    const payload = buildItemPayload();

    logStep('Creating new item');
    const response = await itemsClient.createItem(payload);
    const body = await response.json();

    logInfo(`POST /items status: ${response.status()}`);
    logInfo(`POST /items body: ${JSON.stringify(body)}`);

    expect([200, 201]).toContain(response.status());
    expect(body.success).toBeTruthy();
    expect(body.data).toBeTruthy();
    expect(body.data.item).toBeTruthy();
    expect(body.data.item.id).toBeTruthy();
    expect(body.data.item.title).toBe(payload.title);
    expect(body.data.item.description).toBe(payload.description);
    expect(body.data.item.status).toBe(payload.status);
  });

  test('should update existing item', async ({ request }) => {
    const token = await getAuthToken(request);
    const itemsClient = new ItemsClient(request, token);

    logStep('Creating item before update');
    const createPayload = buildItemPayload();
    const createResponse = await itemsClient.createItem(createPayload);
    const createBody = await createResponse.json();

    logInfo(`Create before update status: ${createResponse.status()}`);
    logInfo(`Create before update body: ${JSON.stringify(createBody)}`);

    expect([200, 201]).toContain(createResponse.status());
    expect(createBody.success).toBeTruthy();
    expect(createBody.data.item).toBeTruthy();

    const itemId = createBody.data.item.id;

    const updatePayload = {
      title: `${createPayload.title}-updated`,
      status: 'completed' as const,
    };

    logStep('Updating created item');
    const updateResponse = await itemsClient.updateItem(itemId, updatePayload);
    const updateBody = await updateResponse.json();

    logInfo(`PUT /items/:id status: ${updateResponse.status()}`);
    logInfo(`PUT /items/:id body: ${JSON.stringify(updateBody)}`);

    expect(updateResponse.status()).toBe(200);
    expect(updateBody.success).toBeTruthy();
    expect(updateBody.data).toBeTruthy();
    expect(updateBody.data.item).toBeTruthy();
    expect(updateBody.data.item.id).toBe(itemId);
    expect(updateBody.data.item.title).toBe(updatePayload.title);
    expect(updateBody.data.item.status).toBe(updatePayload.status);
  });

  test('should delete existing item', async ({ request }) => {
    const token = await getAuthToken(request);
    const itemsClient = new ItemsClient(request, token);

    logStep('Creating item before delete');
    const createPayload = buildItemPayload();
    const createResponse = await itemsClient.createItem(createPayload);
    const createBody = await createResponse.json();

    logInfo(`Create before delete status: ${createResponse.status()}`);
    logInfo(`Create before delete body: ${JSON.stringify(createBody)}`);

    expect([200, 201]).toContain(createResponse.status());
    expect(createBody.success).toBeTruthy();
    expect(createBody.data.item).toBeTruthy();

    const itemId = createBody.data.item.id;

    logStep('Deleting created item');
    const deleteResponse = await itemsClient.deleteItem(itemId);

    logInfo(`DELETE /items/:id status: ${deleteResponse.status()}`);

    expect([200, 204]).toContain(deleteResponse.status());

    if (deleteResponse.status() !== 204) {
      const deleteBody = await deleteResponse.json();
      logInfo(`DELETE /items/:id body: ${JSON.stringify(deleteBody)}`);

      expect(deleteBody.success).toBeTruthy();
    }
  });

  test('should reject item creation with invalid payload', async ({ request }) => {
    const token = await getAuthToken(request);
    const itemsClient = new ItemsClient(request, token);

    logStep('Creating item with invalid payload');
    const response = await itemsClient.createItem(invalidItemPayload as any);
    const body = await response.json();

    logInfo(`POST /items invalid status: ${response.status()}`);
    logInfo(`POST /items invalid body: ${JSON.stringify(body)}`);

    expect(response.status()).toBe(400);
    expect(body.success).toBeFalsy();
    expect(body.error).toBeTruthy();
  });
});