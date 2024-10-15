// fastify.d.ts
import 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    user?: any; // Substitua `any` por um tipo mais específico, se possível
  }
}
