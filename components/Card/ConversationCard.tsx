import React, { useEffect, useRef, useState } from 'react'
import { ConversationData, formatTranscript } from '@/data/conversations'
import useScrollGradient from '@/hooks/useScrollGradient'
import { formatTimestamp, getRelativeTimeString } from '@/utils/dateUtils'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ProcessingDialog from '@/components/Dialogue/ProcessingDialog'
import { processConversation } from '@/services/processConversationService'
import { ClipboardIcon, TrashIcon } from '@/components/ui/icons'
import { Badge } from '@/components/ui/badge'
import { ViewTranscriptDialog } from '@/components/Dialogue/ViewTranscriptDialog'
import { Tooltip, TooltipState } from '@/components/Tooltip/Tooltip'
import { sendAttachmentAndOpen } from '@/services/highlightService'
import DeleteConversationDialog from '@/components/Card/DeleteConversationDialog'
import { ChevronRightIcon } from '@radix-ui/react-icons'
import { trackEvent } from '@/lib/amplitude'
import { Pencil1Icon } from '@radix-ui/react-icons'
import ShareDialog from '@/components/Dialogue/Share/ShareDialog'
import { getAccessToken } from '@/services/highlightService'

type AbortError = Error & { name: 'AbortError' }

const highlightText = (text: string, query: string) => {
  if (!query) return text
  const parts = text.split(new RegExp(`(${query})`, 'gi'))
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <span key={i} className="bg-brand/80 text-background">
        {part}
      </span>
    ) : (
      part
    )
  )
}

interface ConversationCardProps {
  conversation: ConversationData
  onDelete: (id: string) => void
  onUpdate: (updatedConversation: ConversationData) => void
  searchQuery: string
  height: string // Add height prop
}

