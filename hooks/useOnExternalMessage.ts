'use client'

import Highlight from '@highlight-ai/app-runtime'
import { useEffect, useState } from 'react'

const useOnExternalMessage = () => {
  const [conversationId, setConversationId] = useState('')

  useEffect(() => {
    const removeExternalMessageListener = Highlight.app.addListener(
      'onExternalMessage',
      async (caller: string, message: any) => {
        setConversationId(message.conversationId)
      }
    )

    // Clean up the listener when the component unmounts
    return () => {
      removeExternalMessageListener()
    }
  }, [setConversationId])

  return conversationId
}

export default useOnExternalMessage
