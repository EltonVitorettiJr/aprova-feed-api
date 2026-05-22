import type { FastifyReply, FastifyRequest } from "fastify";
import type { ObjectId } from "mongoose";
import { Post } from "../../models/post-model.js";

export const deletePostController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { postId } = request.params as { postId: ObjectId };

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return reply.status(404).send({ message: "Post not found" });
    }

    await Post.findByIdAndDelete(postId);

    return reply.status(200).send({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);

    return reply.status(500).send({ message: "Error while deleting post" });
  }
};
