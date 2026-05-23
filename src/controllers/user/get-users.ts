import type { FastifyReply, FastifyRequest } from "fastify";
import type { ObjectId } from "mongoose";
import { User } from "../../models/user-model.js";

export const getUsersController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const tokenData = request.user as { userId: ObjectId; isAdmin: boolean };

  if (!tokenData.isAdmin) {
    return reply.status(403).send({ message: "Only admins can get users" });
  }

  try {
    const users = await User.find();

    return reply.status(200).send(users);
  } catch (error) {
    return reply
      .status(500)
      .send({ message: `Error while fetching users: ${error}` });
  }
};
