// hooks/usePageVisibility.ts
'use client'
import { useState, useEffect } from 'react';

export function usePageVisibility() {
const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => setIsVisible(!document.hidden);

    // Check if window is defined (i.e., if we're in the browser)
    if (typeof window !== 'undefined') {
      setIsVisible(!document.hidden);
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }

    return () => {
      if (typeof window !== 'undefined') {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      }
    };
  }, []);

  return isVisible;
}