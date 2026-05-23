import type { FastifyInstance } from "fastify";
import { getUsersController } from "../controllers/user/get-users.js";
import { authMiddleware } from "../middleware/auth-middleware.js";

export const userRoutes = (app: FastifyInstance) => {
  app.addHook("onRequest", authMiddleware);

  app.get("/user", getUsersController);
};
