import fastify from "fastify";
import rateLimit from "@fastify/rate-limit";
import config from "#utils/config";
import errorHandler from "#utils/error-handler";
import authorization from "#utils/authorization";
import { privateHandlers, publicHandlers } from "#handlers";
import healthcheck from "#healthcheck";

const server = fastify({
  logger: {
    level: process.env.LOG_LEVEL,
  },
});

await server.register(config);
await server.register(rateLimit, {
  global: false,
});

server.setErrorHandler(errorHandler);
server.setNotFoundHandler(
  {
    preHandler: server.rateLimit({
      max: 4,
      timeWindow: 500,
    }),
  },
  (_request, reply) => {
    reply.code(404).send({ 404: "The page is out there... somewhere." });
  }
);

//Register services
server.register(healthcheck.service);

// Register handlers
server.register(publicHandlers);
server.register(privateHandlers).addHook("onRequest", authorization);

export default server;
