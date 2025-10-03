// Simple service for beta user submissions via Netlify function
interface BetaUserData {
  firstName: string;
  phone: string;
  email: string;
  artType: string;
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

export type { BetaUserData };
