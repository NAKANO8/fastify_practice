import Fastify from "fastify";
import { prisma } from "../lib/prisma.js"; // ESMなので .js 必須

const fastify = Fastify({
  logger: true,
});

// ---------------------------
// POST /users
// ---------------------------
fastify.post("/users", async (req, reply) => {
  const { username } = req.body as { username: string };

  const user = await prisma.users.create({
    data: { username },
  });

  return user;
});

// ---------------------------
// GET /users （全件）
// ---------------------------
fastify.get("/users", async () => {
  return await prisma.users.findMany({
    orderBy: {
      id: "asc",
    },
  });
});

// ---------------------------
// GET /users/:id （1件取得）
// ---------------------------
fastify.get("/users/:id", async (req) => {
  const { id } = req.params as { id: string };

  return await prisma.users.findUnique({
    where: { id: Number(id) },
  });
});

// ---------------------------
// PUT /users/:id （更新）
// ---------------------------
fastify.put("/users/:id", async (req) => {
  const { id } = req.params as { id: string };
  const { username } = req.body as { username: string };

  return await prisma.users.update({
    where: { id: Number(id) },
    data: { username },
  });
});

// ---------------------------
// DELETE /users/:id
// ---------------------------
fastify.delete("/users/:id", async (req) => {
  const { id } = req.params as { id: string };

  return await prisma.users.delete({
    where: { id: Number(id) },
  });
});

// ---------------------------
// 起動
// ---------------------------
fastify.listen({ port: 3000 }).then(() => {
  console.log("🚀 Server running at http://localhost:3000");
});

