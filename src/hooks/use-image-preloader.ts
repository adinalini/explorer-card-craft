import { useEffect } from 'react';
import { oldCardImages } from '@/utils/oldCardImages';

/**
 * Hook to preload images for better performance
 * Supports both direct URLs and card IDs with old versions
 */
export function useImagePreloader(
  imageUrls: string[],
  shouldPreload: boolean,
  priority: 'high' | 'low' = 'low'
) {
  useEffect(() => {
    if (!shouldPreload || imageUrls.length === 0) return;

    // Delay preloading to avoid interfering with current image loading
    const delay = priority === 'high' ? 100 : 500;
    
    const timeoutId = setTimeout(() => {
      imageUrls.filter(Boolean).forEach(src => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      });
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [imageUrls, shouldPreload, priority]);
}

/**
 * Hook to preload old card images after current images have loaded
 * Optimizes loading time by preloading old version images in the background
 */
export function useOldCardImagePreloader(
  cardIds: string[],
  shouldPreload: boolean,
  priority: 'high' | 'low' = 'low'
) {
  const imageUrls = cardIds.map(id => oldCardImages[id]).filter(Boolean);
  useImagePreloader(imageUrls, shouldPreload, priority);
}
