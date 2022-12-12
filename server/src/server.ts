import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import * as dotenv from 'dotenv';
dotenv.config()

import { poolRoutes } from './routes/pool';
import { userRoutes } from './routes/user';
import { guessRoutes } from './routes/guess';
import { gameRoutes } from './routes/game';
import { authRoutes } from './routes/auth';

//const prisma = new PrismaClient({ log: ['query'] });

async function bootstrap() {
  const fastify = Fastify({ logger: true });
  
  await fastify.register(cors, { origin: true }); //cors
  
  await fastify.register(jwt, {
    secret: String(process.env.SECRET_JWT)
  });
  
  await fastify.register(poolRoutes);
  await fastify.register(authRoutes);
  await fastify.register(gameRoutes);
  await fastify.register(userRoutes);
  await fastify.register(guessRoutes);


  await fastify.listen({ port: 3333, host: '0.0.0.0' });
}

bootstrap();