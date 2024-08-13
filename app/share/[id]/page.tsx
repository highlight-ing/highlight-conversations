// File: app/share/[id]/page.tsx
import { supabase } from '@/lib/supabase';
import { ConversationData } from '@/data/conversations';
import SharePageComponent from '@/components/Share/SharePageComponent';

interface SharePageProps {
  params: {
    id: string
  }
}

export default async function SharePage({ params }: SharePageProps) {
  const { id } = params;

  try {
    const { data: conversation, error } = await supabase
      .from('conversations')
      .select('contents')
      .eq('external_id', id)
      .single();

    if (error) {
      console.error('Error fetching conversation', error);
      return <div className="p-8 text-destructive">Error: {error.message}</div>;
    }

    if (!conversation) {
      console.log('Conversation not found');
      return <div className="p-8 text-destructive">Conversation not found</div>;
    }

    let parsedConversation: ConversationData;
    try {
      parsedConversation = JSON.parse(conversation.contents);
      parsedConversation.timestamp = new Date(parsedConversation.timestamp);
    } catch (parseError) {
      console.error('Error parsing conversation data:', parseError);
      return <div className="p-8 text-destructive">Error: Invalid conversation data</div>;
    }

    return (
      <div className="h-screen bg-background">
        <SharePageComponent conversation={parsedConversation} />
      </div>
    );
  } catch (error) {
    console.error('Unexpected error in SharePage:', error);
    return <div className="p-8 text-destructive">An unexpected error occurred</div>;
  }
}