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
  const tokenData = request.user as { userId: ObjectId; isAdmin: boolean };

  const { clientId, status } = request.query as {
    clientId: ObjectId;
    status: "PENDING" | "APPROVED" | "ADJUSTMENT_NEEDED";
  };

  let filter = {};

  if (!tokenData.isAdmin) {
    filter = { clientId: tokenData.userId };
  } else {
    if (clientId) {
      filter = { clientId };
    }
  }

  if (status) {
    filter = { ...filter, status };
  }

  try {
    const posts = await Post.find(filter).sort({ scheduled_date: 1 });

    return reply.status(200).send(posts);
  } catch (error) {
    return reply
      .status(500)
      .send({ message: `Error while fetching posts: ${error}` });
  }
};
