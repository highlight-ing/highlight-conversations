import { CSSProperties } from 'react';

const PIXEL_SPACING = 8;

export const calculatePositionedStyle = (
  targetElement: HTMLDivElement,
  positionedElement: HTMLElement,
  position: 'top' | 'bottom' | 'left' | 'right',
  offset?: number
): CSSProperties => {
  const targetRect = targetElement.getBoundingClientRect();
  const positionOffset = offset ?? 0;

  const styles: CSSProperties = {
    position: 'fixed',
  };

  if (position === 'top') {
    styles.top = targetRect.top - positionedElement.offsetHeight - PIXEL_SPACING - positionOffset;
    styles.left = targetRect.left + targetRect.width / 2 - positionedElement.offsetWidth / 2;
  }

  if (typeof styles.left === 'number' && (styles.left < 0 || styles.left + positionedElement.offsetWidth > window.innerWidth)) {
    styles.left = Math.max(PIXEL_SPACING, Math.min(styles.left, window.innerWidth - positionedElement.offsetWidth - PIXEL_SPACING));
  }

  return styles;
};