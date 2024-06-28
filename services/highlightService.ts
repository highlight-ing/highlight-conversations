// services/highlightService.ts

import Highlight from "@highlight-ai/app-runtime";

interface LLMMessage {
  content: string;
  role: "system" | "user";
}

declare global {
  interface Window {
    highlight: {
      internal: {
        setAudioSuperpowerEnabled: (enabled: boolean) => Promise<void>;
        getTextPrediction: (messages: LLMMessage[]) => Promise<string>;
      };
    }
  }
}

// Public API functions
export const fetchTranscript = async (): Promise<string | null> => {
  return await Highlight.user.getAudio(false);
};

export const fetchLongTranscript = async (): Promise<string | null> => {
  return await Highlight.user.getAudio(true);
};

export const fetchMicActivity = async (lastNumMs: number = 300): Promise<number> => {
  return await Highlight.user.getMicActivity(lastNumMs);
};

export const setAsrRealtime = async (isRealtime: boolean): Promise<void> => {
  await Highlight.user.setAsrRealtime(isRealtime);
};

export const fetchUserFacts = async (): Promise<any> => {
  return await Highlight.user.getFacts();
};

export const fetchScreenshot = async (): Promise<string> => {
  return await Highlight.user.getScreenshot();
};

export const fetchUserEmail = async (): Promise<string> => {
  return await Highlight.user.getEmail();
};

// Internal API functions
export const setAudioSuperpowerEnabled = async (enabled: boolean): Promise<void> => {
  await window.highlight.internal.setAudioSuperpowerEnabled(enabled);
};

export const getTextPrediction = async (messages: LLMMessage[]): Promise<string> => {
  return await window.highlight.internal.getTextPrediction(messages);
};

// Event listener functions
export const addContextListener = (listener: (event: any) => void): void => {
  Highlight.addEventListener('onContext', listener);
};

export const removeContextListener = (listener: (event: any) => void): void => {
  Highlight.removeEventListener('onContext', listener);
};

export const addTextPredictionUpdateListener = (listener: (event: any) => void): void => {
  Highlight.addEventListener('onTextPredictionUpdate', listener);
};

export const removeTextPredictionUpdateListener = (listener: (event: any) => void): void => {
  Highlight.removeEventListener('onTextPredictionUpdate', listener);
};

export const addTextPredictionDoneListener = (listener: (event: any) => void): void => {
  Highlight.addEventListener('onTextPredictionDone', listener);
};

export const removeTextPredictionDoneListener = (listener: (event: any) => void): void => {
  Highlight.removeEventListener('onTextPredictionDone', listener);
};