import { prisma } from '../lib/prisma.js'  // ESMでは .js 必須

async function main() {
  // Create a new user
  const user = await prisma.users.create({
    data: {
      username: "Alice",
    },
  })
  console.log('Created user:', user)

  // Fetch all users
  const allUsers = await prisma.users.findMany()
  console.log('All users:', JSON.stringify(allUsers, null, 2))
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

