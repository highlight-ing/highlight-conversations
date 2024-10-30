import React, { useState, useEffect } from 'react';
import styles from './tooltip.module.scss';

export type TooltipType = 'copy' | 'delete' | 'save' | 'share' | 'save-attachment';
export type TooltipState = 'idle' | 'active' | 'success' | 'hiding';

interface TooltipProps {
  type: TooltipType;
  state?: TooltipState;
  className?: string;
  message?: string;
  children: React.ReactNode;
}

const NewTooltip: React.FC<TooltipProps> = ({
  type,
  state = 'idle',
  className = '',
  message,
  children,
}) => {
  const [isVisible, setIsVisible] = useState(state === 'active');

  useEffect(() => {
    setIsVisible(state === 'active');
  }, [state]);

  const getMessage = () =>
    message || (state === 'success' ? 'Saved' : type === 'save-attachment' ? 'Add Context' : type);

  return (
    <div className="relative inline-flex">
      {children}
      {isVisible && (
        <div 
          className={`${styles.tooltip} ${className} ${
            isVisible ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-200`}
        >
          {getMessage()}
        </div>
      )}
    </div>
  );
};

export default NewTooltip;