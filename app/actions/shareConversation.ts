'use server'

import { shareConversation } from '@/services/shareService'
import { ConversationData } from '@/data/conversations'

export async function getShareLink(conversation: ConversationData, userId: string): Promise<string> {
    try {
        if (!userId) {
            throw new Error('User ID not found')
        }
        conversation.userId = userId
        console.log('conversation', conversation)
        return await shareConversation(conversation)
    } catch (error) {
        console.error('Error sharing conversation:', error)
        if (error instanceof Error) {
            throw new Error(`Error sharing conversation: ${error.message}`)
        } else {
            throw new Error('Error sharing conversation: Unknown error')
        }
    }
}