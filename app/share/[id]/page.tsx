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

  const { data: conversation, error } = await supabase
    .from('conversations')
    .select('contents')
    .eq('external_id', id)
    .single();

  if (error) {
    console.error('Error fetching conversation', error);
    return <div>Error: {error.message}</div>;
  }

  if (!conversation) {
    return <div>Conversation not found</div>;
  }

  const parsedConversation: ConversationData = JSON.parse(conversation.contents);

  return <SharePageComponent conversation={parsedConversation} />;
}