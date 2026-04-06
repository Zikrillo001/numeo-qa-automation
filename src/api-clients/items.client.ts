import { APIRequestContext, APIResponse } from '@playwright/test';
import { config } from '../utils/config';
import { ItemPayload } from '../factories/item.factory';

export class ItemsClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly token?: string
  ) {}

  private getAuthHeaders(): Record<string, string> {
    return this.token
      ? {
          Authorization: `Bearer ${this.token}`,
        }
      : {};
  }

  async getItems(): Promise<APIResponse> {
    return await this.request.get(`${config.apiUrl}/items`, {
      headers: this.getAuthHeaders(),
    });
  }

  async getItemById(itemId: string): Promise<APIResponse> {
    return await this.request.get(`${config.apiUrl}/items/${itemId}`, {
      headers: this.getAuthHeaders(),
    });
  }

  async createItem(payload: ItemPayload): Promise<APIResponse> {
    return await this.request.post(`${config.apiUrl}/items`, {
      headers: this.getAuthHeaders(),
      data: payload,
    });
  }

  async updateItem(
    itemId: string,
    payload: Partial<ItemPayload>
  ): Promise<APIResponse> {
    return await this.request.put(`${config.apiUrl}/items/${itemId}`, {
      headers: this.getAuthHeaders(),
      data: payload,
    });
  }

  async deleteItem(itemId: string): Promise<APIResponse> {
    return await this.request.delete(`${config.apiUrl}/items/${itemId}`, {
      headers: this.getAuthHeaders(),
    });
  }
}