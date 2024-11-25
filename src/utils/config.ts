import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import Ajv from "ajv";
import { FromSchema } from "json-schema-to-ts";

// Define the schema for configuration validation
const configSchema = {
  type: "object",
  properties: {
    api: {
      type: "object",
      properties: {
        NODE_ENV: {
          type: "string",
          enum: ["development", "production", "test"],
          default: "development",
        },
        PORT: { type: "number", default: 3000 },
        HOST: { type: "string", default: "localhost" },
        LOG_LEVEL: {
          type: "string",
          enum: ["fatal", "error", "warn", "info", "debug", "trace", "silent"],
          default: "info",
        },
        JWT_SECRET: { type: "string" },
      },
      required: ["NODE_ENV", "PORT", "HOST", "LOG_LEVEL", "JWT_SECRET"],
    },
  },
  required: ["api"],
} as const;

// Create the configuration object from environment variables
const configObject = {
  api: {
    NODE_ENV: process.env.NODE_ENV,
    PORT: Number(process.env.PORT),
    HOST: process.env.HOST,
    LOG_LEVEL: process.env.LOG_LEVEL,
    JWT_SECRET: process.env.JWT_SECRET,
  },
} as FromSchema<typeof configSchema>;

declare module "fastify" {
  interface FastifyInstance {
    config: typeof configObject;
  }
}

async function config(fastify: FastifyInstance) {
  const { log } = fastify;
  fastify.decorate("config", configObject);

  const ajv = new Ajv({
    allErrors: true,
    coerceTypes: false,
    useDefaults: true,
    removeAdditional: "all",
  });

  const validate = ajv.compile(configSchema);
  const valid = validate(configObject);

  if (!valid) {
    log.error(`Invalid environment variables: `);
    log.error(ajv.errorsText(validate.errors));
    process.exit(1);
  }
}

export default fp(config);
