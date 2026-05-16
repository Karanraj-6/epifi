import { createApp } from './app.js';
import { assertRuntimeConfig, config } from './config/env.js';
import { runMigrations, pool } from './database/connection.js';

async function bootstrap() {
  assertRuntimeConfig();
  await runMigrations();

  const app = createApp();
  const server = app.listen(config.port, () => {
    console.log(`Notes API listening on port ${config.port}`);
  });

  async function shutdown() {
    server.close(async () => {
      await pool.end();
      process.exit(0);
    });
  }

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
