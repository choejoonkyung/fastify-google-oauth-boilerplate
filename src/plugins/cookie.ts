import fp from "fastify-plugin";
import cookie from "fastify-cookie";

export default fp(async (fastify, opts) => {
  fastify.register(cookie);
});
