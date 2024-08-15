'use server'

import { jwtVerify } from 'jose';
import { getAccessToken } from './highlightService'

export async function getUserId(): Promise<string | null> {
    try {
      const accessToken = await getAccessToken();
      console.log('Access token:', accessToken)
      if (!accessToken) {
        throw new Error('No access token available');
      }
  
      const payload = await jwtVerify(accessToken, new TextEncoder().encode(process.env.HIGHLIGHT_JWT_SECRET));
      console.log('Payload:', payload)
      const userId = payload.payload.sub as string;
      console.log('User ID:', userId)
      if (!userId) {
        throw new Error('User ID not found in token');
      }
  
      return userId;
    } catch (error) {
      console.error('Error getting user ID:', error);
      return null;
    }
  }