import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import posthog from '../lib/posthog';

interface PostHogProviderProps {
  children: React.ReactNode;
}

export const PostHogProvider: React.FC<PostHogProviderProps> = ({ children }) => {
  const location = useLocation();
  const timeOnPageRef = useRef<number>(Date.now());
  const currentPageRef = useRef<string>(location.pathname);

  // Track page views and time on page
  useEffect(() => {
    // Calculate time spent on previous page
    const previousPage = currentPageRef.current;
    const timeSpent = Math.floor((Date.now() - timeOnPageRef.current) / 1000); // in seconds

    // Only track if user spent meaningful time (more than 1 second)
    if (timeSpent > 1 && previousPage !== location.pathname) {
      // Determine page type
      let pageType = 'other';
      if (location.pathname === '/') {
        pageType = 'landing';
      } else if (location.pathname === '/blog') {
        pageType = 'blog_list';
      } else if (location.pathname.startsWith('/blog/') || /^\/[^/]+$/.test(location.pathname)) {
        // Individual blog post (either /blog/slug or /slug)
        pageType = 'blog_post';
      }

      // Track time on previous page
      posthog.capture('time_on_page', {
        time_seconds: timeSpent,
        page: previousPage,
        page_type: pageType,
        $current_url: window.location.href,
      });

      // Track pageleave for previous page
      posthog.capture('$pageleave', {
        page: previousPage,
        time_seconds: timeSpent,
      });
    }

    // Track new page view
    posthog.capture('$pageview', {
      $current_url: window.location.href,
      page: location.pathname,
      page_type: location.pathname === '/' ? 'landing' : 
                  location.pathname === '/blog' ? 'blog_list' :
                  /^\/[^/]+$/.test(location.pathname) ? 'blog_post' : 'other',
    });

    // Reset timer for new page
    timeOnPageRef.current = Date.now();
    currentPageRef.current = location.pathname;

    // Track time on page when user leaves (beforeunload)
    const handleBeforeUnload = () => {
      const finalTimeSpent = Math.floor((Date.now() - timeOnPageRef.current) / 1000);
      if (finalTimeSpent > 1) {
        let pageType = 'other';
        if (location.pathname === '/') {
          pageType = 'landing';
        } else if (location.pathname === '/blog') {
          pageType = 'blog_list';
        } else if (location.pathname.startsWith('/blog/') || /^\/[^/]+$/.test(location.pathname)) {
          pageType = 'blog_post';
        }

        posthog.capture('time_on_page', {
          time_seconds: finalTimeSpent,
          page: location.pathname,
          page_type: pageType,
          $current_url: window.location.href,
        });

        posthog.capture('$pageleave', {
          page: location.pathname,
          time_seconds: finalTimeSpent,
        });
      }
    };

    // Track when tab becomes hidden (user switches tabs or minimizes)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const timeSpent = Math.floor((Date.now() - timeOnPageRef.current) / 1000);
        if (timeSpent > 1) {
          let pageType = 'other';
          if (location.pathname === '/') {
            pageType = 'landing';
          } else if (location.pathname === '/blog') {
            pageType = 'blog_list';
          } else if (location.pathname.startsWith('/blog/') || /^\/[^/]+$/.test(location.pathname)) {
            pageType = 'blog_post';
          }

          posthog.capture('time_on_page', {
            time_seconds: timeSpent,
            page: location.pathname,
            page_type: pageType,
            $current_url: window.location.href,
          });
        }
      } else {
        // User came back, reset timer
        timeOnPageRef.current = Date.now();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [location.pathname]);

  return <>{children}</>;
};

