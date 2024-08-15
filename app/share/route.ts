import { checkConversationExists } from '@/app/actions/shareConversation'

export async function POST(request: Request) {
  const formData = await request.formData();
  const id = formData.get('id') as string;

  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing conversation ID' }), { status: 400 });
  }

  const exists = await checkConversationExists(id);

  if (!exists) {
    return new Response(JSON.stringify({ error: 'Conversation not found' }), { status: 404 });
  }

  return new Response(JSON.stringify({ success: true }));
}