import { config } from '../../src/utils/config';

export const credentials = {
  username: 'admin',
  password: 'admin123',
};

export const invalidCredentials = {
  username: config.username,
  password: 'wrong-password',
};

export const invalidItemPayload = {
  title: '',
  description: '',
  status: 'active',
};