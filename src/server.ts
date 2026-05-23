import "dotenv/config";
import jwt from "@fastify/jwt";
import fastifyMultipart from "@fastify/multipart";
import fastify from "fastify";
import connectDB from "./database/connection.js";
import { setupMinio } from "./database/minio.js";
import { authRoutes } from "./routes/auth-routes.js";
import { postRoutes } from "./routes/post-routes.js";
import { uploadRoutes } from "./routes/upload-routes.js";
import { userRoutes } from "./routes/user-routes.js";

const app = fastify({ logger: true });

app.register(jwt, {
  secret: String(process.env.JWT_SECRET),
});

app.register(fastifyMultipart);

app.register(authRoutes);
app.register(userRoutes);
app.register(postRoutes);
app.register(uploadRoutes);

const start = async () => {
  try {
    await connectDB();
    await setupMinio();

    await app.listen({ port: Number(process.env.PORT) || 3000 });

    console.log(`🚀Server is running on port ${process.env.PORT || 3000}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
