import { FastifyInstance } from "fastify";
import healthcheck from "#healthcheck";

export async function publicHandlers(fastify: FastifyInstance) {
  // Root route
  fastify.get("/", async (_request, reply) => {
    reply.code(200);
  });

  await fastify.register(healthcheck.handlers);
}

export async function privateHandlers(_fastify: FastifyInstance) {}
