/**
 * @fileoverview PanelHeader component for left side panel on the conversations app.
 * This component renders the header section of the left panel, displaying the Highlight logo
 * and application title. It's designed to be a static presentational component that maintains
 * consistent branding across the application.
 * 
 * @author Jungyoon Lim, Joanne <joanne@highlight.ing>
 * @created October 2024 
 */

import React from 'react'
import HighlightGreenLogo from '../Detail/Icon/HighlightGreenLogo'

interface PanelHeaderProps {}

/**
 * PanelHeader component that displays the Highlight logo and application title
 * in the left panel of the conversations app.
 * 
 * @component
 * @example
 * return (
 *   <PanelHeader />
 * )
 * 
 * @returns {JSX.Element} A header component containing the Highlight logo and title
 */
const PanelHeader: React.FC<PanelHeaderProps> = () => {
  return (
    <div className="flex items-center justify-between border-b border-tertiary">
      {/* Logo and Title Section */}
      <div className="flex items-center ml-6">
        <HighlightGreenLogo />
        <h1 className="text-primary text-lg font-medium py-3 pl-2">
          Highlight Audio
        </h1>
      </div>

      {/* Right Side Actions Section - Currently Empty */}
      <div className="flex items-center gap-5 py-5 pr-[30px]">
      </div>
    </div>
  )
}

export default PanelHeader