import { useState, useEffect, RefObject } from 'react';

function useScrollGradient(scrollRef: RefObject<HTMLElement>) {
  const [showTopGradient, setShowTopGradient] = useState(false)
  const [showBottomGradient, setShowBottomGradient] = useState(false)

  const handleScroll = () => {
    const element = scrollRef.current
    if (element) {
      setShowTopGradient(element.scrollTop > 0)
      setShowBottomGradient(
        element.scrollHeight - element.clientHeight > element.scrollTop
      )
    }
  }

  useEffect(() => {
    const element = scrollRef.current
    if (element) {
      element.addEventListener('scroll', handleScroll)
      handleScroll()
    }
    return () => element?.removeEventListener('scroll', handleScroll)
  }, [scrollRef])

  return { showTopGradient, showBottomGradient }
}

export default useScrollGradient