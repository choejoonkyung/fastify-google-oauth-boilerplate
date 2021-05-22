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
        const exists = await prisma.socialAccount.findFirst({
          where: {
            provider: "google",
            social_id: profile.socialId,
          },
        });
        // send
        reply.send({
          exists: !!exists,
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
            user: socialAccount.user,
            accessToken: "",
          });
        } else {
          // create socialaccount
          const user = await prisma.socialAccount.create({
            data: {
              user: {
                create: {
                  email: profile.email,
                  display_name: profile.displayName,
                  thumbnail: profile.photo,
                },
              },
              social_id: profile.socialId,
              provider: "google",
            },
          });
          reply.send({
            user,
            access_token: "",
          });
        }
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
