import { useState } from 'react'
import { ConversationData } from '@/data/conversations'
import { processConversation } from '@/services/processConversationService'
import { sendAttachmentAndOpen, getAccessToken } from '@/services/highlightService'
import { trackEvent } from '@/lib/amplitude'
import { getShareLink } from '@/app/actions/shareConversation'
import { getUserId } from '@/utils/userUtils'

export const useConversationActions = (
  initialConversation: ConversationData,
  onUpdate: (updatedConversation: ConversationData) => void,
  onDelete: (id: string) => void
) => {
  const [localConversation, setLocalConversation] = useState(initialConversation)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isViewTranscriptOpen, setIsViewTranscriptOpen] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [shareStatus, setShareStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle')
  const [shareMessage, setShareMessage] = useState<{ type: 'success' | 'error', message: string, description?: string } | null>(null)

  const handleSummarize = async () => {
    setIsProcessing(true)
    try {
      const processedConversation = await processConversation(localConversation)
      const updatedConversation = { ...processedConversation, summarized: true }
      setLocalConversation(updatedConversation)
      onUpdate(updatedConversation)
    } catch (error) {
      console.error('Error processing conversation:', error)
    } finally {
      setIsProcessing(false)
      trackEvent('Summarized', {})
    }
  }

  const handleOnViewTranscript = () => {
    setIsViewTranscriptOpen(true)
  }

  const handleAttachment = async () => {
    let toAppId = 'highlightchat'
    let transcript = localConversation.transcript
    await sendAttachmentAndOpen(toAppId, transcript)
    trackEvent('Added to HL Chat', {})
  }

  const handleShare = async () => {
    setShareStatus('processing')
    setShareMessage(null)

    if (localConversation.shareLink) {
      setShareUrl(localConversation.shareLink)
      await navigator.clipboard.writeText(localConversation.shareLink)
      setShareStatus('success')
      setShareMessage({ type: 'success', message: 'Link copied to clipboard', description: localConversation.shareLink })
      trackEvent('Shared (Existing Link)', {})
      return
    }

    const abortController = new AbortController()
    const timeoutId = setTimeout(() => abortController.abort(), 15000) // 15 seconds timeout

    try {
      let updatedConversation = localConversation

      if (!localConversation.summarized) {
        updatedConversation = await processConversation(localConversation, abortController.signal)
        setLocalConversation(updatedConversation)
        onUpdate(updatedConversation)
      }

      const userId = await getUserId()
      const shareLink = await getShareLink(updatedConversation, userId)

      updatedConversation = {
        ...updatedConversation,
        shareLink: shareLink
      }
      setLocalConversation(updatedConversation)
      onUpdate(updatedConversation)

      setShareUrl(shareLink)
      await navigator.clipboard.writeText(shareLink)
      setShareStatus('success')
      setShareMessage({ type: 'success', message: 'Link generated and copied to clipboard', description: shareLink })
      trackEvent('Shared (New Link)', {})
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        console.log('Share operation was aborted')
        setShareStatus('error')
        setShareMessage({ type: 'error', message: 'Share operation timed out' })
      } else {
        console.error('Error sharing conversation:', error)
        setShareStatus('error')
        setShareMessage({ type: 'error', message: 'Failed to generate share link' })
      }
    } finally {
      clearTimeout(timeoutId)
    }
  }

  const handleShareDialogClose = () => {
    setShareStatus('idle')
  }

  const handleUpdateTitle = (id: string, newTitle: string) => {
    const updatedConversation = { ...localConversation, title: newTitle }
    setLocalConversation(updatedConversation)
    onUpdate(updatedConversation)
  }

  const handleGenerateShareLink = async () => {
    handleShare()
  };

  const handleDownloadAsFile = () => {
    // Placeholder: Implement the logic to download the conversation as a file
    console.log('Downloading conversation as file...');
  };

  const handleCopyLink = () => {
    // Placeholder: Implement the logic to copy the existing share link
    if (localConversation.shareLink) {
      navigator.clipboard.writeText(localConversation.shareLink);
      setShareMessage({ type: 'success', message: 'Link copied to clipboard', description: localConversation.shareLink });
    }
  };

  const handleDeleteLink = () => {
    // Placeholder: Implement the logic to delete the share link
    console.log('Deleting share link...');
    // You might want to update the localConversation and call onUpdate here
  };

  return {
    localConversation,
    setLocalConversation,
    isProcessing,
    isViewTranscriptOpen,
    setIsViewTranscriptOpen,
    shareUrl,
    shareStatus,
    shareMessage,
    setShareMessage,
    handleSummarize,
    handleOnViewTranscript,
    handleAttachment,
    handleShare,
    handleShareDialogClose,
    handleUpdateTitle,
    handleGenerateShareLink,
    handleDownloadAsFile,
    handleCopyLink,
    handleDeleteLink
  }
}