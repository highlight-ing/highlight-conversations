import { NextRequest, NextResponse } from 'next/server'
import { shareConversation } from '@/services/shareService'

export async function POST(request: NextRequest) {
  try {
    const conversation = await request.json()
    const shareUrl = await shareConversation(conversation)
    return NextResponse.json({ shareUrl })
  } catch (error) {
    console.error('Error sharing conversation:', error)
    return NextResponse.json({ error: 'Error sharing conversation' }, { status: 500 })
  }
}