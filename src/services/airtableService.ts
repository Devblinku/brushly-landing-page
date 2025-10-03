// Simple service for beta user submissions via Netlify function
interface BetaUserData {
  firstName: string;
  phone: string;
  email: string;
  artType: string;
}

/**
 * Submit beta user data via Netlify function
 * All API keys and configuration are handled server-side
 */
export async function submitBetaUser(userData: BetaUserData): Promise<boolean> {
  try {
    const response = await fetch('/.netlify/functions/submit-beta-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Netlify Function Error:', errorData);
      throw new Error(`HTTP error! status: ${response.status} - ${errorData.error || 'Unknown error'}`);
    }

    const result = await response.json();
    console.log('Successfully submitted via Netlify function:', result.message);
    return true;

  } catch (error) {
    console.error('Error submitting to Netlify function:', error);
    throw error;
  }
}

export type { BetaUserData };
