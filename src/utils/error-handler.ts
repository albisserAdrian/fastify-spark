import { FastifyReply, FastifyRequest } from "fastify";
import AppError from "./app-error";

export default async function errorHandler(
  error: AppError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  request.log.error(error);
  // Send critical error notification

  if (!error.isOperational) {
    process.exit(1);
  }
  reply.status(error.statusCode).send(error.message);
}
