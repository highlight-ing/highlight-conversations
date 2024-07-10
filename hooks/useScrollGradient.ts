import { useState, useEffect, RefObject, useCallback } from 'react';

function useScrollGradient(scrollRef: RefObject<HTMLElement>) {
  const [showTopGradient, setShowTopGradient] = useState(false);
  const [showBottomGradient, setShowBottomGradient] = useState(false);

  const handleScroll = useCallback(() => {
    const element = scrollRef.current;
    if (element) {
      setShowTopGradient(element.scrollTop > 0);
      setShowBottomGradient(
        element.scrollHeight - element.clientHeight > element.scrollTop
      );
    }
  }, [scrollRef]);

  useEffect(() => {
    const element = scrollRef.current;
    if (element) {
      element.addEventListener('scroll', handleScroll);
      handleScroll(); // Call once to set initial state
    }
    return () => element?.removeEventListener('scroll', handleScroll);
  }, [scrollRef, handleScroll]);

  return { showTopGradient, showBottomGradient };
}

export default useScrollGradient;