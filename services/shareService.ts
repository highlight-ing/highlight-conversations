import { createClient } from '@supabase/supabase-js'
import { ConversationData } from '@/data/conversations';
import { v4 as uuidv4 } from 'uuid';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Supabase URL or Service Role Key is not set');
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function shareConversation(conversation: ConversationData): Promise<string> {
  const slug = uuidv4();
  
  const { data, error } = await supabase
    .from('conversations')
    .insert({
      external_id: slug,
      contents: JSON.stringify(conversation),
      highlight_user_id: 'user_id_here', // You'll need to implement user authentication
    });

  if (error) {
    throw new Error(`Error sharing conversation: ${error.message}`);
  }

  return `https://conversations.app.highlight.ing//share/${slug}`;
}