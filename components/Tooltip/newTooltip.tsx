// TooltipDebug.tsx
import React, { CSSProperties, PropsWithChildren, ReactElement, useEffect, useRef, useState } from 'react'
import { Portal } from 'react-portal'
import styles from './tooltip.module.scss'
import { calculatePositionedStyle } from '@/utils/components'

// Debugging - Console log to track visibility, styles, and hover events
console.log("Tooltip Component Loaded");

const emptyObj = {}

interface TooltipProps {
  disabled?: boolean
  position: 'top' | 'bottom' | 'left' | 'right'
  offset?: number
  tooltip?: string | ReactElement
  wrapperStyle?: CSSProperties
  tooltipContainerStyle?: CSSProperties
}

const TooltipDebug = ({
  children,
  position,
  offset = 0,
  tooltip,
  disabled,
  wrapperStyle = emptyObj,
  tooltipContainerStyle = emptyObj,
}: PropsWithChildren<TooltipProps>) => {
  const [tooltipVisible, setTooltipVisible] = useState(false)
  const [tooltipStyle, setTooltipStyle] = useState({})
  const targetRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  console.log("Tooltip Visible:", tooltipVisible);

  function adjustTooltipPosition() {
    if (!targetRef.current || !tooltipRef.current) {
      return
    }
    const styles = calculatePositionedStyle(targetRef.current, tooltipRef.current, position, offset)
    console.log("Calculated Styles:", styles);
    setTooltipStyle(styles)
  }

  useEffect(() => {
    if (tooltipVisible && tooltip) {
      adjustTooltipPosition()
    } else if (!tooltip && tooltipVisible) {
      setTooltipVisible(false)
    }
  }, [tooltipVisible, tooltip, position, offset])

  if (tooltip === undefined || disabled) {
    return children
  }

  return (
    <div
      className="group relative flex"
      onClick={() => {
        console.log("Tooltip Clicked - Hiding Tooltip");
        setTooltipVisible(false);
      }}
      onMouseEnter={() => {
        console.log("Mouse Entered");
        !disabled && setTooltipVisible(true);
      }}
      onMouseLeave={() => {
        console.log("Mouse Left");
        setTooltipVisible(false);
      }}
      onContextMenu={() => {
        console.log("Context Menu Triggered - Hiding Tooltip");
        setTooltipVisible(false);
      }}
      ref={targetRef}
      style={wrapperStyle}
    >
      {children}
      {tooltipVisible && (
        // Remove Portal temporarily to check if it’s affecting display
        // <Portal>
          <div
            ref={tooltipRef}
            style={{ ...tooltipStyle, ...tooltipContainerStyle, visibility: tooltipVisible ? 'visible' : 'hidden' }}
            className={styles.tooltip}
          >
            {tooltip}
          </div>
        // </Portal>
      )}
    </div>
  )
}

export default TooltipDebug
