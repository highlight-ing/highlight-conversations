import React, { useState, useEffect, useCallback, useRef } from "react";
import { fetchTranscript, fetchMicActivity } from "../../services/audioService";
import { ConversationData, mockConversations } from "../../data/conversations";
import ConversationGrid from "../Card/ConversationGrid";
import { v4 as uuidv4 } from "uuid";

const POLL_MIC_INTERVAL = 100; // Poll every 100 ms
const POLL_TRANSCRIPT_INTERVAL = 29000; // Poll every 29 seconds
const IDLE_THRESHOLD = 150; // 15 seconds (150 * 100ms) of low activity to consider conversation ended

interface ConversationsManagerProps {
  onMicActivityChange: (activity: number) => void;
}

const ConversationsManager: React.FC<ConversationsManagerProps> = ({
  onMicActivityChange,
}) => {
  const [currentConversation, setCurrentConversation] = useState("");
  const [conversations, setConversations] =
    useState<ConversationData[]>(mockConversations);
  const [micActivity, setMicActivity] = useState(0);
  const [isWaitingForTranscript, setIsWaitingForTranscript] = useState(false);
  const idleCountRef = useRef(0);
  const pollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const pollMicActivity = useCallback(async () => {
    const activity = await fetchMicActivity();
    setMicActivity(activity);
    onMicActivityChange(activity);

    if (activity <= 1) {
      idleCountRef.current += 1;
    } else {
      idleCountRef.current = 0;
    }

    if (idleCountRef.current >= IDLE_THRESHOLD && currentConversation.trim()) {
      const newConversation = createConversation(currentConversation);
      setConversations((prev) => [newConversation, ...prev]);
      setCurrentConversation("");
      idleCountRef.current = 0;
    }
  }, [onMicActivityChange, currentConversation]);

  const pollTranscription = useCallback(async () => {
    setIsWaitingForTranscript(false);
    try {
      const transcript = await fetchTranscript();
      if (transcript) {
        setCurrentConversation((prev) => prev.trim() + " " + transcript.trim());
      }
    } catch (error) {
      console.error("Error fetching transcript:", error);
    } finally {
      setIsWaitingForTranscript(true);
    }
  }, []);

  // Effect for polling mic activity
  useEffect(() => {
    const intervalId = setInterval(pollMicActivity, POLL_MIC_INTERVAL);
    return () => clearInterval(intervalId);
  }, [pollMicActivity]);

  // Effect for polling transcription
  useEffect(() => {
    const pollTranscriptionWithTimeout = () => {
      pollTranscription();
      pollTimeoutRef.current = setTimeout(
        pollTranscriptionWithTimeout,
        POLL_TRANSCRIPT_INTERVAL,
      );
    };

    pollTranscriptionWithTimeout(); // Initial poll

    return () => {
      if (pollTimeoutRef.current) {
        clearTimeout(pollTimeoutRef.current);
      }
    };
  }, [pollTranscription]);

  // Test for isWaitingForTranscript
  useEffect(() => {
    console.log("isWaitingForTranscript changed:", isWaitingForTranscript);
  }, [isWaitingForTranscript]);

  return (
    <ConversationGrid
      currentConversation={currentConversation}
      conversations={conversations}
      micActivity={micActivity}
      isWaitingForTranscript={isWaitingForTranscript}
    />
  );
};

const createConversation = (transcript: string): ConversationData => {
  let uuid = uuidv4();
  return {
    id: uuid,
    summary: transcript.slice(0, 50),
    topic: uuid.slice(0, 4),
    transcript: transcript,
    timestamp: new Date().toISOString().slice(0, 19).replace("T", " "),
  };
};

export default ConversationsManager;
