/**
 * @fileoverview Tooltip component for action buttons with customizable messages and states
 * @author Jungyoon Lim, Joanne <joanne@highlight.ing>
 * @created October 2024
 */

import React, { useState, useEffect, useMemo } from 'react'
import { clsx } from 'clsx'
import styles from './tooltip.module.scss'

/**
 * Types of tooltips available in the application
 */
export const TOOLTIP_TYPES = {
  COPY: 'copy',
  DELETE: 'delete',
  SAVE: 'save',
  SHARE: 'share',
  SAVE_ATTACHMENT: 'save-attachment'
} as const

export type TooltipType = (typeof TOOLTIP_TYPES)[keyof typeof TOOLTIP_TYPES]

/**
 * States that a tooltip can be in
 */
export const TOOLTIP_STATES = {
  IDLE: 'idle',
  ACTIVE: 'active',
  SUCCESS: 'success',
  HIDING: 'hiding'
} as const

export type TooltipState = (typeof TOOLTIP_STATES)[keyof typeof TOOLTIP_STATES]

/**
 * Default messages for different tooltip states and types
 */
const DEFAULT_MESSAGES = {
  [TOOLTIP_STATES.SUCCESS]: 'Saved',
  [TOOLTIP_TYPES.SAVE_ATTACHMENT]: 'Add Context',
} as const

interface TooltipProps {
  /** Type of tooltip to display */
  type: TooltipType
  /** Current state of the tooltip */
  state?: TooltipState
  /** Additional CSS classes */
  className?: string
  /** Optional custom message to display */
  message?: string
  /** Child elements the tooltip wraps */
  children: React.ReactNode
}

/**
 * Tooltip component that provides contextual information for UI elements
 * 
 * @component
 * @example
 * <Tooltip type="save" state="active">
 *   <button>Save</button>
 * </Tooltip>
 */
const Tooltip: React.FC<TooltipProps> = ({
  type,
  state = TOOLTIP_STATES.IDLE,
  className = '',
  message,
  children,
}) => {
  // Track visibility state
  const [isVisible, setIsVisible] = useState(state === TOOLTIP_STATES.ACTIVE)

  // Update visibility when state changes
  useEffect(() => {
    setIsVisible(state === TOOLTIP_STATES.ACTIVE)
  }, [state])

  // Memoize tooltip message to prevent unnecessary recalculations
  const tooltipMessage = useMemo(() => {
    if (message) return message
    if (state === TOOLTIP_STATES.SUCCESS) return DEFAULT_MESSAGES[TOOLTIP_STATES.SUCCESS]
    return type === TOOLTIP_TYPES.SAVE_ATTACHMENT 
      ? DEFAULT_MESSAGES[TOOLTIP_TYPES.SAVE_ATTACHMENT] 
      : type
  }, [message, state, type])

  // Compute tooltip classes
  const tooltipClasses = clsx(
    styles.tooltip,
    className,
    {
      'opacity-100': isVisible,
      'opacity-0': !isVisible
    },
    'transition-opacity duration-200'
  )

  return (
    <div className="relative inline-flex">
      {children}
      {isVisible && (
        <div
          role="tooltip"
          className={tooltipClasses}
          aria-hidden={!isVisible}
        >
          {tooltipMessage}
        </div>
      )}
    </div>
  )
}

export default Tooltip