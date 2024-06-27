// utils/autoClear.ts
import { ConversationData } from "../data/conversations"
import { saveConversations, loadConversations } from "./localStorage";

export const clearOldConversationsMinutes = (minutes: number): void => {
  const conversations = loadConversations();
  const now = new Date();
  const filteredConversations = conversations.filter((conversation) => {
    const conversationDate = new Date(conversation.timestamp);
    const diffMs = now.getTime() - conversationDate.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    return diffMinutes < minutes;
  });
  saveConversations(filteredConversations);
};

export const clearOldConversationsDays = (days: number): void => {
  const conversations = loadConversations();
  const now = new Date();
  const filteredConversations = conversations.filter((conversation) => {
    const conversationDate = new Date(conversation.timestamp);
    const diffMs = now.getTime() - conversationDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return diffDays < days;
  });
  saveConversations(filteredConversations);
};