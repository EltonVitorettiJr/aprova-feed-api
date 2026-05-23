import "dotenv/config";
import jwt from "@fastify/jwt";
import fastify from "fastify";
import connectDB from "./database/connection.js";
import { authRoutes } from "./routes/auth-routes.js";
import { postRoutes } from "./routes/post-routes.js";

const app = fastify({ logger: true });

app.register(jwt, {
  secret: String(process.env.JWT_SECRET),
});

app.register(authRoutes);
app.register(postRoutes);

const start = async () => {
  try {
    await connectDB();

    await app.listen({ port: Number(process.env.PORT) || 3000 });

    console.log(`🚀Server is running on port ${process.env.PORT || 3000}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
