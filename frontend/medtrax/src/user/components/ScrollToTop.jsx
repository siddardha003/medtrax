import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    console.log('ScrollToTop: Route changed to:', pathname);
    
    // Scroll to top when pathname changes
    const scrollToTop = () => {
      try {
        console.log('ScrollToTop: Attempting to scroll to top');
        // Force scroll to top immediately
        window.scrollTo(0, 0);
        
        // Also try smooth scrolling
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
        
        // Force scroll on document element as well
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        
        console.log('ScrollToTop: Scroll completed');
      } catch (error) {
        console.error('ScrollToTop: Error scrolling:', error);
        // Fallback for browsers that don't support smooth scrolling
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }
    };

    // Immediate scroll to top
    scrollToTop();
    
    // Additional scroll after a short delay to ensure it works
    // This handles cases where the page content is still loading
    const timeoutId = setTimeout(() => {
      console.log('ScrollToTop: Delayed scroll attempt');
      scrollToTop();
    }, 100);

    // Additional scroll after content has fully loaded
    const loadTimeoutId = setTimeout(() => {
      console.log('ScrollToTop: Final scroll attempt');
      scrollToTop();
    }, 500);

    // Cleanup timeouts on unmount or pathname change
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(loadTimeoutId);
    };
  }, [pathname]);

  return null; // This component doesn't render anything
};

export default ScrollToTop; 