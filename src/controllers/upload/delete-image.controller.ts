import type { FastifyReply, FastifyRequest } from "fastify";
import type { ObjectId } from "mongoose";
import { BUCKET_NAME, minioClient } from "../../database/minio.js";
import { Post } from "../../models/post-model.js";

export const deleteImageController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const tokenData = request.user as { userId: ObjectId; isAdmin: boolean };

  if (!tokenData.isAdmin) {
    return reply.status(403).send({ message: "Only admins can delete images" });
  }

  const { imageName } = request.params as { imageName: string };

  const fullImageUrl = `http://localhost:9000/${BUCKET_NAME}/${imageName}`;

  try {
    await minioClient.removeObject(BUCKET_NAME, imageName);

    await Post.updateMany(
      { image_urls: fullImageUrl },
      { $pull: { image_urls: fullImageUrl } },
    );

    return reply.status(200).send({ message: "Image deleted successfully" });
  } catch (error) {
    return reply
      .status(500)
      .send({ message: `Error deleting image: ${error}` });
  }
};
