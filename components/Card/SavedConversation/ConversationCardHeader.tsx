import React, { useState, useEffect, useRef } from 'react'
import { ConversationData } from '@/data/conversations'
import { formatTimestamp, getRelativeTimeString } from '@/utils/dateUtils'
import { CardDescription, CardTitle } from '@/components/ui/card'
import { ClipboardIcon } from '@/components/ui/icons'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipState } from '@/components/Tooltip/Tooltip'
import DeleteConversationDialog from '@/components/Card/DeleteConversationDialog'
import { Pencil1Icon } from '@radix-ui/react-icons'

export const ConversationCardHeader: React.FC<{
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