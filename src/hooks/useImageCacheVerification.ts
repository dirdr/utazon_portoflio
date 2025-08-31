import { useState, useEffect } from 'react';

interface ImageCacheVerificationOptions {
  imageUrls: string[];
  enabled?: boolean;
}

/**
 * Verifies that images are actually cached and ready to display
 * Prevents the flash/pop-in effect in Safari/Firefox
 */
export const useImageCacheVerification = ({ 
  imageUrls, 
  enabled = true 
}: ImageCacheVerificationOptions) => {
  const [isVerified, setIsVerified] = useState(false);
  const [verificationProgress, setVerificationProgress] = useState(0);

  useEffect(() => {
    if (!enabled || imageUrls.length === 0) {
      setIsVerified(true);
      return;
    }

    let completedCount = 0;
    const totalCount = imageUrls.length;
    const results: boolean[] = [];

    const checkComplete = () => {
      setVerificationProgress((completedCount / totalCount) * 100);
      if (completedCount === totalCount) {
        // All images verified - allow page to render
        setIsVerified(true);
      }
    };

    // Safari/Firefox cache coordination
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');
    const needsCoordination = isSafari || isFirefox;

    imageUrls.forEach((url, index) => {
      const img = new Image();
      
      const handleLoad = () => {
        results[index] = true;
        completedCount++;
        checkComplete();
      };

      const handleError = () => {
        results[index] = false;
        completedCount++;
        checkComplete();
      };

      // Safari/Firefox specific cache coordination
      if (needsCoordination) {
        img.crossOrigin = 'anonymous';
        // Give cache coordination time
        setTimeout(() => {
          img.addEventListener('load', handleLoad);
          img.addEventListener('error', handleError);
          img.src = url;
        }, index * 10); // Stagger to avoid overwhelming cache
      } else {
        img.addEventListener('load', handleLoad);
        img.addEventListener('error', handleError);
        img.src = url;
      }
    });

    // Cleanup function
    return () => {
      setIsVerified(false);
      setVerificationProgress(0);
    };
  }, [imageUrls, enabled]);

  return {
    isVerified,
    verificationProgress,
  };
};