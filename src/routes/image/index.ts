import { FastifyPluginAsync } from "fastify";
import ImageUploadSchema from "../../schemas/images/upload.json";
import upload from "../../lib/aws/upload";

const image: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post(
    "/",
    {
      schema: ImageUploadSchema,
    },
    async function (request, reply) {
      const data = await request.file();
      await upload(
        data.file,
        data.mimetype,
        `images/${new Date().getMilliseconds()}${data.filename}`
      );
      reply.send({ success: true });
    }
  );
};

export default image;
