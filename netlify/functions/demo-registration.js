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

    // Step 2: Subscribe to Brevo
    try {
      const BREVO_API_KEY = process.env.BREVO_API_KEY;
      
      if (BREVO_API_KEY) {
        // Prepare data for Brevo
        const brevoData = {
          email: email,
          attributes: {
            FIRSTNAME: name
          },
          listIds: [5],
          updateEnabled: false
        };

        const brevoResponse = await fetch('https://api.brevo.com/v3/contacts', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'api-key': BREVO_API_KEY,
            'content-type': 'application/json'
          },
          body: JSON.stringify(brevoData)
        });

        if (brevoResponse.ok) {
          const brevoResult = await brevoResponse.json();
          console.log('Successfully created Brevo contact:', brevoResult);
        } else {
          console.error('Failed to create Brevo contact:', await brevoResponse.text());
        }
      } else {
        console.log('Brevo API key not found, skipping Brevo integration');
      }
    } catch (brevoError) {
      console.error('Brevo integration error:', brevoError);
      // Don't fail the entire request if Brevo fails
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
