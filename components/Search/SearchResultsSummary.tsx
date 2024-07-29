import React from 'react';

interface SearchResultsSummaryProps {
  count: number;
}

const SearchResultsSummary: React.FC<SearchResultsSummaryProps> = ({ count }) => {
  return (
    <div className="text-sm text-muted-foreground mb-4">
      {count === 0 ? (
        "No matching conversations found."
      ) : (
        `${count} matching conversation${count === 1 ? '' : 's'} found.`
      )}
    </div>
  );
};

export default SearchResultsSummary;