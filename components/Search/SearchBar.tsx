import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { useConversations } from '@/contexts/ConversationContext';

const SearchBar: React.FC = () => {
  const { searchQuery, setSearchQuery } = useConversations();

  return (
    <div className="relative mb-4">
      <Input
        type="text"
        placeholder="Search conversations..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pr-8"
      />
      {searchQuery && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2"
          onClick={() => setSearchQuery('')}
        >
          <CrossCircledIcon className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default SearchBar;