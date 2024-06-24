// components/CurrentConversationCard.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import styles from '@/styles/CurrentConversationCard.module.css';

interface CurrentConversationCardProps {
  transcript: string;
  micActivity: number;
}

const CurrentConversationCard: React.FC<CurrentConversationCardProps> = ({ transcript, micActivity }) => {
  const isActive = micActivity >= 1;
  const borderClass = isActive ? styles.activeBorder : styles.inactiveBorder;

  return (
    <Card className={`w-full border-2 ${borderClass} transition-all duration-300`}>
      <CardHeader>
        <CardTitle>Current Conversation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 overflow-y-auto">
          <p>{transcript}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentConversationCard;