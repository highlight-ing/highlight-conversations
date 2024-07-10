import React from 'react';

export interface IconProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

export const Icon: React.FC<IconProps & React.SVGProps<SVGSVGElement>> = ({ 
  width = 22, 
  height = 22, 
  color = 'currentColor', 
  className = '',
  children,
  ...props 
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      {...props}
    >
      {children}
    </svg>
  );
};

export default Icon;