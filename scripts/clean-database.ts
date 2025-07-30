import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Cleaning database...')

  // Delete all data in correct order to respect foreign key constraints
  await prisma.notification.deleteMany({})
  await prisma.projectDeliverable.deleteMany({})
  await prisma.projectShare.deleteMany({})
  await prisma.projectComment.deleteMany({})
  await prisma.teamMember.deleteMany({})
  await prisma.project.deleteMany({})
  await prisma.team.deleteMany({})
  await prisma.userSettings.deleteMany({})
  await prisma.subscription.deleteMany({})
  await prisma.projectTemplate.deleteMany({})
  await prisma.user.deleteMany({})

  console.log('Database cleaned successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })