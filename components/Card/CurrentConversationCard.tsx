// components/CurrentConversationCard.tsx
import React, { useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import styles from "@/styles/CurrentConversationCard.module.css";
import useScrollGradient from "@/hooks/useScrollGradient";
interface CurrentConversationCardProps {
  transcript: string;
  micActivity: number;
  isWaitingForTranscript: boolean;
}

const CurrentConversationCard: React.FC<CurrentConversationCardProps> = ({
  transcript,
  micActivity,
  isWaitingForTranscript,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { showTopGradient, showBottomGradient } = useScrollGradient(scrollRef)

  const isActive = micActivity >= 1;
  const borderClass = isActive ? styles.activeBorder : styles.inactiveBorder;
  const skeletonCorner = "rounded-lg";

  return (
    <Card className={`w-full border-2 ${borderClass} transition-all duration-300 bg-background-100`}>
      <CardHeader>
        <CardTitle>Current Conversation</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col">
        <div className="relative mb-2 h-64">
          {transcript && showTopGradient && (
            <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none"></div>
          )}
          {transcript && showBottomGradient && (
            <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none"></div>
          )}
          <div 
            ref={scrollRef}
            className="h-full overflow-y-auto scrollbar-hide"
          >
            {transcript ? (
              <p className="px-1">{transcript}</p>
            ) : (
              <div className="space-y-2">
                <Skeleton className={`h-24 w-full ${skeletonCorner}`} />
                <Skeleton className={`h-4 w-full ${skeletonCorner}`} />
                <Skeleton className={`h-4 w-[80%] ${skeletonCorner}`} />
                <Skeleton className={`h-4 w-[60%] ${skeletonCorner}`} />
              </div>
            )}
          </div>
        </div>
        {isWaitingForTranscript && transcript && (
          <>
            <Skeleton className={`mt-2 h-4 w-full ${skeletonCorner}`} />
            <Skeleton className={`mt-2 h-4 w-[80%] ${skeletonCorner}`} />
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default CurrentConversationCard;
