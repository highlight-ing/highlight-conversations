import { useState } from 'react'
import { ConversationData } from '@/data/conversations'
import { processConversation } from '@/services/processConversationService'
import { sendAttachmentAndOpen } from '@/services/highlightService'
import { trackEvent } from '@/lib/amplitude'
import { getShareLink, deleteShareLink } from '@/app/actions/shareConversation'
import { getUserId } from '@/utils/userUtils'
import { generateMarkdownContent } from '@/utils/markdownUtils'

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
  const [isDeleting, setIsDeleting] = useState(false)

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
    const markdown = generateMarkdownContent(localConversation);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${localConversation.title || 'conversation'}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    trackEvent('Downloaded Conversation', {});
  };

  const handleCopyLink = () => {
    if (localConversation.shareLink) {
      navigator.clipboard.writeText(localConversation.shareLink);
      setShareMessage({ type: 'success', message: 'Link copied to clipboard', description: localConversation.shareLink });
      trackEvent('Copied Share Link', {});
    }
  };

  const handleDeleteLink = async () => {
    setIsDeleting(true);
    try {
      const updatedConversation = await deleteShareLink(localConversation);
      setLocalConversation(updatedConversation);
      onUpdate(updatedConversation);
      setShareStatus('idle');
      setShareMessage({ type: 'success', message: 'Share link deleted successfully' });
      trackEvent('Deleted Share Link', {});
    } catch (error) {
      console.error('Error deleting share link:', error);
      setShareStatus('error');
      setShareMessage({ type: 'error', message: 'Failed to delete share link' });
    } finally {
      setIsDeleting(false);
    }
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
    handleDeleteLink,
    isDeleting
  }
}