import type { FastifyReply, FastifyRequest } from "fastify";
import { User } from "../models/user-model.js";

interface GoogleLoginRequestBody {
  email: string;
  name: string;
  avatar_url: string;
  isAdmin: boolean;
}

export const googleLoginController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { email, name, avatar_url, isAdmin } =
    request.body as GoogleLoginRequestBody;

  if (!email || !name) {
    return reply.status(400).send({ message: "Email and name are required" });
  }
  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        name,
        avatar_url,
        isAdmin: isAdmin || false,
      });
    }

    const token = await reply.jwtSign({
      email: user.email,
      isAdmin: user.isAdmin,
    });

    return reply.status(200).send({ user, token });
  } catch (error) {
    return reply
      .status(500)
      .send({ message: `Error while logging in with Google: ${error}` });
  }
};
