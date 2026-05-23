import type { FastifyReply, FastifyRequest } from "fastify";
import type { ObjectId } from "mongoose";
import { Post } from "../../models/post-model.js";

interface EditPostRequestBody {
  video_script?: string | undefined;
  image_urls?: string[] | undefined;
  caption?: string | undefined;
  scheduled_date?: Date | undefined;
  status?: "PENDING" | "APPROVED" | "ADJUSTMENT_NEEDED" | undefined;
  feedback?: string | undefined;
}

export const editPostController = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  const tokenData = request.user as { userId: ObjectId; isAdmin: boolean };

  const { postId } = request.params as { postId: ObjectId };

  let data = request.body as EditPostRequestBody;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return reply.status(404).send({ message: "Post not found" });
    }

    // Verifica se o usuário que está solicitando a edição é um admin, caso não seja, verifica se o post pertence ao usuário logado
    if (!tokenData.isAdmin) {
      if (String(post?.clientId) !== String(tokenData.userId)) {
        return reply
          .status(403)
          .send({ message: "Only admins can edit posts of other users" });
      }

      data = {
        status: data.status,
        feedback: data.feedback,
      };
    }

    const editedPost = await Post.findByIdAndUpdate(postId, data, {
      new: true,
    });

    return reply.status(200).send(editedPost);
  } catch (error) {
    return reply
      .status(500)
      .send({ message: `Error while editing post: ${error}` });
  }
};
