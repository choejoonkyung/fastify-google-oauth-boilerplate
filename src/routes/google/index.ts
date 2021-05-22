import { FastifyPluginAsync } from "fastify";
import getGoogleProfile from "../../lib/google/getGoogleProfile";
import GoogleAuthBody from "../../types/google/authBody";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const google: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  // registerd check
  fastify.post<{ Body: GoogleAuthBody }>(
    "/check",
    async function (request, reply) {
      const { access_token: accessToken } = request.body;
      try {
        const profile = await getGoogleProfile(accessToken);
        const socialAccount = await prisma.socialAccount.findFirst({
          where: {
            provider: "google",
            social_id: profile.socialId,
          },
        });
        reply.send({
          exists: !!socialAccount,
        });
      } catch (e) {
        reply.status(401).send({
          code: 401,
          msg: "잘못된 구글 엑세스 토큰입니다.",
        });
      }
    }
  );

  // login
  fastify.post<{ Body: GoogleAuthBody }>(
    "/auth",
    async function (request, reply) {
      const { access_token: accessToken } = request.body;
      try {
        const profile = await getGoogleProfile(accessToken);
        const socialAccount = await prisma.socialAccount.findFirst({
          where: {
            provider: "google",
            social_id: profile.socialId,
          },
          select: {
            user: true,
          },
        });

        if (socialAccount) {
          // TODO: genrate access Token
          reply.send({
            user: null,
            accessToken: "",
          });
        }

        // TODO: create user
      } catch (e) {
        reply.status(401).send({
          code: 401,
          msg: "잘못된 구글 엑세스 토큰입니다.",
        });
      }
    }
  );
};

export default google;
