import React, { useCallback } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { useConversations } from '@/contexts/ConversationContext';
import { useDebouncedCallback } from 'use-debounce';

const SearchBar: React.FC = () => {
  const { searchQuery, setSearchQuery } = useConversations();

  const debouncedSetSearchQuery = useDebouncedCallback(
    (value: string) => setSearchQuery(value),
    300
  );

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    e.target.value = value; // Immediately update the input value
    debouncedSetSearchQuery(value); // Debounce the context update
  }, [debouncedSetSearchQuery]);

  return (
    <div className="relative mb-4">
      <Input
        type="text"
        placeholder="Search conversations..."
        defaultValue={searchQuery}
        onChange={handleInputChange}
        className="pr-8"
      />
      {searchQuery && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2"
          onClick={() => {
            setSearchQuery('');
            // Also clear the input value
            const input = document.querySelector('input[type="text"]') as HTMLInputElement;
            if (input) input.value = '';
          }}
        >
          <CrossCircledIcon className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default SearchBar;