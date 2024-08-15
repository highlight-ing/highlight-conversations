import { getAccessToken } from '@/services/highlightService'
import { getUserId as getUserIdAction } from '@/app/actions/getUserId'

let cachedUserId: string | null = null

export async function getUserId(): Promise<string> {
  if (cachedUserId) {
    return cachedUserId
  }

  try {
    const accessToken = await getAccessToken()
    const userId = await getUserIdAction(accessToken)
    cachedUserId = userId
    return userId
  } catch (error) {
    console.error('Error getting user ID:', error)
    throw new Error('Failed to get user ID')
  }
}

export function invalidateUserIdCache() {
  cachedUserId = null
}