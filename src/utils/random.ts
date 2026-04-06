export function randomSuffix(): string {
  return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

export function randomText(prefix: string): string {
  return `${prefix}-${randomSuffix()}`;
}