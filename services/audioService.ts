// services/audioService.ts
import Highlight from "@highlight-ai/app-runtime";

export const fetchTranscript = async (): Promise<string | null> => {
  let transcript = await Highlight.user.getAudio(false);
  return transcript;
};

export const fetchMicActivity = async (): Promise<number> => {
  return await Highlight.user.getMicActivity(300);
};

export const setAsrRealtime = async (isRealtime: boolean): Promise<void> => {
  Highlight.user.setAsrRealtime(isRealtime);
};