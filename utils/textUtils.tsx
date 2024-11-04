import React from 'react'

const MAX_QUERY_LENGTH = 250 // Adjust as needed

export const highlightText = (text: string, query: string) => {
  if (!query || query.length > MAX_QUERY_LENGTH) return text

  // Escape special regex characters
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  // Use a try-catch block to handle any potential regex errors
  try {
    const regex = new RegExp(`(${escapedQuery})`, 'gi')
    const parts = text.split(regex)
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() ? 
        <mark key={i} className="bg-brand text-brand/5">{part}</mark> : part
    )
  } catch (error) {
    console.error('Error in highlightText:', error)
    return text // Return the original text if there's an error
  }
}

// utils/textUtils.ts
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}