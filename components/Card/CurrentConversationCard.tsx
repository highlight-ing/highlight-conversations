// components/CurrentConversationCard.tsx
import React, { useRef, useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import styles from "@/styles/CurrentConversationCard.module.css"
import useScrollGradient from "@/hooks/useScrollGradient"
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardIcon, SaveIcon } from '@/components/ui/icons'

interface CurrentConversationCardProps {
  transcript: string;
  micActivity: number;
  isAudioEnabled: boolean;
  nextTranscriptIn: number;
  onSave: () => void
}

const CurrentConversationCard: React.FC<CurrentConversationCardProps> = ({
  transcript,
  micActivity,
  isAudioEnabled,
  nextTranscriptIn,
  onSave,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { showTopGradient, showBottomGradient } = useScrollGradient(scrollRef)

  const [isActive, setIsActive] = useState(false);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const borderClass = isActive ? styles.activeBorder : styles.inactiveBorder;

  const skeletonCorner = "rounded-lg";

  const isSaveDisabled = transcript.trim().length === 0;

  const [transcriptKey, setTranscriptKey] = useState(0);

  useEffect(() => {
    setTranscriptKey(prevKey => prevKey + 1);
  }, [transcript]);

  useEffect(() => {
    if (micActivity > 0) {
      setIsActive(true);
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
        inactivityTimerRef.current = null;
      }
    } else {
      // Start a timer to set isActive to false after 1 second of inactivity
      if (!inactivityTimerRef.current) {
        inactivityTimerRef.current = setTimeout(() => {
          setIsActive(false);
          inactivityTimerRef.current = null;
        }, 1500);
      }
    }

    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [micActivity]);

  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'hiding'>('idle');

  const handleCopyTranscript = () => {
    if (isSaveDisabled) return
    navigator.clipboard.writeText(transcript)
      .then(() => {
        setCopyState('copied');
        setTimeout(() => setCopyState('hiding'), 1500); // Start hiding after 1.5s
        setTimeout(() => setCopyState('idle'), 1700); // Set to idle after fade out
      })
      .catch((error) => {
        console.error("Failed to copy transcript:", error);
      });
  };

  return (
    <Card className={`w-full border-2 ${borderClass} transition-all duration-300 bg-background-100 relative`}>
      <CardHeader className="flex flex-row items-baseline">
        <CardTitle>Current Conversation</CardTitle>
        <div className="flex space-x-1">
          <div className="relative">
            <button
              onClick={handleCopyTranscript}
              className={`text-muted-foreground transition-colors duration-200 flex items-center justify-center
                ${isSaveDisabled
                  ? 'text-muted-foreground/40 cursor-not-allowed'
                  : 'hover:text-brand'
                }`}
            >
              <ClipboardIcon width={24} height={24} className="" />
            </button>
            <div
              className={`absolute -top-8 left-1/2 transform -translate-x-1/2 bg-background text-brand text-xs py-1 px-2 rounded shadow-md pointer-events-none transition-opacity duration-200 ${copyState === 'copied' ? 'animate-fadeIn opacity-100' : copyState === 'hiding' ? 'animate-fadeOut opacity-0' : 'opacity-0'}`}
            >
              Copied
            </div>
          </div>
          <button
            onClick={onSave}
            disabled={isSaveDisabled}
            className={`text-muted-foreground transition-colors duration-200 flex items-center justify-center
              ${isSaveDisabled ? 'text-muted-foreground/40 cursor-not-allowed' : 'hover:text-brand'}`}
          >
            <SaveIcon width={24} height={24} viewBox={"0 0 20 20"} className="" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col">
        {isAudioEnabled ? (
          <>
            <div className="space-y-2 mb-2">
              {!transcript && <p className="text-sm font-medium">Listening ...</p>}
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <p>Next transcript in {nextTranscriptIn}s</p>
                <div className="animate-spin h-4 w-4 border-2 border-muted-foreground border-t-transparent rounded-full"></div>
              </div>
              {transcript && <Skeleton className={`h-4 w-full ${skeletonCorner}`} />}
            </div>
            <div className="relative h-56">
              {transcript && showTopGradient && (
                <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-background-100 to-transparent z-10 pointer-events-none"></div>
              )}
              {transcript && showBottomGradient && (
                <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-background-100 to-transparent z-10 pointer-events-none"></div>
              )}
              <AnimatePresence mode="wait">
                {!transcript ? (
                  <motion.div
                    key="listening"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2"
                  >
                    <Skeleton className={`h-24 w-full ${skeletonCorner}`} />
                    <Skeleton className={`h-4 w-full ${skeletonCorner}`} />
                    <Skeleton className={`h-4 w-[80%] ${skeletonCorner}`} />
                    <Skeleton className={`h-4 w-[60%] ${skeletonCorner}`} />
                  </motion.div>
                ) : (
                  <motion.div
                    key={`transcript-${transcriptKey}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-full overflow-y-auto scrollbar-hide"
                    ref={scrollRef}
                  >
                    <p className="px-1">{transcript}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-56">
            <p className="text-center text-muted-foreground max-w-sm">
              Microphone input is disabled. Please enable it to receive transcripts of your conversations.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default CurrentConversationCard;