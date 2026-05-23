import type { FastifyInstance } from "fastify";
import { deleteImageController } from "../controllers/upload/delete-image.controller.js";
import { uploadImageController } from "../controllers/upload/upload-image.controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";

export const uploadRoutes = (app: FastifyInstance) => {
  app.addHook("onRequest", authMiddleware);

  app.post("/upload", uploadImageController);
  app.delete("/upload/:imageName", deleteImageController);
};
