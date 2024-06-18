import React, { useEffect, useState } from 'react';

type MicActivityAnimationProps = {
  micActivity: number;
};

const MicActivityAnimation: React.FC<MicActivityAnimationProps> = ({ micActivity }) => {
  const [heights, setHeights] = useState<number[]>([10, 20, 30]);

  useEffect(() => {
    if (micActivity === 0) {
      setHeights([10, 20, 30]);
    } else if (micActivity >= 1 && micActivity <= 4) {
      const intervalId = setInterval(() => {
        setHeights([
          Math.random() * 50 + 10,
          Math.random() * 50 + 10,
          Math.random() * 50 + 10,
        ]);
      }, 100);

      return () => clearInterval(intervalId);
    } else if (micActivity === 5) {
      setHeights([60, 60, 60]);
    }
  }, [micActivity]);

  return (
    <div className="flex justify-center items-end h-20">
      {heights.map((height, index) => (
        <div
          key={index}
          style={{
            height: `${height}px`,
            backgroundColor: micActivity === 5 ? 'red' : 'green',
            transition: 'height 0.1s ease-in-out',
          }}
          className="w-4 mx-1"
        />
      ))}
    </div>
  );
};

export default MicActivityAnimation;

