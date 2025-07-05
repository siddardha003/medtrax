import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    console.log('useScrollToTop: Route changed to:', location.pathname);
    
    // Force scroll to top immediately
    const forceScrollToTop = () => {
      // Try multiple methods to ensure it works
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // Also try scrolling the main content area
      const mainContent = document.querySelector('main') || document.querySelector('.App') || document.body;
      if (mainContent) {
        mainContent.scrollTop = 0;
      }
    };
    
    forceScrollToTop();
    
    // Additional attempts with delays
    const timeoutId = setTimeout(() => {
      console.log('useScrollToTop: Delayed scroll attempt');
      forceScrollToTop();
    }, 100);

    const loadTimeoutId = setTimeout(() => {
      console.log('useScrollToTop: Final scroll attempt');
      forceScrollToTop();
    }, 500);

    // One more attempt after a longer delay
    const finalTimeoutId = setTimeout(() => {
      console.log('useScrollToTop: Final final scroll attempt');
      forceScrollToTop();
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(loadTimeoutId);
      clearTimeout(finalTimeoutId);
    };
  }, [location]); // Use the entire location object as dependency
}; 