// services/highlightService.ts
import Highlight from "@highlight-ai/app-runtime";
import { GeneratedPrompt, LLMMessage } from '../types/types';
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

export const getTextPrediction = async (conversation: string): Promise<GeneratedPrompt[]> => {
  const messages: LLMMessage[] = [
    { 
      role: "system", 
      content: "Using the following conversation recorded through a computer microphone, generate 5 insightful and diverse prompts or questions that could be used to further explore or analyze the main topics discussed. These prompts should be suitable for processing by a language model to gain deeper insights into the conversation. Format each prompt as a numbered list item."
    },
    { 
      role: "user", 
      content: conversation 
    }
  ];

  return new Promise((resolve, reject) => {
    let accumulatedText = '';
    
    const predictionId = window.highlight.internal.getTextPrediction(messages);

    const updateListener = (event: any) => {
      if (event.id === predictionId) {
        console.log('prediction:' + event.text);
        accumulatedText += event.text;
      }
    };

    const doneListener = (event: any) => {
      if (event.id === predictionId) {
        window.highlight.removeEventListener('onTextPredictionUpdate', updateListener);
        window.highlight.removeEventListener('onTextPredictionDone', doneListener);
        
        // Parse the accumulated text into individual prompts
        const parsedPrompts = parsePrompts(accumulatedText);
        resolve(parsedPrompts);
      }
    };

    window.highlight.addEventListener('onTextPredictionUpdate', updateListener);
    window.highlight.addEventListener('onTextPredictionDone', doneListener);

    // Optional: Add a timeout
    setTimeout(() => {
      window.highlight.removeEventListener('onTextPredictionUpdate', updateListener);
      window.highlight.removeEventListener('onTextPredictionDone', doneListener);
      reject(new Error('Text prediction timed out'));
    }, 30000); // 30 second timeout
  });
};

const parsePrompts = (text: string): GeneratedPrompt[] => {
  return text.split('\n')
    .filter(line => /^\d+\./.test(line))
    .map((line, index) => ({
      text: line.replace(/^\d+\.\s*/, '').trim(),
      index: index + 1
    }));
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