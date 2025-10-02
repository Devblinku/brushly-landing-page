// Airtable Service for handling API calls
interface BetaUserData {
  firstName: string;
  phone: string;
  email: string;
  artType: string;
}


class AirtableService {
  private readonly functionUrl: string;

  constructor() {
    // Use Netlify function URL - works both locally and in production
    this.functionUrl = '/.netlify/functions/submit-beta-user';
  }

  /**
   * Submit beta user data to Airtable via Netlify function
   */
  async submitBetaUser(userData: BetaUserData): Promise<boolean> {
    try {
      const response = await fetch(this.functionUrl, {
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

  /**
   * Check if Airtable service is properly configured
   */
  isConfigured(): boolean {
    // Always return true since configuration is handled server-side
    return true;
  }
}

// Export singleton instance
export const airtableService = new AirtableService();
export type { BetaUserData };
