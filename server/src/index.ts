import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { env } from './env.js';
import { registerRoutes } from './routes.js';

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: env.allowOrigin,
  methods: ['GET', 'POST', 'PATCH', 'OPTIONS']
});
await app.register(helmet);

await registerRoutes(app);

app.listen({ port: env.port, host: '0.0.0.0' }).catch((err) => {
  app.log.error(err);
  process.exit(1);
});

