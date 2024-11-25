import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import AppError from "#utils/app-error";

export default async function healthcheckRoutes(fastify: FastifyInstance) {
  const { healthcheck } = fastify;

  const onGetHealthcheckSchema = {
    schema: {
      description: "Check server health",
      tags: ["healthcheck"],
      response: {
        200: {
          properties: {
            status: { const: "OK" },
          },
        },
        500: {
          properties: {
            status: { const: "error" },
          },
        },
      },
    },
  } as const;

  fastify.get(
    "/healthcheck",
    onGetHealthcheckSchema,
    async (request: FastifyRequest, reply: FastifyReply) => {
      const protocol = request.protocol;
      const host = request.headers.host;

      if (!host) {
        throw new AppError(400, "Host header is missing");
      }

      console.log("Test1");
      const { code, status } = await healthcheck(protocol, host);
      console.log("RESPONSE: ", status);

      reply.status(code).send({ status });
    }
  );
}
