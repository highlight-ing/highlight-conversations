'use server'

import { shareConversation, deleteConversation } from '@/services/shareService'
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

export async function deleteShareLink(conversation: ConversationData): Promise<ConversationData> {
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