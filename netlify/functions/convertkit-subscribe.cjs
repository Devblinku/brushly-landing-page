exports.handler = async (event, context) => {
  console.log('ConvertKit Function - Request received:', {
    method: event.httpMethod,
    path: event.path,
    body: event.body ? 'present' : 'empty'
  });

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
    if (!CONVERTKIT_API_KEY) {
      console.error('Missing ConvertKit API key');
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: 'Server configuration error',
          message: 'Missing ConvertKit API key'
        })
      };
    }

    if (!CONVERTKIT_SEQUENCE_ID) {
      console.error('Missing ConvertKit Sequence ID');
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: 'Server configuration error',
          message: 'Missing ConvertKit Sequence ID'
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

    console.log('ConvertKit Subscribe - Starting process for:', userData.email);

    // Step 1: Subscribe to ConvertKit
    const convertkitData = {
      first_name: userData.firstName,
      email_address: userData.email,
      state: "active"
    };

    const convertkitUrl = 'https://api.kit.com/v4/subscribers';
    
    console.log('ConvertKit Subscribe - Making subscription request...');
    const subscribeResponse = await fetch(convertkitUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Kit-Api-Key': CONVERTKIT_API_KEY
      },
      body: JSON.stringify(convertkitData)
    });

    if (!subscribeResponse.ok) {
      const errorText = await subscribeResponse.text();
      console.error('ConvertKit Subscribe Error:', errorText);
      
      return {
        statusCode: subscribeResponse.status,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: 'Failed to subscribe to ConvertKit',
          details: errorText,
          step: 'subscribe'
        })
      };
    }

    const subscribeResult = await subscribeResponse.json();
    console.log('ConvertKit Subscribe - Success:', subscribeResult.id);

    // Step 2: Add subscriber to sequence
    let sequenceResult = null;
    try {
      const convertkitSequenceUrl = `https://api.kit.com/v4/sequences/${CONVERTKIT_SEQUENCE_ID}/subscribers`;
      
      console.log('ConvertKit Sequence - Making sequence request...');
      const sequenceResponse = await fetch(convertkitSequenceUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Kit-Api-Key': CONVERTKIT_API_KEY
        },
        body: JSON.stringify({
          email_address: userData.email
        })
      });
      
      if (sequenceResponse.ok) {
        sequenceResult = await sequenceResponse.json();
        console.log('ConvertKit Sequence - Success:', sequenceResult.id || 'added to sequence');
      } else {
        const sequenceErrorText = await sequenceResponse.text();
        console.error('ConvertKit Sequence Error:', sequenceErrorText);
        // Don't fail the whole process if sequence fails
      }
    } catch (sequenceError) {
      console.error('ConvertKit Sequence Exception:', sequenceError);
      // Don't fail the whole process if sequence fails
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        success: true,
        subscribe: 'success',
        sequence: sequenceResult ? 'success' : 'failed',
        subscriberId: subscribeResult.id,
        message: 'Successfully subscribed to ConvertKit'
      })
    };

  } catch (error) {
    console.error('ConvertKit Function error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message,
        step: 'unknown'
      })
    };
  }
};
