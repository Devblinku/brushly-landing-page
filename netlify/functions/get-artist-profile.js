const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      },
      body: ''
    };
  }

  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Get environment variables
    const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Validate environment variables
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing Supabase environment variables');
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: 'Server configuration error',
          message: 'Missing required environment variables'
        })
      };
    }

    // Get slug from query parameters
    const slug = event.queryStringParameters?.slug;

    if (!slug) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: 'Missing required parameter: slug'
        })
      };
    }

    // Create Supabase client with service role key (for admin access)
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Optimized: Query mapping table first to get user_id by slug
    const slugLower = slug.toLowerCase().trim();
    const { data: profileMapping, error: mappingError } = await supabase
      .from('public_profiles')
      .select('user_id')
      .eq('slug', slugLower)
      .eq('enabled', true)
      .single();

    if (mappingError || !profileMapping) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: 'Profile not found',
          message: 'No public profile found with this slug'
        })
      };
    }

    // Fetch only the specific user by ID (much faster!)
    const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(profileMapping.user_id);

    if (userError || !user) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: 'User not found'
        })
      };
    }

    // Extract profile data from user_metadata
    const userMetadata = user.user_metadata || {};

    // Return profile data
    const profileData = {
      id: user.id,
      artist_display_name: userMetadata.artist_display_name || null,
      about: userMetadata.about || null,
      public_profile_image_url: userMetadata.public_profile_image_url || null,
      public_profile_categories: userMetadata.public_profile_categories || [],
      public_profile_artworks: userMetadata.public_profile_artworks || [],
      public_profile_slug: userMetadata.public_profile_slug || slug,
      public_profile_enabled: true,
      public_profile_facebook_url: userMetadata.public_profile_facebook_url || null,
      public_profile_instagram_url: userMetadata.public_profile_instagram_url || null,
      public_profile_linkedin_url: userMetadata.public_profile_linkedin_url || null,
      public_profile_twitter_url: userMetadata.public_profile_twitter_url || null,
      public_profile_tiktok_url: userMetadata.public_profile_tiktok_url || null,
      public_profile_email: userMetadata.public_profile_email || user.email || null
    };

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profileData)
    };

  } catch (error) {
    console.error('Function error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message
      })
    };
  }
};