const ConversationCard: React.FC<ConversationCardProps> = ({
  conversation,
  onUpdate,
  onDelete,
  searchQuery,
  height
}) => {
  const [localConversation, setLocalConversation] = useState(conversation)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isViewTranscriptOpen, setIsViewTranscriptOpen] = useState(false)
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [shareStatus, setShareStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle')
  const [isMounted, setIsMounted] = useState(false)
  const shareTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    setIsMounted(true)
    return () => {
      if (shareTimeoutRef.current) {
        clearTimeout(shareTimeoutRef.current)
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  useEffect(() => {
    setLocalConversation(conversation)
  }, [conversation])

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
      trackEvent('Conversations Interaction', {
        action: 'Conversation Summarized'
      })
    }
  }

  const handleOnViewTranscript = async () => {
    setIsViewTranscriptOpen(true)
  }

  const handleAttachment = async () => {
    let toAppId = 'highlightchat'
    let transcript = localConversation.transcript
    await sendAttachmentAndOpen(toAppId, transcript)
    trackEvent('Conversations Interaction', {
      action: 'Conversation Prompted with HL Chat'
    })
  }

  const handleShare = async () => {
    setIsShareDialogOpen(true)
    setShareStatus('processing')

    if (localConversation.shareLink) {
      setShareUrl(localConversation.shareLink)
      setShareStatus('success')
      trackEvent('Conversations Interaction', {
        action: 'Conversation Shared (Existing Link)'
      })
      return
    }

    // Set up timeout
    shareTimeoutRef.current = setTimeout(() => {
      setShareStatus('error')
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }, 15000) // 15 seconds timeout

    // Set up abort controller
    abortControllerRef.current = new AbortController()

    try {
      let updatedConversation = localConversation

      if (!localConversation.summarized) {
        updatedConversation = await processConversation(localConversation, abortControllerRef.current.signal)
        setLocalConversation(updatedConversation)
        onUpdate(updatedConversation)
      }

      const accessToken = await getAccessToken()

      const response = await fetch('/api/share-conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify(updatedConversation),
        signal: abortControllerRef.current.signal
      })
      const data = await response.json()

      updatedConversation = {
        ...updatedConversation,
        shareLink: data.shareUrl
      }
      setLocalConversation(updatedConversation)
      onUpdate(updatedConversation)

      setShareUrl(data.shareUrl)
      setShareStatus('success')
      trackEvent('Conversations Interaction', {
        action: 'Conversation Shared (New Link)'
      })
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Share operation was aborted')
      } else {
        console.error('Error sharing conversation:', error)
        setShareStatus('error')
      }
    } finally {
      if (shareTimeoutRef.current) {
        clearTimeout(shareTimeoutRef.current)
      }
    }
  }

  const handleShareDialogClose = () => {
    setIsShareDialogOpen(false)
    setShareStatus('idle')
    if (shareTimeoutRef.current) {
      clearTimeout(shareTimeoutRef.current)
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }

  const handleUpdateTitle = (id: string, newTitle: string) => {
    const updatedConversation = { ...localConversation, title: newTitle }
    setLocalConversation(updatedConversation)
    onUpdate(updatedConversation)
  }

  return (
    <motion.div initial={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.5 }}>
      <Card className={`flex w-full flex-col rounded-lg bg-background-100 shadow ${height}`}>
        <ConversationCardHeader
          conversation={localConversation}
          onDelete={onDelete}
          onUpdateTitle={handleUpdateTitle}
        />
        <CardContent className="flex flex-grow flex-col px-4">
          {localConversation.summarized ? (
            <SummarizedContent
              conversation={localConversation}
              onViewTranscript={handleOnViewTranscript}
              searchQuery={searchQuery}
            />
          ) : (
            <UnsummarizedContent
              transcript={localConversation.transcript}
              onViewTranscript={handleOnViewTranscript}
              searchQuery={searchQuery}
            />
          )}
        </CardContent>
        <CardFooter className="px-4 pb-2">
          <div className="flex w-full gap-2">
            <Button
              onClick={handleAttachment}
              className="flex-1 items-center justify-center rounded-lg bg-background p-2 text-[15px] font-semibold text-foreground transition-colors duration-200 hover:bg-background hover:text-brand"
            >
              <span className="flex items-center gap-2">Attach to Chat</span>
            </Button>
            <Button
              onClick={handleShare}
              className="flex-1 items-center justify-center rounded-lg bg-background p-2 text-[15px] font-semibold text-foreground transition-colors duration-200 hover:bg-background hover:text-brand"
            >
              <span className="flex items-center gap-2">Share</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
      <ProcessingDialog isProcessing={isProcessing} />
      <ViewTranscriptDialog
        isOpen={isViewTranscriptOpen}
        onClose={() => setIsViewTranscriptOpen(false)}
        conversation={localConversation}
        onDelete={onDelete}
        onSummarize={handleSummarize}
      />
      {isMounted && (
        <ShareDialog
          isOpen={isShareDialogOpen}
          onOpenChange={handleShareDialogClose}
          status={shareStatus}
          url={shareUrl}
        />
      )}
    </motion.div>
  )
}

const ConversationCardHeader: React.FC<{
  conversation: ConversationData
  onDelete: (id: string) => void
  onUpdateTitle: (id: string, newTitle: string) => void
}> = ({ conversation, onDelete, onUpdateTitle }) => {
  const [relativeTime, setRelativeTime] = useState(getRelativeTimeString(conversation.timestamp))
  const [copyTooltipState, setCopyTooltipState] = useState<TooltipState>('idle')
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(conversation.title || relativeTime)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setRelativeTime(getRelativeTimeString(conversation.timestamp))
    }, 60000)
    return () => clearInterval(timer)
  }, [conversation.timestamp])

  useEffect(() => {
    setTitle(conversation.title || relativeTime)
  }, [conversation.title, relativeTime])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const handleTitleBlur = () => {
    setIsEditing(false)
    if (title.trim() === '') {
      setTitle(relativeTime)
    } else {
      onUpdateTitle(conversation.id, title)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTitleBlur()
    }
  }

  const handleCopyTranscript = () => {
    const clipboardContent = conversation.summarized
      ? `Topic: ${conversation.topic}\n\nSummary: ${conversation.summary}\n\nTranscript: ${conversation.transcript}`
      : conversation.transcript

    navigator.clipboard
      .writeText(clipboardContent)
      .then(() => {
        setCopyTooltipState('success')
        setTimeout(() => setCopyTooltipState('hiding'), 1500)
        setTimeout(() => setCopyTooltipState('idle'), 1700)
      })
      .catch((error) => {
        console.error('Failed to copy transcript:', error)
        setCopyTooltipState('idle')
      })
  }

  return (
    <div className="flex flex-col gap-0.5 px-8 pt-4">
      <div className="flex items-center justify-between">
        <div className="group relative flex flex-col">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={title}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              onKeyDown={handleKeyDown}
              className="border-b border-white/20 bg-transparent text-xl font-bold leading-normal text-white focus:border-white/50 focus:outline-none"
            />
          ) : (
            <CardTitle
              className="cursor-pointer rounded text-xl font-bold leading-normal text-white transition-colors duration-200 group-hover:bg-white/10"
              onClick={() => setIsEditing(true)}
            >
              {title}
              <Pencil1Icon className="ml-2 inline-block h-4 w-4 text-white/50 transition-colors duration-200 group-hover:text-white" />
            </CardTitle>
          )}
          <div className="flex items-center gap-2">
            <CardDescription className="text-[0.825rem] font-medium leading-relaxed text-white/50">
              {formatTimestamp(conversation.timestamp)}
            </CardDescription>
            {conversation.summarized && <Badge className="text-xs text-foreground/75">Summarized</Badge>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={handleCopyTranscript}
              onMouseEnter={() => setCopyTooltipState('active')}
              onMouseLeave={() => setCopyTooltipState('idle')}
              className="flex items-center justify-center text-muted-foreground transition-colors duration-200 hover:text-brand"
            >
              <ClipboardIcon width={24} height={24} className="" />
              <Tooltip type="copy" state={copyTooltipState} />
            </button>
          </div>
          <DeleteConversationDialog onDelete={() => onDelete(conversation.id)} />
        </div>
      </div>
    </div>
  )
}

