import { FastifyPluginAsync } from "fastify";
import getGoogleProfile from "../../lib/google/getGoogleProfile";
import GoogleAuthBody from "../../types/google/authBody";
import { PrismaClient } from "@prisma/client";
import { generateToken } from "../../lib/token/jwt";
import GoogleAuthSchema from "../../schemas/google/auth.json";
import GoogleAuthCheck from "../../schemas/google/check.json";

const prisma = new PrismaClient();

const google: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  // registerd check
  fastify.post<{ Body: GoogleAuthBody }>(
    "/check",
    {
      schema: GoogleAuthCheck,
    },
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
          msg: "잘못된 구글 엑세스 토큰 또는 유저를 찾을 수 없음.",
        });
      }
    }
  );

  // login and register
  fastify.post<{ Body: GoogleAuthBody }>(
    "/auth",
    {
      schema: GoogleAuthSchema,
    },
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
          // genrate access Token
          const token = await generateToken(
            {
              subject: "accessToken",
              userId: socialAccount.user.id,
            },
            {
              expiresIn: "15d",
            }
          );

          reply.setCookie("access_token", token, {
            path: "/",
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 15,
          });

          reply.send({
            user: socialAccount.user,
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

          // genrate access Token
          const token = await generateToken(
            {
              subject: "accessToken",
              userId: user.id,
            },
            {
              expiresIn: "15d",
            }
          );

          reply.setCookie("access_token", token, {
            path: "/",
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 15,
          });

          reply.send({
            user,
          });
        }
      } catch (e) {
        reply.status(401).send({
          code: 401,
          msg: "잘못된 구글 엑세스 토큰 또는 유저를 찾을 수 없음",
        });
      }
    }
  );
};

export default google;
