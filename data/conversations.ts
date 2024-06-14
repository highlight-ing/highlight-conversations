// data/conversations.ts
//TODO: Temporary skeleton data
export interface ConversationData {
    id: number;
    name: string;
    date: string;
    description: string;
    audioLength: string; // in minutes and seconds e.g., "3:45"
  }
  
  export const conversations: ConversationData[] = [
    { id: 1, name: "Meeting with John", date: "2024-06-12", description: "Discussed project milestones and timelines.", audioLength: "15:30" },
    { id: 2, name: "Interview with Jane", date: "2024-06-11", description: "Talked about potential role and responsibilities.", audioLength: "45:20" },
    { id: 3, name: "Team Sync", date: "2024-06-10", description: "Weekly team sync-up meeting.", audioLength: "30:00" },
  ];
  