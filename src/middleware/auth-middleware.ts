import type { FastifyReply, FastifyRequest } from "fastify";

export const authMiddleware = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    await request.jwtVerify();
  } catch (error) {
    console.error("Error verifying JWT:", error);

    return reply.status(401).send({ message: "Token unauthorized" });
  }
};
