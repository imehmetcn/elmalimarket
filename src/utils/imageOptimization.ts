// Image format detection and optimization utilities

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
}

// Check if browser supports WebP
export function supportsWebP(): boolean {
  if (typeof window === 'undefined') return false;
  
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
}

// Check if browser supports AVIF
export function supportsAVIF(): boolean {
  if (typeof window === 'undefined') return false;
  
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  
  try {
    return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
  } catch {
    return false;
  }
}

// Get optimal image format based on browser support
export function getOptimalFormat(): 'avif' | 'webp' | 'jpeg' {
  if (supportsAVIF()) return 'avif';
  if (supportsWebP()) return 'webp';
  return 'jpeg';
}

// Generate optimized image URL
export function getOptimizedImageUrl(
  src: string,
  options: ImageOptimizationOptions = {}
): string {
  const {
    width,
    height,
    quality = 85,
    format,
    fit = 'cover',
  } = options;

  // If it's already an optimized URL or external URL, return as is
  if (src.startsWith('http') || src.includes('/_next/image')) {
    return src;
  }

  // Build Next.js image optimization URL
  const params = new URLSearchParams();
  
  if (width) params.set('w', width.toString());
  if (height) params.set('h', height.toString());
  params.set('q', quality.toString());
  
  const optimalFormat = format || getOptimalFormat();
  if (optimalFormat !== 'jpeg') {
    params.set('f', optimalFormat);
  }

  return `/_next/image?url=${encodeURIComponent(src)}&${params.toString()}`;
}

// Generate srcSet for responsive images
export function generateSrcSet(
  src: string,
  widths: number[] = [320, 640, 768, 1024, 1280, 1920],
  options: Omit<ImageOptimizationOptions, 'width'> = {}
): string {
  return widths
    .map(width => {
      const url = getOptimizedImageUrl(src, { ...options, width });
      return `${url} ${width}w`;
    })
    .join(', ');
}

// Generate sizes attribute for responsive images
export function generateSizes(breakpoints: { [key: string]: string } = {}): string {
  const defaultBreakpoints = {
    '(max-width: 320px)': '320px',
    '(max-width: 640px)': '640px',
    '(max-width: 768px)': '768px',
    '(max-width: 1024px)': '1024px',
    '(max-width: 1280px)': '1280px',
    ...breakpoints,
  };

  const sizeEntries = Object.entries(defaultBreakpoints);
  const mediaQueries = sizeEntries.slice(0, -1).map(([query, size]) => `${query} ${size}`);
  const defaultSize = sizeEntries[sizeEntries.length - 1][1];

  return [...mediaQueries, defaultSize].join(', ');
}

// Preload critical images
export function preloadImage(src: string, options: ImageOptimizationOptions = {}): void {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = getOptimizedImageUrl(src, options);
  
  // Add responsive preload if width is specified
  if (options.width) {
    link.setAttribute('imagesrcset', generateSrcSet(src, [options.width], options));
    link.setAttribute('imagesizes', generateSizes());
  }

  document.head.appendChild(link);
}

// Create blur placeholder from image
export function createBlurPlaceholder(
  src: string,
  width: number = 8,
  height: number = 8
): string {
  return getOptimizedImageUrl(src, {
    width,
    height,
    quality: 1,
    format: 'jpeg',
  });
}

// Image loading states
export type ImageLoadingState = 'loading' | 'loaded' | 'error';

// Image dimensions
export interface ImageDimensions {
  width: number;
  height: number;
  aspectRatio: number;
}

// Get image dimensions
export function getImageDimensions(src: string): Promise<ImageDimensions> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
        aspectRatio: img.naturalWidth / img.naturalHeight,
      });
    };
    
    img.onerror = reject;
    img.src = src;
  });
}

// Common image sizes for e-commerce
export const IMAGE_SIZES = {
  thumbnail: { width: 150, height: 150 },
  small: { width: 300, height: 300 },
  medium: { width: 500, height: 500 },
  large: { width: 800, height: 800 },
  hero: { width: 1200, height: 600 },
  banner: { width: 1920, height: 400 },
} as const;

// Responsive breakpoints
export const BREAKPOINTS = {
  mobile: 320,
  tablet: 768,
  desktop: 1024,
  wide: 1280,
  ultrawide: 1920,
} as const;