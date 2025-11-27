import posthog from 'posthog-js';

// Extend Window interface for PostHog
declare global {
  interface Window {
    posthog?: {
      __loaded?: boolean;
      [key: string]: any;
    };
  }
}

export const initPostHog = () => {
  // Only initialize if we're in the browser
  if (typeof window !== 'undefined') {
    // API key must be provided via environment variable
    const apiKey = import.meta.env.VITE_POSTHOG_API_KEY;
    const apiHost = 'https://us.i.posthog.com'; // Keep URL hardcoded
    
    // Check if API key is provided
    if (!apiKey) {
      console.error('PostHog API key is missing. Please set VITE_POSTHOG_API_KEY in your environment variables.');
      return;
    }

    // Check if PostHog is already initialized (from HTML snippet)
    if (!window.posthog || !window.posthog.__loaded) {
      posthog.init(apiKey, {
        api_host: apiHost,
        defaults: '2025-05-24',
        person_profiles: 'always', // Create profiles for anonymous users as well
        capture_pageview: false, // We'll handle pageviews manually for SPA
        capture_pageleave: true, // Enable pageleave tracking
        // Anonymous tracking is enabled by default - these settings ensure it works
        opt_out_capturing_by_default: false, // Allow anonymous tracking
        loaded: (posthog) => {
          // PostHog is loaded and ready
          if (process.env.NODE_ENV === 'development') {
            console.log('PostHog initialized - Anonymous events enabled');
            // Verify anonymous tracking is working
            console.log('Anonymous distinct ID:', posthog.get_distinct_id());
          }
        },
      });
    }
  }
};

export default posthog;

