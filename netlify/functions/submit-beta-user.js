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
    // Get environment variables (without VITE_ prefix)
    const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
    const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
    const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME;
    const CONVERTKIT_API_KEY = process.env.CONVERTKIT_API_KEY;
    const CONVERTKIT_SEQUENCE_ID = process.env.CONVERTKIT_SEQUENCE_ID;

    // Validate environment variables
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_NAME) {
      console.error('Missing Airtable environment variables');
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

    // Parse request body
    const userData = JSON.parse(event.body);
    
    // Validate required fields
    if (!userData.firstName || !userData.phone || !userData.email || !userData.artType) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: 'Missing required fields',
          required: ['firstName', 'phone', 'email', 'artType']
        })
      };
    }

    // Prepare Airtable fields
    const airtableFields = {
      "fldDPM6QejGFJFByl": userData.firstName, // First Name
      "fldENlHz6yCYtP8U4": userData.phone,     // Phone Number
      "fldCDA50S9gdyIsu0": userData.email,     // Email Address
      "fldrMgWWVK1JAjVjk": userData.artType    // Primary Art Type
    };

    // Prepare ConvertKit data (only first name and email)
    const convertkitData = {
      first_name: userData.firstName,
      email_address: userData.email,
      state: "active"
    };


    // Make parallel requests to both APIs
    const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`;
    const convertkitUrl = 'https://api.kit.com/v4/subscribers';
    const convertkitSequenceUrl = `https://api.kit.com/v4/sequences/${CONVERTKIT_SEQUENCE_ID}/subscribers`;
    
    const [airtableResponse, convertkitResponse, convertkitSequenceResponse] = await Promise.allSettled([
      // Airtable API call
      fetch(airtableUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fields: airtableFields })
      }),
      
      // ConvertKit API call (only if API key is provided)
      CONVERTKIT_API_KEY ? fetch(convertkitUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Kit-Api-Key': CONVERTKIT_API_KEY
        },
        body: JSON.stringify(convertkitData)
      }) : Promise.resolve({ ok: true, json: () => ({ id: 'skipped' }) }),
      
      // ConvertKit sequence API call (only if API key and sequence ID are provided)
      (CONVERTKIT_API_KEY && CONVERTKIT_SEQUENCE_ID) ? fetch(convertkitSequenceUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Kit-Api-Key': CONVERTKIT_API_KEY
        },
        body: JSON.stringify({
          email_address: userData.email
        })
      }) : Promise.resolve({ ok: true, json: () => ({ id: 'skipped' }) })
    ]);

    // Handle Airtable response
    let airtableResult = null;
    if (airtableResponse.status === 'fulfilled' && airtableResponse.value.ok) {
      airtableResult = await airtableResponse.value.json();
      console.log('Successfully submitted to Airtable:', airtableResult.id);
    } else {
      console.error('Airtable API Error:', airtableResponse.reason || airtableResponse.value);
    }

    // Handle ConvertKit response
    let convertkitResult = null;
    if (convertkitResponse.status === 'fulfilled' && convertkitResponse.value.ok) {
      convertkitResult = await convertkitResponse.value.json();
      console.log('Successfully submitted to ConvertKit:', convertkitResult.id || 'subscriber added');
    } else {
      console.error('ConvertKit API Error:', convertkitResponse.reason || convertkitResponse.value);
    }

    // Handle ConvertKit sequence response
    let convertkitSequenceResult = null;
    if (convertkitSequenceResponse.status === 'fulfilled' && convertkitSequenceResponse.value.ok) {
      convertkitSequenceResult = await convertkitSequenceResponse.value.json();
      console.log('Successfully added to ConvertKit sequence:', convertkitSequenceResult.id || 'added to sequence');
    } else {
      console.error('ConvertKit Sequence API Error:', convertkitSequenceResponse.reason || convertkitSequenceResponse.value);
    }

    // Return success if at least one API call succeeded
    const success = airtableResult || convertkitResult;
    
    if (!success) {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: 'Failed to submit to both services',
          airtable: airtableResponse.status === 'rejected' ? 'failed' : 'success',
          convertkit: convertkitResponse.status === 'rejected' ? 'failed' : 'success',
          convertkitSequence: convertkitSequenceResponse.status === 'rejected' ? 'failed' : 'success'
        })
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        success: true,
        airtable: airtableResult ? 'success' : 'failed',
        convertkit: convertkitResult ? 'success' : 'failed',
        convertkitSequence: convertkitSequenceResult ? 'success' : 'failed',
        message: 'Successfully submitted to beta waitlist'
      })
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
