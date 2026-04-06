export const config = {
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  apiUrl: process.env.API_URL || 'http://localhost:4000',
  username: process.env.USERNAME || 'admin',
  password: process.env.PASSWORD || 'admin123',
  chaosEnabled: process.env.CHAOS_ENABLED || 'true',
};