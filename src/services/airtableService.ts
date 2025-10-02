// Airtable Service for handling API calls
interface BetaUserData {
  firstName: string;
  phone: string;
  email: string;
  artType: string;
}

interface AirtableField {
  [key: string]: string;
}

class AirtableService {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly tableName: string;

  constructor() {
    this.baseUrl = `https://api.airtable.com/v0/${import.meta.env.VITE_AIRTABLE_BASE_ID}`;
    this.apiKey = import.meta.env.VITE_AIRTABLE_API_KEY;
    this.tableName = import.meta.env.VITE_AIRTABLE_TABLE_NAME;

    // Validate environment variables
    if (!this.apiKey || !import.meta.env.VITE_AIRTABLE_BASE_ID || !this.tableName) {
      console.error('Missing Airtable environment variables. Please check your .env file.');
    }
  }

  /**
   * Submit beta user data to Airtable
   */
  async submitBetaUser(userData: BetaUserData): Promise<boolean> {
    try {
      const fields: AirtableField = {
        // Map form data to Airtable field IDs
        "fldDPM6QejGFJFByl": userData.firstName, // First Name
        "fldENlHz6yCYtP8U4": userData.phone,     // Phone Number
        "fldCDA50S9gdyIsu0": userData.email,     // Email Address
        "fldrMgWWVK1JAjVjk": userData.artType    // Primary Art Type
      };

      const response = await fetch(`${this.baseUrl}/${this.tableName}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Airtable API Error:', errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Successfully submitted to Airtable:', result.id);
      return true;

    } catch (error) {
      console.error('Error submitting to Airtable:', error);
      throw error;
    }
  }

  /**
   * Check if Airtable service is properly configured
   */
  isConfigured(): boolean {
    return !!(this.apiKey && import.meta.env.VITE_AIRTABLE_BASE_ID && this.tableName);
  }
}

// Export singleton instance
export const airtableService = new AirtableService();
export type { BetaUserData };
