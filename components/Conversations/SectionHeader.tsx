import React from 'react'

interface SectionHeaderProps {
  title?: string
}

export function SectionHeader({ title }: SectionHeaderProps) {
  if (!title) return null
  return <h2 className="mb-4 mt-4 text-[16px] font-medium text-secondary">{title}</h2>
}
