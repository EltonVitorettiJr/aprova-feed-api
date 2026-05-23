import type { FastifyReply, FastifyRequest } from "fastify";
import type { ObjectId } from "mongoose";
import z from "zod";
import { Post } from "../../models/post-model.js";

export const deletePostController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const paramsSchema = z.object({ postId: z.string() });

  const { postId } = paramsSchema.parse(request.params);

  const tokenData = request.user as { userId: ObjectId; isAdmin: boolean };

  if (!tokenData.isAdmin) {
    return reply.status(403).send({ message: "Only admins can delete posts" });
  }

  try {
    const post = await Post.findByIdAndDelete(postId);

    if (!post) {
      return reply.status(404).send({ message: "Post not found" });
    }

    return reply.status(200).send({ message: "Post deleted successfully" });
  } catch (error) {
    return reply
      .status(500)
      .send({ message: `Error while deleting post: ${error}` });
  }
};
