import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import styles from './tooltip.module.scss';
import { calculatePositionedStyle } from '@/utils/components';

export type TooltipType = 'copy' | 'delete' | 'save' | 'share' | 'save-attachment';
export type TooltipState = 'idle' | 'active' | 'success' | 'hiding';

interface TooltipProps {
  type: TooltipType;
  state: TooltipState;
  className?: string;
  message?: string;
  disabled?: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
  offset?: number;
  wrapperStyle?: CSSProperties;
  tooltipContainerStyle?: CSSProperties;
}

const NewTooltip: React.FC<TooltipProps> = ({
  type,
  state,
  className = '',
  message,
  disabled,
  position = 'top', // Default to 'top'
  offset = 8, // Default offset to provide space between tooltip and element
  wrapperStyle = {},
  tooltipContainerStyle = {},
  children,
}) => {
  const [tooltipVisible, setTooltipVisible] = useState(state === 'active');
  const [tooltipStyle, setTooltipStyle] = useState({});
  const targetRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const getMessage = () =>
    message || (state === 'success' ? 'Saved' : type === 'save-attachment' ? 'Add Context' : '');

  function adjustTooltipPosition() {
    if (!targetRef.current || !tooltipRef.current) return;
    const calculatedStyles = calculatePositionedStyle(targetRef.current, tooltipRef.current, position, offset);
    setTooltipStyle(calculatedStyles);
  }

  useEffect(() => {
    if (tooltipVisible) adjustTooltipPosition();
  }, [tooltipVisible, position, offset]);

  useEffect(() => {
    setTooltipVisible(state === 'active');
  }, [state]);

  if (disabled) {
    return <>{children}</>;
  }

  return (
    <div
      className="group relative flex"
      onMouseEnter={() => setTooltipVisible(true)}
      onMouseLeave={() => setTooltipVisible(false)}
      ref={targetRef}
      style={wrapperStyle}
    >
      {children}
      {tooltipVisible && (
        <span
          ref={tooltipRef}
          style={{ ...tooltipStyle, ...tooltipContainerStyle }}
          className={`${styles.tooltip} ${className} ${
            state === 'idle' ? 'opacity-0' : 'opacity-100'
          } transition-opacity duration-200`}
        >
          {getMessage()}
        </span>
      )}
    </div>
  );
};

export default NewTooltip;
