'use client';

import React from 'react';
import { Button } from "@/components/ui/button";

const DownloadButton: React.FC = () => {
  return (
    <Button 
      onClick={() => window.location.href = "https://highlight.ing/apps/conversations"}
      className="bg-brand text-background hover:bg-brand-light"
    >
      Download Conversations
    </Button>
  );
};

export default DownloadButton;