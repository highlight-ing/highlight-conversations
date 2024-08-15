import React from 'react';

export const highlightText = (text: string, query: string): React.ReactNode => {
  if (!query) return text;
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <span key={i} className="bg-brand/80 text-background">
        {part}
      </span>
    ) : (
      part
    )
  )
}