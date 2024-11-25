import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { testConnection } from "#utils/db";

declare module "fastify" {
  interface FastifyInstance {
    healthcheck: (
      protocol: string,
      host: string
    ) => Promise<{ code: number; status: "OK" | "Error" }>;
  }
}

async function healthcheckService(fastify: FastifyInstance) {
  const { log } = fastify;
  fastify.decorate("healthcheck", healthcheck);

  async function healthcheck(
    protocol: string,
    host: string
  ): Promise<{ code: number; status: "OK" | "Error" }> {
    try {
      // if we can connect to the databases and make a simple query
      // and make a HEAD request to ourselves, then we're good.
      const url = new URL(`${protocol}://${host}`);
      await Promise.all([
        testConnection(fastify),
        fetch(url, {
          method: "HEAD",
          headers: { "X-Healthcheck": "true" },
        }).then((r) => {
          if (!r.ok) return Promise.reject(r);
          return Promise.resolve();
        }),
      ]);
      return { code: 200, status: "OK" };
    } catch (error) {
      log.error(error);
      return { code: 500, status: "Error" };
    }
  }
}

export default fp(healthcheckService, {
  name: "healthcheck-service",
});
