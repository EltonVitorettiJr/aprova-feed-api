import type { FastifyReply, FastifyRequest } from "fastify";
import type { ObjectId } from "mongoose";
import { Post } from "../../models/post-model.js";

interface EditPostRequestBody {
  video_script?: string;
  image_urls?: string[];
  caption?: string;
  scheduled_date?: Date;
  status?: "PENDING" | "APPROVED" | "ADJUSTMENT_NEEDED";
  feedback?: string;
}

interface EditPostReply {
  id: ObjectId;
  video_script: string;
  image_urls: string[];
  caption: string;
  scheduled_date: Date;
  status: "PENDING" | "APPROVED" | "ADJUSTMENT_NEEDED";
  feedback?: string;
}

export const editPostController = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<EditPostReply> => {
  const { postId } = request.params as { postId: ObjectId };

  const data = request.body as EditPostRequestBody;

  try {
    const editedPost = await Post.findByIdAndUpdate(postId, data, {
      new: true,
    });

    return reply.status(200).send(editedPost);
  } catch (error) {
    console.error("Error editing post:", error);

    return reply.status(500).send({ message: "Error while editing post" });
  }
};
