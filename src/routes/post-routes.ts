import type { FastifyInstance } from "fastify";
import { createPostController } from "../controllers/post/create-post.controller.js";
import { deletePostController } from "../controllers/post/delete-post.controller.js";
import { editPostController } from "../controllers/post/edit-post.controller.js";
import { getPostsController } from "../controllers/post/get-posts.controller.js";

export const postRoutes = (app: FastifyInstance) => {
  app.get("/post", getPostsController);
  app.post("/post", createPostController);
  app.patch("/post/:postId", editPostController);
  app.delete("/post/:postId", deletePostController);
};
