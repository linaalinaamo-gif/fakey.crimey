import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // You can add initial data here if needed
  // Example:
  // const user = await prisma.user.create({
  //   data: {
  //     email: "demo@fakey.crimey",
  //     username: "demo",
  //     isActive: true,
  //   },
  // })

  console.log("✅ Seeding complete!")
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
