import { FastifyPluginAsync } from "fastify";

const auth: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post(
    "/auth",
    {
      schema: {
        tags: ["Google oauth"],
        description: "구글 oauth 요청 api",
      },
    },
    async function (request, reply) {
      return {
        google: "auth",
      };
    }
  );
};

export default auth;
