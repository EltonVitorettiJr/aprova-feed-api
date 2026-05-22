import "dotenv/config";
import fastify from "fastify";
import connectDB from "./database/connection.js";

const app = fastify({ logger: true });

app.get("/", async () => {
  return { status: "The server is running!" };
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
