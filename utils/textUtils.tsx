import React from 'react'

export const highlightText = (text: string, query: string) => {
  if (!query) return text

  const parts = text.split(new RegExp(`(${query})`, 'gi'))
  return parts.map((part, i) => 
    part.toLowerCase() === query.toLowerCase() ? 
      <mark key={i} className="bg-brand text-brand/5">{part}</mark> : part
  )
}