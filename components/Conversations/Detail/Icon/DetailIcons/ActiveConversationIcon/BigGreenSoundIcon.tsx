import React from 'react';
import { motion } from 'framer-motion';

const BigGreenSoundIcon: React.FC = () => {
  const barVariants = {
    animate: {
      scaleY: [1, 1.5, 1.5, 1, 1], // repeating states reduces motion
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",

      }
    }
  };

  // Different delays for each bar to create a wave effect
  const delays = [0, 0.1, 0.2, 0.3, 0.4];

  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {[4, 10, 16, 22, 28].map((x, index) => (
        <motion.path
          key={x}
          variants={barVariants}
          animate="animate"
          transition={{
            ...barVariants.animate.transition,
            delay: delays[index]
          }}
          style={{ transformOrigin: "center" }}
          d={
            x === 4 || x === 28
              ? `M${x} 22C${x - 0.54667} 22 ${x - 1} 21.5467 ${x - 1} 21V11C${x - 1} 10.4533 ${x - 0.54667} 10 ${x} 10C${x + 0.54667} 10 ${x + 1} 10.4533 ${x + 1} 11V21C${x + 1} 21.5467 ${x + 0.54667} 22 ${x} 22Z`
              : x === 10 || x === 22
                ? `M${x} 25.3337C${x - 0.54667} 25.3337 ${x - 1} 24.8803 ${x - 1} 24.3337V7.66699C${x - 1} 7.12033 ${x - 0.54667} 6.66699 ${x} 6.66699C${x + 0.54667} 6.66699 ${x + 1} 7.12033 ${x + 1} 7.66699V24.3337C${x + 1} 24.8803 ${x + 0.54667} 25.3337 ${x} 25.3337Z`
                : `M${x} 28.6663C${x - 0.54667} 28.6663 ${x - 1} 28.213 ${x - 1} 27.6663V4.33301C${x - 1} 3.78634 ${x - 0.54667} 3.33301 ${x} 3.33301C${x + 0.54667} 3.33301 ${x + 1} 3.78634 ${x + 1} 4.33301V27.6663C${x + 1} 28.213 ${x + 0.54667} 28.6663 ${x} 28.6663Z`
          }
          fill="#4CEDA0"
        />
      ))}
    </svg>
  );
};

export default BigGreenSoundIcon;
