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
      console.log(request);
      upload.single("image");
    }
  );
};

export default image;
