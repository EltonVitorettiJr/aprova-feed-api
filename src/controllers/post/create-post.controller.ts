import type { FastifyReply, FastifyRequest } from "fastify";
import type { ObjectId } from "mongoose";
import { Post } from "../../models/post-model.js";

interface CreatePostRequestBody {
  clientId: ObjectId;
  video_script: string;
  image_urls: string[];
  caption: string;
  scheduled_date: Date;
}

interface CreatePostResponse {
  clientId: ObjectId;
  video_script: string;
  image_urls: string[];
  caption: string;
  scheduled_date: Date;
  status: "PENDING" | "APPROVED" | "ADJUSTMENT_NEEDED";
  feedback?: string;
}

export const createPostController = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<CreatePostResponse> => {
  const tokenData = request.user as { userId: ObjectId; isAdmin: boolean };

  if (!tokenData.isAdmin) {
    return reply.status(403).send({ message: "Only admins can create posts" });
  }

  const data = request.body as CreatePostRequestBody;

  try {
    const newPost = await Post.create({
      clientId: data.clientId,
      video_script: data.video_script,
      image_urls: data.image_urls,
      caption: data.caption,
      scheduled_date: data.scheduled_date,
    });

    return reply.status(201).send(newPost);
  } catch (error) {
    return reply
      .status(500)
      .send({ message: `Error while creating post: ${error}` });
  }
};
