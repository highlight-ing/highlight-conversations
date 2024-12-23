'use server'

import { shareConversation, deleteConversation } from '@/services/shareService'
import { ConversationData, SerializedConversationData } from '@/data/conversations'
import { supabase } from '@/lib/supabase';

export async function getShareLink(
    conversation: SerializedConversationData, 
    userId: string
): Promise<string> {
    try {
        if (!userId) {
            throw new Error('User ID not found')
        }

        const startedAt = new Date(conversation.startedAt)
        const endedAt = new Date(conversation.endedAt)
        const timestamp = new Date(conversation.timestamp)

        const shareData: ConversationData = {
            ...conversation,
            startedAt,
            endedAt,
            timestamp,
            userId
        }
        
        return await shareConversation(shareData)
    } catch (error) {
        console.error('Error sharing conversation:', error)
        if (error instanceof Error) {
            throw new Error(`Error sharing conversation: ${error.message}`)
        } else {
            throw new Error('Error sharing conversation: Unknown error')
        }
    }
}

export async function deleteShareLink(
    conversation: ConversationData): Promise<ConversationData> {
    try {
        if (!conversation.shareLink) {
            throw new Error('No share link found for this conversation')
        }
        
        const slug = conversation.shareLink.split('/').pop()
        if (!slug) { throw new Error(`Slug is undefined`)}
        await deleteConversation(slug)
        
        // Create a new conversation object with userId and shareLink set to empty strings
        const updatedConversation: ConversationData = {
            ...conversation,
            userId: '',
            shareLink: ''
        }
        
        return updatedConversation
    } catch (error) {
        console.error('Error deleting share link:', error)
        if (error instanceof Error) {
            throw new Error(`Error deleting share link: ${error.message}`)
        } else {
            throw new Error('Error deleting share link: Unknown error')
        }
    }
}


export async function checkConversationExists(id: string) {
  const { data, error } = await supabase
    .from('conversations')
    .select('id')
    .eq('external_id', id)
    .single();

  if (error || !data) {
    return false;
  }

  return true;
}