import { FastifyPluginCallback } from "fastify";
import fp from "fastify-plugin";
import { decodeToken } from "../lib/token/jwt";

declare module "fastify" {
  interface FastifyRequest {
    user: null | { id: number };
  }
}

type UserTokenDecoded = {
  subject: string;
  userId: number;
  iat: number;
  exp: number;
};

const callback: FastifyPluginCallback = async (fastify, opts, done) => {
  fastify.decorateRequest("user", null);
  fastify.addHook("preHandler", async (request, reply) => {
    const accessToken: string | undefined = request.cookies.access_token;
    try {
      const decoded = await decodeToken<UserTokenDecoded>(accessToken);
      request.user = {
        id: decoded.userId,
      };
    } catch (e) {
      // reply.status(401).send(new Error("토큰이 유효하지 않습니다."));
    }
  });

  done();
};

const jwtPlugin = fp(callback, {
  name: "jwtPlugin",
});

export default fp(async (fastify, opts) => {
  fastify.register(jwtPlugin);
});
