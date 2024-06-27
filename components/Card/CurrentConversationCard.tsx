// components/CurrentConversationCard.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from '@/components/ui/skeleton';
import styles from '@/styles/CurrentConversationCard.module.css';

interface CurrentConversationCardProps {
  transcript: string;
  micActivity: number;
  isLoading: boolean;
}

const CurrentConversationCard: React.FC<CurrentConversationCardProps> = ({ transcript, micActivity, isLoading }) => {
  const isActive = micActivity >= 1;
  const borderClass = isActive ? styles.activeBorder : styles.inactiveBorder;

  return (
    <Card className={`w-full border-2 ${borderClass} transition-all duration-300`}>
      <CardHeader>
        <CardTitle>Current Conversation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 overflow-y-auto">
          {transcript ? (
            <>
              <p>{transcript}</p>
              {isLoading && <Skeleton className="h-4 w-[200px] mt-2" />}
            </>
          ) : (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[90%]" />
              <Skeleton className="h-4 w-[80%]" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentConversationCard;