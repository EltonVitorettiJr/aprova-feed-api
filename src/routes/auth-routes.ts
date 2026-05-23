import type { FastifyInstance } from "fastify";
import { googleLoginController } from "../controllers/google-login.controller.js";

export const authRoutes = (app: FastifyInstance) => {
  app.post("/google-login", googleLoginController);
};
