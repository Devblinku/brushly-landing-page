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

    // Step 2: Subscribe to Sender.net
    try {
      const SENDER_API_KEY = process.env.SENDER_API_KEY;
      
      if (SENDER_API_KEY) {
        // Prepare data for Sender.net
        const senderData = {
          email: email,
          firstname: name,
          groups: ["enJX3p"],
          trigger_automation: true
        };

        // Add phone number if available
        if (mobile && mobile.trim()) {
          senderData.phone = mobile.trim();
        }

        const senderResponse = await fetch('https://api.sender.net/v2/subscribers', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${SENDER_API_KEY}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(senderData)
        });

        if (senderResponse.ok) {
          const senderResult = await senderResponse.json();
          console.log('Successfully created Sender.net subscriber:', senderResult);
        } else {
          console.error('Failed to create Sender.net subscriber:', await senderResponse.text());
        }
      } else {
        console.log('Sender.net API key not found, skipping Sender.net integration');
      }
    } catch (senderError) {
      console.error('Sender.net integration error:', senderError);
      // Don't fail the entire request if Sender.net fails
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
