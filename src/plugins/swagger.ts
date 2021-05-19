import fp from "fastify-plugin";
import swagger from "fastify-swagger";

/**
 * swagger-fastify
 *
 * @see https://github.com/fastify/fastify-swagger
 */

const { SERVER_URL } = process.env;

const handleServerUrl = () => {
  if (process.env.NODE_ENV === "production") return SERVER_URL;
  return "localhost";
};

export default fp(async (fastify, opts) => {
  fastify.register(swagger, {
    routePrefix: "/docs",
    swagger: {
      info: {
        title: "fastify-google-oauth-boilerplate",
        description: "fastify와 google oauth가 연결 된 boilerplate 입니다.",
        version: "0.0.1",
      },
      host: handleServerUrl(),
      schemes: ["http"],
      consumes: ["application/json"],
      produces: ["application/json"],
      securityDefinitions: {
        apiKey: {
          type: "apiKey",
          name: "auth",
          in: "header",
        },
      },
      tags: [{ name: "Google oauth", description: "구글 로그인 관련" }],
    },
    uiConfig: {
      docExpansion: "full",
      deepLinking: false,
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    exposeRoute: true,
  });
});
