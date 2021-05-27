import fp from "fastify-plugin";
import multipart from "fastify-multipart";

export default fp(async (fastify, opts) => {
  fastify.register(multipart);
});
