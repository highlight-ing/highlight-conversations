import React, { useEffect, useRef, useState } from 'react'
import { ConversationData } from '@/data/conversations'
import useScrollGradient from '@/hooks/useScrollGradient'
import { formatTimestamp, getRelativeTimeString } from '@/utils/dateUtils'
import { motion } from 'framer-motion'
import { getTextPredictionFromHighlight } from '@/services/highlightService'
import { GeneratedPrompt } from '@/types/types'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ProcessingDialog from '@/components/Dialogue/ProcessingDialog'
import { mockProcessConversation } from '@/services/mockProcessingService'
import { ClipboardIcon, TrashIcon, ChevronRightIcon } from '@/components/ui/icons'

interface ConversationCardProps {
  conversation: ConversationData
  onDelete: (id: string) => void
  onUpdate: (updatedConversation: ConversationData) => void
}

const ConversationCard: React.FC<ConversationCardProps> = ({ conversation, onUpdate, onDelete }) => {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSummarize = async () => {
    setIsProcessing(true)
    try {
      const processedConversation = await mockProcessConversation(conversation)
      onUpdate({ ...processedConversation, summarized: true })
    } catch (error) {
      console.error('Error processing conversation:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.5 }}>
      {/* w-64 p-4 bg-neutral-800 rounded-lg shadow flex flex-col gap-4 */}
      <Card className="flex w-full flex-col rounded-lg bg-background-100 p-0 shadow">
        <ConversationCardHeader conversation={conversation} onDelete={onDelete} />
        <CardContent className="flex flex-grow flex-col px-4 pb-4 pt-0">
          {conversation.summarized ? (
            <SummarizedContent conversation={conversation} />
          ) : (
            <UnsummarizedContent transcript={conversation.transcript} onSummarize={handleSummarize} />
          )}
        </CardContent>
        <CardFooter className="px-4 pb-4 pt-0">
          {!conversation.summarized && (
            <Button
              onClick={handleSummarize}
              className="hover:bg-brand-light w-full items-center justify-center rounded-lg bg-background p-1.5 text-[15px] font-semibold text-foreground/80 transition-colors duration-200 hover:text-brand"
            >
              Summarize
            </Button>
          )}
        </CardFooter>
      </Card>
      <ProcessingDialog isProcessing={isProcessing} />
    </motion.div>
  )
}

const ConversationCardHeader: React.FC<{ conversation: ConversationData; onDelete: (id: string) => void }> = ({
  conversation,
  onDelete
}) => {
  const [relativeTime, setRelativeTime] = useState(getRelativeTimeString(conversation.timestamp))
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'hiding'>('idle')

  useEffect(() => {
    const timer = setInterval(() => {
      setRelativeTime(getRelativeTimeString(conversation.timestamp))
    }, 60000)
    return () => clearInterval(timer)
  }, [conversation.timestamp])

  const handleCopyTranscript = () => {
    navigator.clipboard
      .writeText(conversation.transcript)
      .then(() => {
        setCopyState('copied')
        setTimeout(() => setCopyState('hiding'), 1500)
        setTimeout(() => setCopyState('idle'), 1700)
      })
      .catch((error) => {
        console.error('Failed to copy transcript:', error)
      })
  }

  return (
    <div className="flex flex-col gap-0.5 px-4 pt-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex flex-col">
          <CardTitle className="text-xl font-semibold leading-normal text-white">
            {relativeTime || 'Moments ago'}
          </CardTitle>
          <CardDescription className="text-sm leading-normal text-white/60">
            {formatTimestamp(conversation.timestamp)}
          </CardDescription>
        </div>
        <div className="flex gap-[5px]">
          <button
            onClick={handleCopyTranscript}
            className="relative h-5 w-5 text-white/60 transition-colors duration-200 hover:text-white"
          >
            <ClipboardIcon width={20} height={20} />
            {copyState !== 'idle' && (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 transform rounded bg-neutral-700 px-2 py-1 text-xs text-white shadow-md">
                Copied
              </span>
            )}
          </button>
          <button
            onClick={() => onDelete(conversation.id)}
            className="h-5 w-5 text-white/60 transition-colors duration-200 hover:text-white"
          >
            <TrashIcon width={20} height={20} />
          </button>
        </div>
      </div>
    </div>
  )
}

const UnsummarizedContent: React.FC<{ transcript: string }> = ({ transcript }) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { showTopGradient, showBottomGradient } = useScrollGradient(scrollRef)

  return (
    <div className="relative space-y-4">
      {' '}
      {/* Add relative positioning */}
      <div className="relative h-64">
        {showTopGradient && (
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-8 bg-gradient-to-b from-background-100 to-transparent" />
        )}
        {showBottomGradient && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-100 h-24 bg-gradient-to-t from-background-100 to-transparent" />
        )}
        <div ref={scrollRef} className="scrollbar-hide h-full overflow-y-auto p-0">
          <p className="select-text pb-8 text-[15px] leading-normal text-foreground/80">
            {' '}
            {/* Add bottom padding */}
            {transcript}
          </p>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center">
        <Button
          onClick={() => {}}
          variant="ghost"
          className="w-full items-center justify-center rounded-lg bg-background/20 p-2 text-[15px] font-semibold text-white backdrop-blur-sm transition-colors duration-200 hover:text-white hover:bg-background/30 hover:backdrop-blur-sm"
        >
          View Conversation
          <ChevronRightIcon width={24} height={24} className="ml-2" />
        </Button>
      </div>
    </div>
  )
}

const SummarizedContent: React.FC<{ conversation: ConversationData }> = ({ conversation }) => (
  <>
    <div className="mb-2">
      <h3 className="font-semibold">Topic:</h3>
      <p className="text-sm">{conversation.topic}</p>
    </div>
    <div className="mb-2">
      <h3 className="font-semibold">Summary:</h3>
      <p className="text-sm">{conversation.summary}</p>
    </div>
    <Button
      onClick={() => {}} // This will be implemented later
      variant="outline"
      className="mt-2 w-full justify-between"
    >
      View Conversation
      <ChevronRightIcon className="ml-2 h-4 w-4" />
    </Button>
  </>
)

export default ConversationCard

//Header old
// return (
//   // flex flex-col gap-0.5
//   // "flex justify-between items-center p-4"
//   <div className="flex flex-col gap-0.5">
//     <div>
//       <h2 className="text-lg font-semibold">{relativeTime || 'Moments ago'}</h2>
//       <p className="text-sm text-muted-foreground">{formatTimestamp(conversation.timestamp)}</p>
//     </div>
//     <div className="flex space-x-2">
//       <button
//         onClick={handleCopyTranscript}
//         className="text-muted-foreground hover:text-brand transition-colors duration-200 relative"
//       >
//         <ClipboardIcon width={18} height={18} />
//         {copyState !== 'idle' && (
//           <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-background text-muted-foreground text-xs py-1 px-2 rounded shadow-md">
//             Copied
//           </span>
//         )}
//       </button>
//       <button
//         onClick={() => onDelete(conversation.id)}
//         className="text-muted-foreground hover:text-destructive transition-colors duration-200"
//       >
//         <TrashIcon width={18} height={18} />
//       </button>
//     </div>
//   </div>
// );
