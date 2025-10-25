const { Airtable } = require('airtable');

// Initialize Airtable with API key from environment variables
const airtable = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY
});

// Get the base and table
const base = airtable.base(process.env.AIRTABLE_BASE_ID);
const table = base('demo'); // Table name for demo registrations

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

    // Prepare data for Airtable
    const recordData = {
      'Name': name,
      'email': email,
      'batch': 'demo1',
      'phoneno': mobile || ''
    };

    // Create record in Airtable
    const record = await table.create(recordData);

    console.log('Demo registration created:', record.id);

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

          // Add tag "demo1" to subscriber
          const tagData = {
            email_address: email,
            tags: ["demo1"]
          };

          const tagResponse = await fetch('https://api.kit.com/v4/tags', {
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
        message: 'Demo registration successful',
        recordId: record.id
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
