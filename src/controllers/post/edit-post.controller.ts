import type { FastifyReply, FastifyRequest } from "fastify";
import type { ObjectId } from "mongoose";
import z from "zod";
import { Post } from "../../models/post-model.js";

export const editPostController = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  const paramsSchema = z.object({ postId: z.string() });

  const editPostSchema = z.object({
    video_script: z.string().optional(),
    image_urls: z.array(z.string()).optional(),
    caption: z.string().optional(),
    scheduled_date: z.coerce.date().optional(),
    status: z.enum(["PENDING", "APPROVED", "ADJUSTMENT_NEEDED"]).optional(),
    feedback: z.string().optional(),
  });

  const tokenData = request.user as { userId: ObjectId; isAdmin: boolean };

  const { postId } = paramsSchema.parse(request.params);

  let data = editPostSchema.parse(request.body);

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return reply.status(404).send({ message: "Post not found" });
    }

    // Verifica se o usuário que está solicitando a edição é um admin
    if (!tokenData.isAdmin) {
      // Verifica se o post pertence ao usuário logado
      if (String(post?.clientId) !== String(tokenData.userId)) {
        return reply
          .status(403)
          .send({ message: "Only admins can edit posts of other users" });
      }

      // Verifica se o post não está pendente, se não, apenas os admins podem editá-lo
      if (post.status !== "PENDING") {
        return reply
          .status(403)
          .send({ message: "Only admins can edit posts that are not PENDING" });
      }

      // Remove os campos status e feedback do objeto data, pois eles podem ser editados apenas pelos admins
      data = {
        status: data.status,
        feedback: data.feedback,
      };
    }

    const editedPost = await Post.findByIdAndUpdate(postId, data, {
      returnDocument: "after",
      runValidators: true,
    });

    return reply.status(200).send(editedPost);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        message: "Invalid request data.",
        issues: error.format(),
      });
    }

    return reply
      .status(500)
      .send({ message: `Error while editing post: ${error}` });
  }
};
