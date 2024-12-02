import { test } from "node:test";
import assert from "node:assert";
import server from "#server";

// Create a new Fastify instance for testing

// Register the healthcheck routes

test("GET `/healthcheck` route", async (_t) => {
  // Inject a request to the /healthcheck endpoint
  const response = await server.inject({
    method: "GET",
    url: "/healthcheck",
  });

  // Check the status code
  assert.strictEqual(response.statusCode, 200, "returns a status code of 200");

  // Check the response body
  const expectedResponse = {
    status: "OK",
  };
  assert.deepStrictEqual(
    response.json(),
    expectedResponse,
    "returns the expected response"
  );
});
