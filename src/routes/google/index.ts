import { FastifyPluginAsync } from "fastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const auth: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get(
    "/auth",
    {
      schema: {
        tags: ["Google oauth"],
        description: "구글 oauth 요청 api",
      },
    },
    async function (request, reply) {
      await prisma.user.create({
        data: {
          name: "Jk",
        },
      });
      return {
        google: "auth",
      };
    }
  );
};

export default auth;
