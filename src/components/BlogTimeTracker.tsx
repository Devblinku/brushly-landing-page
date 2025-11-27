import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import posthog from '../lib/posthog';

interface BlogTimeTrackerProps {
  postData?: {
    slug: string;
    title: string;
    category?: string;
    reading_time?: number;
  };
  isBlogList?: boolean;
}

export const BlogTimeTracker: React.FC<BlogTimeTrackerProps> = ({ 
  postData, 
  isBlogList = false 
}) => {
  const location = useLocation();
  const startTimeRef = useRef<number>(Date.now());
  const scrollDepthRef = useRef<number>(0);
  const scrollCheckpointsRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    startTimeRef.current = Date.now();
    scrollDepthRef.current = 0;
    scrollCheckpointsRef.current.clear();

    // Track scroll depth for blog posts
    if (!isBlogList && postData) {
      const handleScroll = () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY;
        const scrollPercentage = Math.round(
          ((scrollTop + windowHeight) / documentHeight) * 100
        );

        // Track scroll depth milestones (25%, 50%, 75%, 100%)
        const milestones = [25, 50, 75, 100];
        milestones.forEach((milestone) => {
          if (
            scrollPercentage >= milestone &&
            !scrollCheckpointsRef.current.has(milestone)
          ) {
            scrollCheckpointsRef.current.add(milestone);
            posthog.capture('blog_post_scroll_depth', {
              post_slug: postData.slug,
              post_title: postData.title,
              post_category: postData.category || 'Uncategorized',
              scroll_depth: milestone,
              reading_time: postData.reading_time || 0,
            });
          }
        });

        scrollDepthRef.current = scrollPercentage;
      };

      window.addEventListener('scroll', handleScroll, { passive: true });

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [location.pathname, postData, isBlogList]);

  // Track time spent when component unmounts or route changes
  useEffect(() => {
    return () => {
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);

      if (timeSpent > 1) {
        if (isBlogList) {
          posthog.capture('blog_list_time_spent', {
            time_seconds: timeSpent,
            page: location.pathname,
          });
        } else if (postData) {
          posthog.capture('blog_post_time_spent', {
            time_seconds: timeSpent,
            post_slug: postData.slug,
            post_title: postData.title,
            post_category: postData.category || 'Uncategorized',
            reading_time: postData.reading_time || 0,
            scroll_depth: scrollDepthRef.current,
          });
        }
      }
    };
  }, [location.pathname, postData, isBlogList]);

  return null; // This component doesn't render anything
};