interface UnsummarizedContentProps {
  transcript: string
  onViewTranscript: () => void
  searchQuery: string
}

const UnsummarizedContent: React.FC<UnsummarizedContentProps> = ({ transcript, onViewTranscript, searchQuery }) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { showTopGradient, showBottomGradient } = useScrollGradient(scrollRef)

  return (
    <div className="group relative cursor-pointer" onClick={onViewTranscript}>
      <div className="relative h-[275px] rounded-lg bg-background-100 transition-all duration-200 group-hover:bg-background-200/50">
        {showTopGradient && (
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-8 bg-gradient-to-b from-background-100 to-transparent" />
        )}
        {showBottomGradient && (
          <div className="z-100 pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background-100 to-transparent" />
        )}
        <div ref={scrollRef} className="custom-scrollbar h-full overflow-y-auto p-4">
          <p className="select-text whitespace-pre-wrap text-[15px] leading-relaxed text-foreground/80">
            {highlightText(formatTranscript(transcript, 'CardTranscript'), searchQuery)}
          </p>
        </div>
      </div>
      <ViewIndicator />
    </div>
  )
}

interface SummarizedContentProps {
  conversation: ConversationData
  onViewTranscript: () => void
  searchQuery: string
}

const SummarizedContent: React.FC<SummarizedContentProps> = ({ conversation, onViewTranscript, searchQuery }) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { showTopGradient, showBottomGradient } = useScrollGradient(scrollRef)

  return (
    <div className="group relative cursor-pointer space-y-4" onClick={onViewTranscript}>
      <div className="relative h-[225px] rounded-lg bg-background-100 transition-all duration-200 group-hover:bg-background-200/50">
        {showTopGradient && (
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-8 bg-gradient-to-b from-background-100 to-transparent" />
        )}
        {showBottomGradient && (
          <div className="z-100 pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background-100 to-transparent" />
        )}
        <div ref={scrollRef} className="custom-scrollbar h-full overflow-y-auto p-4">
          <h3 className="mb-1 text-sm font-semibold text-white/60">Summary:</h3>
          <p className="select-text text-[15px] leading-normal text-white">
            {highlightText(conversation.summary, searchQuery)}
          </p>
        </div>
      </div>
      <ViewIndicator />
    </div>
  )
}

const ViewIndicator: React.FC = () => {
  return (
    <div className="absolute bottom-2 right-2">
      <div className="flex items-center rounded-lg bg-background/10 px-2 py-1 text-sm font-medium text-foreground/70 backdrop-blur-sm group-hover:text-foreground">
        <span className="mr-1">View</span>
        <ChevronRightIcon className="h-4 w-4" />
      </div>
    </div>
  )
}

export default ConversationCard
