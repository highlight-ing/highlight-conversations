import { NextRequest, NextResponse } from 'next/server'
import { shareConversation } from '@/services/shareService'
import { jwtVerify } from 'jose'

export async function POST(request: NextRequest) {
  // Check if the request has an Authorization header
  if (!request.headers.get('Authorization')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const authHeader = request.headers.get('Authorization')
  const token = authHeader?.split(' ')[1]

  // Check if the token is valid
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  let payload
  try {
    payload = await jwtVerify(token, new TextEncoder().encode(process.env.HIGHLIGHT_JWT_SECRET))
  } catch (error) {
    // The token failed verification, someone could be messing with the token.
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = payload.payload.sub

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const conversation = await request.json()
    conversation.userId = userId
    const shareUrl = await shareConversation(conversation)
    return NextResponse.json({ shareUrl })
  } catch (error) {
    console.error('Error sharing conversation:', error)
    return NextResponse.json({ error: 'Error sharing conversation' }, { status: 500 })
  }
}
