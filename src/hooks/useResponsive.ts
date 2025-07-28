'use client';

import { useState, useEffect } from 'react';

interface BreakpointConfig {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
}

const defaultBreakpoints: BreakpointConfig = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export function useResponsive(breakpoints: Partial<BreakpointConfig> = {}) {
  const bp = { ...defaultBreakpoints, ...breakpoints };
  
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial size

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowSize.width < bp.md;
  const isTablet = windowSize.width >= bp.md && windowSize.width < bp.lg;
  const isDesktop = windowSize.width >= bp.lg;
  const isLargeDesktop = windowSize.width >= bp.xl;

  const breakpoint = (() => {
    if (windowSize.width >= bp['2xl']) return '2xl';
    if (windowSize.width >= bp.xl) return 'xl';
    if (windowSize.width >= bp.lg) return 'lg';
    if (windowSize.width >= bp.md) return 'md';
    if (windowSize.width >= bp.sm) return 'sm';
    return 'xs';
  })();

  return {
    windowSize,
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    breakpoint,
    isAbove: (size: keyof BreakpointConfig) => windowSize.width >= bp[size],
    isBelow: (size: keyof BreakpointConfig) => windowSize.width < bp[size],
  };
}

// Touch device detection
export function useTouch() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouch(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        // @ts-ignore
        navigator.msMaxTouchPoints > 0
      );
    };

    checkTouch();
    window.addEventListener('touchstart', checkTouch, { once: true });

    return () => {
      window.removeEventListener('touchstart', checkTouch);
    };
  }, []);

  return isTouch;
}

// Orientation detection
export function useOrientation() {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  useEffect(() => {
    const checkOrientation = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  return orientation;
}