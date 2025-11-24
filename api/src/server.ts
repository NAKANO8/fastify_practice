import { prisma } from '../lib/prisma.js'

async function main() {
  // ======================
  // CREATE: ユーザー作成
  // ======================
  const createdUser = await prisma.users.create({
    data: {
      username: "Alice",
    },
  })
  console.log("Created:", createdUser)

  // ======================
  // FIND MANY: 全件取得
  // ======================
  const allUsers = await prisma.users.findMany()
  console.log("All Users:", allUsers)

  // ======================
  // FIND UNIQUE: 1件取得
  // ======================
  const oneUser = await prisma.users.findUnique({
    where: {
      id: createdUser.id,
    },
  })
  console.log("One User:", oneUser)

  // ======================
  // UPDATE: 更新
  // ======================
  const updated = await prisma.users.update({
    where: { id: createdUser.id },
    data: {
      username: "AliceUpdated",
    },
  })
  console.log("Updated:", updated)

  // ======================
  // DELETE: 削除
  // ======================
  const deleted = await prisma.users.delete({
    where: {
      id: createdUser.id,
    },
  })
  console.log("Deleted:", deleted)

  // ======================
  // 確認のための最終一覧
  // ======================
  const afterDelete = await prisma.users.findMany()
  console.log("After Delete:", afterDelete)
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
