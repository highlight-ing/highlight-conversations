// hooks/usePageVisibility.ts
import { useState, useEffect } from 'react';

export function usePageVisibility() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // This code only runs on the client side
    if (typeof document !== 'undefined') {
      setIsVisible(!document.hidden);

      const handleVisibilityChange = () => setIsVisible(!document.hidden);
      
      document.addEventListener("visibilitychange", handleVisibilityChange);
      
      return () => {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      };
    }
  }, []);

  return isVisible;
}