import "dotenv/config";
import fastify from "fastify";

const app = fastify({ logger: true });

app.get("/", async (request, reply) => {
  return { status: "The server is running!" };
});

const start = async () => {
  try {
    await app.listen({ port: Number(process.env.PORT) || 3000 });
    console.log(`🚀Server is running on port ${process.env.PORT || 3000}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
