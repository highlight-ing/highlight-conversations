'use client'

import React, { useCallback, useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SearchIcon, XIcon } from "lucide-react"
import { useConversations } from '@/contexts/ConversationContext'
import { useDebouncedCallback } from 'use-debounce'

export default function EnhancedSearchBar() {
  const { searchQuery, setSearchQuery } = useConversations()
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const debouncedSetSearchQuery = useDebouncedCallback(
    (value: string) => setSearchQuery(value),
    300
  )

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    e.target.value = value
    debouncedSetSearchQuery(value)
  }, [debouncedSetSearchQuery])

  const clearSearch = () => {
    setSearchQuery('')
    const input = document.querySelector('input[type="text"]') as HTMLInputElement
    if (input) input.value = ''
  }

  const isActive = isHovered || isFocused

  return (
    <div className="w-full mb-4"> {/* Update this line */}
      <div 
        className={`flex items-center rounded-lg overflow-hidden transition-all duration-300 ease-in-out ${
          isActive ? 'bg-searchBar-active' : 'bg-searchBar'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <SearchIcon className="h-5 w-5 text-muted-foreground ml-3" />
        <Input
          type="text"
          placeholder="Search conversations..."
          defaultValue={searchQuery}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="flex-grow border-none bg-transparent placeholder-muted-foreground text-foreground focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            onClick={clearSearch}
            className="mr-1 hover:bg-searchBar-active"
          >
            <XIcon className="h-4 w-4 text-muted-foreground" />
          </Button>
        )}
      </div>
    </div>
  )
}