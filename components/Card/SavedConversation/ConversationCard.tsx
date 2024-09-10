import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ViewTranscriptDialog } from '@/components/Dialogue/View/ViewTranscriptDialog'
import { ConversationCardHeader } from './ConversationCardHeader'
import { ConversationCardContent } from './ConversationCardContent'
import { useConversationActions } from './useConversationsActions'
import { Toaster, toast } from 'sonner'
import { ShareButton } from './ShareButton'
import { useConversations } from "@/contexts/ConversationContext";
import { useAppSettings } from "@/contexts/AppSettingsContext";
import { ConversationData } from '@/data/conversations'

interface ConversationCardProps {
  conversation: ConversationData;
}

const ConversationCard: React.FC<ConversationCardProps> = ({ conversation: initialConversation }) => {
  const { updateConversation, deleteConversation, searchQuery } = useConversations();
  const { } = useAppSettings(); // Add any needed app settings

  const {
    localConversation,
    setLocalConversation,
    isViewTranscriptOpen,
    setIsViewTranscriptOpen,
    shareStatus,
    shareMessage,
    setShareMessage,
    isDeleting,
    handleSummarize,
    handleOnViewTranscript,
    handleAttachment,
    handleShare,
    handleUpdateTitle,
    handleGenerateShareLink,
    handleDownloadAsFile,
    handleCopyLink,
    handleDeleteLink
  } = useConversationActions(initialConversation, updateConversation, deleteConversation)

  useEffect(() => {
    if (shareMessage) {
      if (shareMessage.type === 'success') {
        toast.success(shareMessage.message, {
          description: shareMessage.description,
        })
      } else {
        toast.error(shareMessage.message)
      }
      setShareMessage(null)
    }
  }, [shareMessage, setShareMessage])

  return (
    <motion.div initial={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.5 }}>
      <Card className={`flex w-full flex-col rounded-lg bg-background-100 shadow h-[415px]`}>
        <ConversationCardHeader
          conversation={localConversation}
          onDelete={deleteConversation}
          onUpdateTitle={handleUpdateTitle}
        />
        <ConversationCardContent
          conversation={localConversation}
          onViewTranscript={handleOnViewTranscript}
          searchQuery={searchQuery}
        />
        <CardFooter className="px-4 pb-2">
          <ConversationCardActions
            onAttach={handleAttachment}
            onShare={handleShare}
            isSharing={shareStatus === 'processing'}
            isDeleting={isDeleting}
            hasExistingShareLink={!!localConversation.shareLink}
            onGenerateShareLink={handleGenerateShareLink}
            onDownloadAsFile={handleDownloadAsFile}
            onCopyLink={handleCopyLink}
            onDeleteLink={handleDeleteLink}
          />
        </CardFooter>
      </Card>
      <ViewTranscriptDialog
        isOpen={isViewTranscriptOpen}
        onClose={() => setIsViewTranscriptOpen(false)}
        conversation={localConversation}
        onDelete={deleteConversation}
        onSummarize={handleSummarize}
      />
      <Toaster
        theme="dark"
        className="bg-background text-foreground"
      />
    </motion.div>
  )
}

const ConversationCardActions: React.FC<{
  onAttach: () => void;
  onShare: () => void;
  isSharing: boolean;
  isDeleting: boolean;
  hasExistingShareLink: boolean;
  onGenerateShareLink: () => void;
  onDownloadAsFile: () => void;
  onCopyLink: () => void;
  onDeleteLink: () => void;
}> = ({ onAttach, onShare, isSharing, isDeleting, hasExistingShareLink, onGenerateShareLink, onDownloadAsFile, onCopyLink, onDeleteLink }) => (
  <div className="flex w-full gap-2">
    <Button
      onClick={onAttach}
      className="flex-1 items-center justify-center rounded-lg bg-background p-2 text-[15px] font-semibold text-foreground transition-colors duration-200 hover:bg-background hover:text-brand"
    >
      <span className="flex items-center gap-2">Attach to Chat</span>
    </Button>
    <ShareButton
      onShare={onShare}
      isSharing={isSharing}
      isDeleting={isDeleting}
      hasExistingShareLink={hasExistingShareLink}
      onGenerateShareLink={onGenerateShareLink}
      onDownloadAsFile={onDownloadAsFile}
      onCopyLink={onCopyLink}
      onDeleteLink={onDeleteLink}
    />
  </div>
)

export default ConversationCard