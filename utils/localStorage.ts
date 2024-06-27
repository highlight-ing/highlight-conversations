import { ConversationData } from "../data/conversations"

const STORAGE_KEY = 'conversations';

export const saveConversations = (conversations: ConversationData[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
};

export const loadConversations = (): ConversationData[] => {
  const storedConversations = localStorage.getItem(STORAGE_KEY);
  return storedConversations ? JSON.parse(storedConversations) : [];
};