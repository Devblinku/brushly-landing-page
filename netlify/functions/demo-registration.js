// No Airtable SDK import needed - using REST API like other functions

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Get environment variables (same pattern as other functions)
    const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
    const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
    // Hardcode table name as requested
    const AIRTABLE_TABLE_NAME = 'demo';

    // Validate environment variables
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      console.error('Missing Airtable environment variables');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Server configuration error',
          message: 'Missing required environment variables'
        })
      };
    }

    // Parse the request body
    const { name, email, mobile } = JSON.parse(event.body);

    // Validate required fields
    if (!name || !email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Name and email are required fields' 
        })
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Please provide a valid email address' 
        })
      };
    }

    // Prepare Airtable fields (same pattern as other functions)
    const airtableFields = {
      'Name': name,
      'email': email,
      'batch': 'demo1',
      'phoneno': mobile || ''
    };

    // Make Airtable API call (same pattern as other functions)
    const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`;
    
    const airtableResponse = await fetch(airtableUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields: airtableFields })
    });

    // Handle Airtable response
    if (!airtableResponse.ok) {
      const errorData = await airtableResponse.json();
      console.error('Airtable API Error:', errorData);
      
      return {
        statusCode: airtableResponse.status,
        headers,
        body: JSON.stringify({ 
          error: 'Failed to submit to Airtable',
          details: errorData
        })
      };
    }

    const airtableResult = await airtableResponse.json();
    console.log('Successfully submitted to Airtable:', airtableResult.id);

    // Step 2: Subscribe to ConvertKit and add tag
    try {
      const CONVERTKIT_API_KEY = process.env.CONVERTKIT_API_KEY;
      
      if (CONVERTKIT_API_KEY) {
        // Create subscriber in ConvertKit
        const subscriberData = {
          first_name: name,
          email_address: email,
          state: "active"
        };

        const subscriberResponse = await fetch('https://api.kit.com/v4/subscribers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Kit-Api-Key': CONVERTKIT_API_KEY
          },
          body: JSON.stringify(subscriberData)
        });

        if (subscriberResponse.ok) {
          const subscriberResult = await subscriberResponse.json();
          console.log('Successfully created ConvertKit subscriber:', subscriberResult.id);

          // Add tag "demo1" to subscriber using correct API endpoint
          const tagData = {
            email_address: email
          };

          const tagResponse = await fetch('https://api.kit.com/v4/tags/11975537/subscribers', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Kit-Api-Key': CONVERTKIT_API_KEY
            },
            body: JSON.stringify(tagData)
          });

          if (tagResponse.ok) {
            console.log('Successfully added demo1 tag to subscriber');
          } else {
            console.error('Failed to add tag to subscriber:', await tagResponse.text());
          }
        } else {
          console.error('Failed to create ConvertKit subscriber:', await subscriberResponse.text());
        }
      } else {
        console.log('ConvertKit API key not found, skipping ConvertKit integration');
      }
    } catch (convertkitError) {
      console.error('ConvertKit integration error:', convertkitError);
      // Don't fail the entire request if ConvertKit fails
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true,
        airtable: 'success',
        message: 'Demo registration successful'
      })
    };

  } catch (error) {
    console.error('Error creating demo registration:', error);

    // Handle Airtable-specific errors
    if (error.error) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: `Airtable error: ${error.error}` 
        })
      };
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error' 
      })
    };
  }
};
