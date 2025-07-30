import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Checking demo user...')
  
  const demoUser = await prisma.user.findUnique({
    where: { email: 'demo@example.com' },
  })
  
  if (demoUser) {
    console.log('Demo user found:', {
      id: demoUser.id,
      email: demoUser.email,
      name: demoUser.name,
    })
    
    const projects = await prisma.project.findMany({
      where: { userId: demoUser.id },
    })
    
    console.log('Projects for demo user:', projects.length)
    projects.forEach(project => {
      console.log(`- ${project.title} (${project.status})`)
    })
  } else {
    console.log('Demo user not found')
  }
  
  await prisma.$disconnect()
}

main().catch(console.error)