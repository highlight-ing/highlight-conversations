/**
 * @fileoverview PanelHeader component for left side panel on the conversations app.
 * This component renders the header section of the left panel, displaying the Highlight logo
 * and application title. It includes controls for merge activation and settings.
 * 
 * @author Jungyoon Lim, Joanne <joanne@highlight.ing>
 * @created October 2024 
 */

import React, { Dispatch, SetStateAction } from 'react'
import HighlightGreenLogo from '../Detail/Icon/HighlightGreenLogo'

interface PanelHeaderProps {
  /** Callback function to handle merge activation */
  onMergeActivate: () => void
  /** Whether merge mode is currently active */
  isMergeActive: boolean
  /** State setter for settings panel visibility */
  setIsSettingsActive: Dispatch<SetStateAction<boolean>>
}

/**
 * PanelHeader component that displays the Highlight logo, application title,
 * and control buttons for merge and settings functionality.
 * 
 * @component
 * @example
 * return (
 *   <PanelHeader
 *     onMergeActivate={() => console.log('Merge activated')}
 *     isMergeActive={false}
 *     setIsSettingsActive={setIsSettingsActive}
 *   />
 * )
 * 
 * @param props - Component props
 * @returns {JSX.Element} A header component containing the Highlight logo and controls
 */
const PanelHeader = ({
  onMergeActivate,
  isMergeActive,
  setIsSettingsActive
}: PanelHeaderProps) => {
  return (
    <div className="flex items-center justify-between border-b border-tertiary">
      {/* Logo and Title Section */}
      <div className="flex items-center ml-6">
        <HighlightGreenLogo />
        <h1 className="text-primary text-lg font-medium py-3 pl-2">
          Highlight Audio
        </h1>
      </div>

      {/* Right Side Actions Section */}
      <div className="flex items-center gap-5 py-5 pr-[30px]">
      </div>
    </div>
  )
}

export default PanelHeader