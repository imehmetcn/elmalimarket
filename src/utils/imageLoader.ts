// Custom image loader for Next.js Image optimization
export default function imageLoader({ src, width, quality }: {
  src: string;
  width: number;
  quality?: number;
}) {
  // For SVG files, return as-is (no optimization needed)
  if (src.endsWith('.svg')) {
    return src;
  }
  
  // For external images, return as-is with optimization parameters
  if (src.startsWith('http')) {
    const url = new URL(src);
    
    // Add optimization parameters for supported services
    if (url.hostname.includes('unsplash.com')) {
      url.searchParams.set('w', width.toString());
      url.searchParams.set('q', (quality || 75).toString());
      url.searchParams.set('fm', 'webp');
      url.searchParams.set('fit', 'crop');
      return url.toString();
    }
    
    if (url.hostname.includes('placeholder.com')) {
      // For placeholder images, adjust size
      const pathParts = url.pathname.split('/');
      if (pathParts.length >= 2) {
        pathParts[1] = `${width}x${Math.round(width * 0.75)}`;
        url.pathname = pathParts.join('/');
      }
      return url.toString();
    }
    
    return src;
  }
  
  // For local images, use Next.js built-in optimization
  const params = new URLSearchParams();
  params.set('url', src);
  params.set('w', width.toString());
  params.set('q', (quality || 75).toString());
  
  return `/_next/image?${params.toString()}`;
}