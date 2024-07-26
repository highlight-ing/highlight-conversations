// components/GradientText.tsx
import React from 'react';

interface GradientTextProps {
  text: string;
  className?: string;
}

const GradientText: React.FC<GradientTextProps> = ({ text, className }) => (
  <div className={`text-transparent bg-clip-text text-3xl font-semibold -tracking-10 bg-gradient-to-r from-white to-#3B3B3B opacity-50 ${className}`}>
    {text}
  </div>
);

export default GradientText;