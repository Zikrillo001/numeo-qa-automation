import { APIRequestContext, APIResponse } from '@playwright/test';
import { config } from '../utils/config';

export class AuthClient {
  constructor(private readonly request: APIRequestContext) {}

  async login(username: string, password: string): Promise<APIResponse> {
    return await this.request.post(`${config.apiUrl}/auth/login`, {
      data: {
        username,
        password,
      },
    });
  }
}