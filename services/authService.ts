'use server'

import { jwtVerify } from 'jose';
import { getAccessToken } from './highlightService'

export async function getUserId(): Promise<string | null> {
    try {
      const accessToken = await getAccessToken();
  
      if (!accessToken) {
        throw new Error('No access token available');
      }
  
      const payload = await jwtVerify(accessToken, new TextEncoder().encode(process.env.HIGHLIGHT_JWT_SECRET));
      const userId = payload.payload.sub as string;
  
      if (!userId) {
        throw new Error('User ID not found in token');
      }
  
      return userId;
    } catch (error) {
      console.error('Error getting user ID:', error);
      return null;
    }
  }