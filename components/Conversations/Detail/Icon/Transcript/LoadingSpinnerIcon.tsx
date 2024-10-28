import React from 'react';

const LoadingSpinner = ({
  size = 24,
  baseColor = '#333333', 
  activeColor = '#777777',
  segments = 8,
  animationDuration = 1.5,
}) => {
  const center = size / 2;
  const lineLength = size * 0.12;
  const startDistance = size * 0.2;

  // Get the appropriate color based on the animation phase
  const getSegmentColor = (index: number) => {
    const delay = (index / segments) * animationDuration
    return {
      animation: `colorChange ${animationDuration}s ${delay}s infinite`,
      stroke: baseColor,
    };
  };

  const segmentElements = Array.from({ length: segments }, (_, i) => {
    const rotation = (i / segments) * 360;

    // Calculate segment positions
    const x1 = center + startDistance * Math.cos((rotation - 90) * (Math.PI / 180))
    const y1 = center + startDistance * Math.sin((rotation - 90) * (Math.PI / 180))
    const x2 = center + (startDistance + lineLength) * Math.cos((rotation - 90) * (Math.PI / 180))
    const y2 = center + (startDistance + lineLength) * Math.sin((rotation - 90) * (Math.PI / 180))

    return (
      <path
        key={i}
        d={`M${x1} ${y1} L${x2} ${y2}`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={getSegmentColor(i)}
      />
    );
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {segmentElements}
      <style>
        {`
          @keyframes colorChange {
            0%, 100% {
              stroke: ${baseColor}; /* Light gray at the start and end */
            }
            50% {
              stroke: ${activeColor}; /* Dark gray when active */
            }
          }
        `}
      </style>
    </svg>
  )
}

export default LoadingSpinner
