import type { FastifyReply, FastifyRequest } from "fastify";
import type { ObjectId } from "mongoose";
import { Post } from "../../models/post-model.js";

interface GetPostsResponse {
  clientId?: ObjectId;
  video_script: string;
  image_urls: string[];
  caption: string;
  scheduled_date: Date;
  status: "PENDING" | "APPROVED" | "ADJUSTMENT_NEEDED";
  feedback?: string;
}

export const getPostsController = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<GetPostsResponse[]> => {
  try {
    const { clientId } = request.query as { clientId?: ObjectId };

    const filter = clientId ? { clientId } : {};

    const posts = await Post.find(filter).sort({ createdAt: -1 });

    return reply.status(200).send(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return reply.status(500).send({ message: "Error while fetching posts" });
  }
};
