import { supabase } from '@/lib/supabase'

interface SharePageProps {
  params: {
    id: string
  }
}

export default async function SharePage({ params }: SharePageProps) {
  const { id } = params

  // Lookup the conversation by the ID.
  const { data: conversation, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('external_id', id)
    .maybeSingle()

  if (error) {
    console.error('Error fetching conversation', error)
    return <div>Error: {error.message}</div>
  }

  if (!conversation) {
    return <div>Conversation not found</div>
  }

  return (
    <div>
      <h1>Shared Conversation</h1>
      <p>{conversation.contents}</p>
    </div>
  )
}
