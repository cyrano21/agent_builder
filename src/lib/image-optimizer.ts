import { ImageResponse } from 'next/og';

// Image optimization utilities
export class ImageOptimizer {
  // Generate optimized image URLs with Next.js Image API
  static getOptimizedUrl(
    src: string,
    width?: number,
    height?: number,
    quality: number = 75
  ): string {
    const params = new URLSearchParams();
    if (width) params.set('w', width.toString());
    if (height) params.set('h', height.toString());
    params.set('q', quality.toString());
    
    return `${src}?${params.toString()}`;
  }

  // Generate placeholder blur data URL
  static generateBlurDataURL(width: number = 8, height: number = 8): string {
    // Create a simple placeholder pattern
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.fillStyle = '#e5e7eb';
      ctx.fillRect(0, 0, width, height);
      
      // Add some noise for better blur effect
      for (let i = 0; i < width * height; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const opacity = Math.random() * 0.1;
        ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
    
    return canvas.toDataURL('image/jpeg', 0.1);
  }

  // Responsive image sizes generator
  static generateSrcSet(
    src: string,
    widths: number[] = [320, 640, 768, 1024, 1280, 1536]
  ): string {
    return widths
      .map(width => `${this.getOptimizedUrl(src, width)} ${width}w`)
      .join(', ');
  }

  // Calculate optimal image dimensions based on container
  static calculateOptimalDimensions(
    containerWidth: number,
    containerHeight: number,
    aspectRatio: number = 16 / 9
  ): { width: number; height: number } {
    const maxWidth = Math.min(containerWidth, 1920); // Max 1920px width
    const maxHeight = Math.min(containerHeight, 1080); // Max 1080px height
    
    let width = maxWidth;
    let height = width / aspectRatio;
    
    if (height > maxHeight) {
      height = maxHeight;
      width = height * aspectRatio;
    }
    
    return {
      width: Math.round(width),
      height: Math.round(height)
    };
  }

  // WebP format support detection
  static supportsWebP(): boolean {
    if (typeof window === 'undefined') return false;
    
    const canvas = document.createElement('canvas');
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }

  // Get best image format based on browser support
  static getBestFormat(): 'webp' | 'jpeg' | 'png' {
    if (typeof window === 'undefined') return 'jpeg';
    
    return this.supportsWebP() ? 'webp' : 'jpeg';
  }

  // Generate image preload tags
  static generatePreloadTags(
    images: Array<{ src: string; priority?: boolean; as?: string }>
  ): string {
    return images
      .map(image => {
        const { src, priority = false, as = 'image' } = image;
        const fetchPriority = priority ? 'high' : 'auto';
        
        return `
          <link
            rel="preload"
            href="${src}"
            as="${as}"
            fetchpriority="${fetchPriority}"
          />
        `;
      })
      .join('\n');
  }
}

// Image size constants for common use cases
export const IMAGE_SIZES = {
  thumbnail: { width: 150, height: 150 },
  small: { width: 320, height: 240 },
  medium: { width: 640, height: 480 },
  large: { width: 1024, height: 768 },
  xlarge: { width: 1920, height: 1080 },
  hero: { width: 1920, height: 1080 },
  card: { width: 400, height: 300 },
  avatar: { width: 80, height: 80 },
  banner: { width: 1200, height: 400 }
} as const;

// Common aspect ratios
export const ASPECT_RATIOS = {
  square: 1,
  portrait: 3 / 4,
  landscape: 4 / 3,
  widescreen: 16 / 9,
  cinematic: 21 / 9
} as const;