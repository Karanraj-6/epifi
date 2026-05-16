import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: Number(process.env.PORT || 4000),
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || 'dev-only-change-this-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  autoMigrate: process.env.AUTO_MIGRATE !== 'false',
  aboutName: process.env.ABOUT_NAME || 'Your Name',
  aboutEmail: process.env.ABOUT_EMAIL || 'your.email@example.com'
};

export function assertRuntimeConfig() {
  if (!config.databaseUrl) {
    throw new Error('DATABASE_URL is required. Add it to apps/api/.env or your hosting provider.');
  }

  if (config.jwtSecret === 'dev-only-change-this-secret' && process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be set in production.');
  }
}
