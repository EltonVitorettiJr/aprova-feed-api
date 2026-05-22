import "dotenv/config";
import jwt from "@fastify/jwt";
import fastify from "fastify";
import connectDB from "./database/connection.js";
import { postRoutes } from "./routes/post-routes.js";

const app = fastify({ logger: true });

app.register(jwt, {
  secret: String(process.env.JWT_SECRET),
});

app.register(postRoutes);

app.get("/", async () => {
  return console.log(new Date());
});

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
