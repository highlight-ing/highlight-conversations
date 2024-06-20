"use client";
import React, { useState, useEffect, useRef } from "react";
import { fetchTranscript, fetchMicActivity } from "../services/audioService";
import ConversationTable from "../components/table/data-table";
import CurrentTranscriptComponent from "../components/CurrentTranscriptComponent";
import { ConversationData, mockConversations } from "../data/conversations";
import Header from "../components/Header/Header";
import Head from "next/head";
import ConversationGrid from "../components/Card/ConversationGrid";

const HomePage: React.FC = () => {
  const [currentTranscript, setCurrentTranscript] = useState<string>("");
  const [conversations, setConversations] =
    useState<ConversationData[]>(mockConversations);
  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [micActivity, setMicActivity] = useState<number>(0);
  const micActivityRef = useRef<number>(micActivity);
  const activityDurationRef = useRef<number>(0);
  const [autoClearValue, setAutoClearValue] = useState(1);

  useEffect(() => {
    const pollMicActivity = async () => {
      const activity = await fetchMicActivity();
      setMicActivity(activity);
    };

    const intervalId = setInterval(pollMicActivity, 100); // Poll every 100 ms

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  useEffect(() => {
    const checkMicActivity = () => {
      if (micActivityRef.current === 0 || micActivityRef.current === 1) {
        activityDurationRef.current += 1;
      } else {
        activityDurationRef.current = 0;
      }

      if (activityDurationRef.current >= 10) {
        console.log("activityDurationRef.current", activityDurationRef.current);
        if (timeoutId) clearTimeout(timeoutId);
        const newTimeoutId = setTimeout(() => {
          setIsWaiting(true);
          fetchTranscript(
            currentTranscript,
            setCurrentTranscript,
            setConversations,
            setIsWaiting,
            timeoutId,
            setTimeoutId,
          );
        }, 0);
        setTimeoutId(newTimeoutId);
        activityDurationRef.current = 0;
      }
    };

    const intervalId = setInterval(checkMicActivity, 1000); // Check every second

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [currentTranscript, timeoutId]);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header
        autoClearValue={autoClearValue}
        onAutoClearValueChange={setAutoClearValue}
      />
      <ConversationGrid conversations={conversations} />
    </div>
  );
};

export default HomePage;
