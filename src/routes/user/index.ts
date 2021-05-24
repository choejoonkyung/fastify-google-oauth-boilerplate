import { PrismaClient } from "@prisma/client";
import { FastifyPluginAsync } from "fastify";
import MeSchema from "../../schemas/user/me.json";
const prisma = new PrismaClient();

const user: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get(
    "/",
    {
      schema: MeSchema,
    },
    async function (request, reply) {
      if (!request.user) {
        reply.status(401);
        return;
      }
      const user = await prisma.user.findFirst({
        where: {
          id: request.user.id,
        },
      });
      reply.send(user);
    }
  );
};

export default user;
