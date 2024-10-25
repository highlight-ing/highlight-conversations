import React from 'react';

const LoadingSpinner = ({
  size = 24,
  baseColor = '#FFFFFF',
  segments = 12,
}) => {
  const center = size / 2;
  const lineLength = size * 0.16;
  const startDistance = size * 0.12;
  const minOpacity = 0.2;
  const maxOpacity = 0.5;

  // Enhanced opacity calculation
  const getSegmentOpacity = (index: number) => {
    // Create a wider range between min and max opacity
    return maxOpacity - ((maxOpacity - minOpacity) * (index / (segments - 1)));
  };

  const segmentElements = Array.from({ length: segments }, (_, i) => {
    const rotation = (i / segments) * 360;
    const opacity = getSegmentOpacity(i);

    // Calculate segment positions
    const x1 = center + startDistance * Math.cos((rotation - 90) * (Math.PI / 180));
    const y1 = center + startDistance * Math.sin((rotation - 90) * (Math.PI / 180));
    const x2 = center + (startDistance + lineLength) * Math.cos((rotation - 90) * (Math.PI / 180));
    const y2 = center + (startDistance + lineLength) * Math.sin((rotation - 90) * (Math.PI / 180));

    return (
      <path
        key={i}
        d={`M${x1} ${y1} L${x2} ${y2}`}
        stroke={baseColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ opacity }}
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
      className="animate-spin"
      style={{ animationDuration: '1s', animationTimingFunction: 'linear' }}
    >
      {segmentElements}
    </svg>
  );
};


export default LoadingSpinner