'use server'

import { jwtVerify } from 'jose'

export async function getUserId(accessToken: string): Promise<string> {
  if (!accessToken) {
    throw new Error('Access token is required')
  }

  try {
    const payload = await jwtVerify(accessToken, new TextEncoder().encode(process.env.HIGHLIGHT_JWT_SECRET))
    const userId = payload.payload.sub as string

    if (!userId) {
      throw new Error('User ID not found in token')
    }

    return userId
  } catch (error) {
    console.error('Error verifying token:', error)
    throw new Error('Invalid token')
  }
}