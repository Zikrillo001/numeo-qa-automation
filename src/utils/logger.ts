export function logStep(message: string): void {
  console.log(`[STEP] ${message}`);
}

export function logInfo(message: string): void {
  console.log(`[INFO] ${message}`);
}

export function logError(message: string): void {
  console.error(`[ERROR] ${message}`);
}