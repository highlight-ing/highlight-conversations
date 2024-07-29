// components/GradientText.tsx
import React from 'react';

type GradientDirection = 'left-right' | 'right-left'
interface GradientTextProps {
  text: string;
  className?: string;
  direction: GradientDirection;
}

const GradientText: React.FC<GradientTextProps> = ({ text, className, direction }) => {
    const gradientDirection = direction === 'left-right' 
      ? 'from-white to-[#3B3B3B]' 
      : 'from-[#3B3B3B] to-white';
  
    return (
      <div 
        className={`
          text-transparent 
          bg-clip-text 
          text-3xl 
          font-semibold 
          -tracking-10 
          bg-gradient-to-r 
          ${gradientDirection} 
          opacity-50 
          ${className}
        `}
      >
        {text}
      </div>
    );
  };
  
  export default GradientText;