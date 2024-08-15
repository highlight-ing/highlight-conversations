// File: app/share/[id]/page.tsx
import { supabase } from '@/lib/supabase';
import { ConversationData } from '@/data/conversations';
import SharePageComponent from '@/components/Share/SharePageComponent';
import { Metadata } from 'next'
import { shareMeta } from '@/config/shareMeta'
import ogImage from '@/assets/conversations-open-graph.png'
import { checkConversationExists } from '@/app/actions/shareConversation'
import { notFound } from 'next/navigation';
import Script from 'next/script'

interface SharePageProps {
  params: {
    id: string
  }
}

async function getConversation(id: string) {
  const { data: conversation, error } = await supabase
    .from('conversations')
    .select('contents')
    .eq('external_id', id)
    .single();

  if (error || !conversation) {
    return null;
  }

  return conversation;
}

export async function generateMetadata({ params }: SharePageProps): Promise<Metadata> {
  const { id } = params;
  const conversation = await getConversation(id);

  if (!conversation) {
    return {
      title: 'Shared Conversation | Highlight',
      description: 'View a shared conversation from Highlight',
      // ... default OpenGraph and Twitter card metadata
    }
  }

  const parsedConversation: ConversationData = JSON.parse(conversation.contents);
  const conversationTitle = parsedConversation.title || 'Untitled Conversation';
  const conversationDescription = parsedConversation.summary || 'View this shared conversation from Highlight';

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
}

export default async function SharePage({ params }: SharePageProps) {
  const { id } = params;

  try {
    const conversation = await getConversation(id);

    if (!conversation) {
      notFound();
    }

    let parsedConversation: ConversationData;
    try {
      parsedConversation = JSON.parse(conversation.contents);
      parsedConversation.timestamp = new Date(parsedConversation.timestamp);
    } catch (parseError) {
      console.error('Error parsing conversation data:', parseError);
      notFound();
    }

    return (
      <>
        <div className="h-screen bg-background" data-conversation-id={id}>
          <SharePageComponent conversation={parsedConversation} />
        </div>
        <Script id="check-conversation-exists" strategy="afterInteractive">
          {`
            async function checkConversationExists() {
              const conversationId = document.querySelector('[data-conversation-id]').dataset.conversationId;
              const formData = new FormData();
              formData.append('id', conversationId);
              
              const response = await fetch('/share', {
                method: 'POST',
                body: formData,
              });

              if (!response.ok) {
                window.location.href = '/not-found';
              }
            }

            setInterval(checkConversationExists, 30000); // Check every 30 seconds
          `}
        </Script>
      </>
    );
  } catch (error) {
    console.error('Unexpected error in SharePage:', error);
    notFound();
  }
}