import type { FastifyReply, FastifyRequest } from "fastify";
import { type ObjectId, Types } from "mongoose";
import z from "zod";
import { Post } from "../../models/post-model.js";

export const createPostController = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  const postSchema = z.object({
    clientId: z.string().regex(/^[0-9a-fA-F]{24}$/, "ID de cliente inválido"),
    video_script: z.string(),
    image_urls: z.array(z.string()),
    caption: z.string(),
    scheduled_date: z.coerce.date(),
  });

  const tokenData = request.user as { userId: ObjectId; isAdmin: boolean };

  if (!tokenData.isAdmin) {
    return reply.status(403).send({ message: "Only admins can create posts" });
  }

  const data = postSchema.parse(request.body);

  try {
    const newPost = await Post.create({
      clientId: new Types.ObjectId(data.clientId),
      video_script: data.video_script,
      image_urls: data.image_urls,
      caption: data.caption,
      scheduled_date: data.scheduled_date,
    });

    return reply.status(201).send(newPost);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply
        .status(400)
        .send({ message: "Validation error", issues: error.format() });
    }

    return reply
      .status(500)
      .send({ message: `Error while creating post: ${error}` });
  }
};
