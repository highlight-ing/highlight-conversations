// components/CurrentConversationCard.tsx
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import styles from "@/styles/CurrentConversationCard.module.css";

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
  const isActive = micActivity >= 1;
  const borderClass = isActive ? styles.activeBorder : styles.inactiveBorder;
  const skeletonCorner = "rounded-lg";

  return (
    <Card className={`w-full border-2 ${borderClass} transition-all duration-300`}>
      <CardHeader>
        <CardTitle>Current Conversation</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col">
        <div className="relative mb-2 h-64">
          <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none"></div>
          <div className="h-full overflow-y-auto scrollbar-hide">
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
          <Skeleton className={`mt-2 h-4 w-[200px] ${skeletonCorner}`} />
        )}
      </CardContent>
    </Card>
  );
};

export default CurrentConversationCard;
