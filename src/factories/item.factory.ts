import { randomText } from '../utils/random';

export interface ItemPayload {
  title: string;
  description: string;
  status: 'active' | 'completed';
}

export function buildItemPayload(
  overrides: Partial<ItemPayload> = {}
): ItemPayload {
  return {
    title: randomText('task'),
    description: randomText('description'),
    status: 'active',
    ...overrides,
  };
}