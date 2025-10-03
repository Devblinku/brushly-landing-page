exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  try {
    // Get environment variables
    const CONVERTKIT_API_KEY = process.env.CONVERTKIT_API_KEY;
    const CONVERTKIT_SEQUENCE_ID = process.env.CONVERTKIT_SEQUENCE_ID;

    // Validate environment variables
    if (!CONVERTKIT_API_KEY || !CONVERTKIT_SEQUENCE_ID) {
      console.error('Missing ConvertKit environment variables');
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: 'ConvertKit configuration error',
          message: 'Missing required environment variables'
        })
      };
    }

    // Parse request body
    const userData = JSON.parse(event.body);
    
    // Validate required fields
    if (!userData.firstName || !userData.email) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: 'Missing required fields',
          required: ['firstName', 'email']
        })
      };
    }

    // Step 1: Create subscriber
    const subscriberData = {
      first_name: userData.firstName,
      email_address: userData.email,
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

    if (!subscriberResponse.ok) {
      const errorData = await subscriberResponse.json();
      console.error('ConvertKit Subscriber API Error:', errorData);
      throw new Error(`Failed to create subscriber: ${subscriberResponse.status}`);
    }

    const subscriberResult = await subscriberResponse.json();
    console.log('Successfully created ConvertKit subscriber:', subscriberResult.id);

    // Step 2: Add subscriber to sequence
    const sequenceData = {
      email_address: userData.email
    };

    const sequenceResponse = await fetch(`https://api.kit.com/v4/sequences/${CONVERTKIT_SEQUENCE_ID}/subscribers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Kit-Api-Key': CONVERTKIT_API_KEY
      },
      body: JSON.stringify(sequenceData)
    });

    if (!sequenceResponse.ok) {
      const errorData = await sequenceResponse.json();
      console.error('ConvertKit Sequence API Error:', errorData);
      throw new Error(`Failed to add to sequence: ${sequenceResponse.status}`);
    }

    const sequenceResult = await sequenceResponse.json();
    console.log('Successfully added to ConvertKit sequence:', sequenceResult.id || 'added to sequence');

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        success: true,
        subscriber: subscriberResult,
        sequence: sequenceResult,
        message: 'Successfully subscribed to ConvertKit and added to sequence'
      })
    };

  } catch (error) {
    console.error('ConvertKit function error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'ConvertKit subscription failed',
        message: error.message
      })
    };
  }
};
