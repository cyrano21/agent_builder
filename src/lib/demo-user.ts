import { db } from './db'

export const DEMO_USER_EMAIL = 'demo@example.com'

export async function getDemoUser() {
  try {
    const user = await db.user.findUnique({
      where: { email: DEMO_USER_EMAIL },
    })
    return user
  } catch (error) {
    console.error('Error getting demo user:', error)
    return null
  }
}

export async function getDemoUserId() {
  const user = await getDemoUser()
  return user?.id || 'demo-user-id'
}