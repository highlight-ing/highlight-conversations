// File: app/share/[id]/page.tsx
import { supabase } from '@/lib/supabase';
import { ConversationData } from '@/data/conversations';
import SharePageComponent from '@/components/Share/SharePageComponent';
import { Metadata } from 'next'
import { shareMeta } from '@/config/shareMeta'

import ogImage from '@/assets/conversations-open-graph.png'

interface SharePageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: SharePageProps): Promise<Metadata> {
  const { id } = params;

  try {
    const { data: conversation, error } = await supabase
      .from('conversations')
      .select('contents')
      .eq('external_id', id)
      .single();

    if (error || !conversation) {
      throw new Error('Conversation not found');
    }

    const parsedConversation: ConversationData = JSON.parse(conversation.contents);
    const conversationTitle = parsedConversation.title || 'Untitled Conversation';
    const conversationDescription = parsedConversation.summary || 'View this shared conversation from Highlight';

    // const ogImageUrl = `${shareMeta.baseURL}api/og?title=${encodeURIComponent(conversationTitle)}`;

    return {
      title: `${conversationTitle} - Transcribed with Conversations | by Highlight`,
      description: conversationDescription,
      openGraph: {
        title: `${conversationTitle} - Transcribed with Conversations | by Highlight`,
        description: conversationDescription,
        url: `https://conversations.app.highlight.ing/share/${id}`,
        siteName: shareMeta.siteName,
        images: [
          {
            url: ogImage.src,
            width: ogImage.width,
            height: ogImage.height,
            alt: `Conversations Logo for ${conversationTitle}`,
          }
        ],
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${conversationTitle} - Transcribed with Conversations | by Highlight`,
        description: conversationDescription,
        images: [ogImage.src],
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Shared Conversation | Highlight',
      description: 'View a shared conversation from Highlight',
      // ... default OpenGraph and Twitter card metadata
    }
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