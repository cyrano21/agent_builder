'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  placeholder = 'blur',
  blurDataURL,
  onLoad,
  onError
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  if (hasError) {
    return (
      <div className={cn(
        "flex items-center justify-center bg-muted border border-dashed rounded-lg",
        className
      )}>
        <span className="text-muted-foreground text-sm">Image non disponible</span>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {isLoading && (
        <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        onLoad={handleLoad}
        onError={handleError}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
}

// Lazy image component for below-the-fold images
interface LazyImageProps extends Omit<OptimizedImageProps, 'priority'> {
  threshold?: number;
}

export function LazyImage({
  threshold = 0.1,
  ...props
}: LazyImageProps) {
  return (
    <OptimizedImage
      {...props}
      priority={false}
    />
  );
}

// Background image component with optimization
interface BackgroundImageProps {
  src: string;
  className?: string;
  children?: React.ReactNode;
  overlay?: boolean;
  overlayOpacity?: number;
}

export function BackgroundImage({
  src,
  className,
  children,
  overlay = false,
  overlayOpacity = 0.5
}: BackgroundImageProps) {
  return (
    <div 
      className={cn("relative bg-cover bg-center bg-no-repeat", className)}
      style={{
        backgroundImage: `url(${src})`,
      }}
    >
      {overlay && (
        <div 
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}