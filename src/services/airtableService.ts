// Simple service for beta user submissions via Netlify function
interface BetaUserData {
  firstName: string;
  phone: string;
  email: string;
  artType: string;
}

interface DemoRegistrationData {
  name: string;
  email: string;
  mobile?: string;
}

/**
 * Submit beta user data via Netlify functions
 * Step 1: Submit to Airtable
 * Step 2: Subscribe to ConvertKit sequence
 * All API keys and configuration are handled server-side
 */
export async function submitBetaUser(userData: BetaUserData): Promise<boolean> {
  try {
    // Step 1: Submit to Airtable
    const airtableResponse = await fetch('/.netlify/functions/submit-beta-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });

    if (!airtableResponse.ok) {
      const errorData = await airtableResponse.json();
      console.error('Airtable Function Error:', errorData);
      throw new Error(`Airtable error! status: ${airtableResponse.status} - ${errorData.error || 'Unknown error'}`);
    }

    const airtableResult = await airtableResponse.json();
    console.log('Successfully submitted to Airtable:', airtableResult.message);

    // Step 2: Subscribe to ConvertKit sequence
    const convertkitResponse = await fetch('/.netlify/functions/convertkit-subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: userData.firstName,
        email: userData.email
      })
    });

    if (!convertkitResponse.ok) {
      const errorData = await convertkitResponse.json();
      console.error('ConvertKit Function Error:', errorData);
      throw new Error(`ConvertKit error! status: ${convertkitResponse.status} - ${errorData.error || 'Unknown error'}`);
    }

    const convertkitResult = await convertkitResponse.json();
    console.log('Successfully subscribed to ConvertKit:', convertkitResult.message);

    return true;

  } catch (error) {
    console.error('Error submitting beta user:', error);
    throw error;
  }
}

/**
 * Submit newsletter email to Airtable
 * Uses hardcoded table name 'newsletter' with 'email' column
 */
export async function submitNewsletterSignup(email: string): Promise<boolean> {
  try {
    const response = await fetch('/.netlify/functions/newsletter-signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email })
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (jsonError) {
        throw new Error(`Newsletter signup error! status: ${response.status} - Failed to parse error response`);
      }
      throw new Error(`Newsletter signup error! status: ${response.status} - ${errorData.error || 'Unknown error'}`);
    }

    // Check if response has content
    const responseText = await response.text();
    
    if (!responseText) {
      throw new Error('Empty response from newsletter signup function');
    }

    try {
      JSON.parse(responseText);
    } catch (jsonError) {
      throw new Error('Invalid JSON response from newsletter signup function');
    }

    return true;

  } catch (error) {
    throw error;
  }
}

/**
 * Submit demo registration data via Netlify functions
 * Submits to Airtable for demo registrations
 */
export async function submitDemoRegistration(registrationData: DemoRegistrationData): Promise<boolean> {
  try {
    const response = await fetch('/.netlify/functions/demo-registration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registrationData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Demo Registration Function Error:', errorData);
      throw new Error(`Demo registration error! status: ${response.status} - ${errorData.error || 'Unknown error'}`);
    }

    const result = await response.json();
    console.log('Successfully submitted demo registration:', result.message);

    return true;

  } catch (error) {
    console.error('Error submitting demo registration:', error);
    throw error;
  }
}

export type { BetaUserData, DemoRegistrationData };
