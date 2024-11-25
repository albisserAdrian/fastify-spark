import server from "#server";
import { testConnection } from "#utils/db";

process.on("unhandledRejection", (err) => {
  server.log.error(err);
  process.exit(1);
});

const host = server.config.api.HOST;
const port = server.config.api.PORT;

async function startServer() {
  try {
    server.log.info("🚀  We have liftoff!");
    await server.listen({
      host,
      port,
      listenTextResolver: (address) => {
        return `✅  Server listening at ${address}`;
      },
    });
    testConnection(server);
  } catch (error) {
    server.log.error(`Error starting server: ${(error as Error).message}`);
    process.exit(1);
  }
}

startServer();

const gracefulShutdown = async (signal: string) => {
  try {
    await server.close();
    server.log.info(`Closed application on ${signal}`);
    process.exit(0);
  } catch (error) {
    server.log.error(`Error during shutdown: ${(error as Error).message}`);
    process.exit(1);
  }
};

["SIGINT", "SIGTERM"].forEach((signal) => {
  process.on(signal, () => gracefulShutdown(signal));
});
