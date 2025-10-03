// Beta Submission Service for handling both Airtable and ConvertKit API calls
interface BetaUserData {
  firstName: string;
  phone: string;
  email: string;
  artType: string;
}

interface SubmissionResult {
  success: boolean;
  airtable?: 'success' | 'failed';
  convertkit?: 'success' | 'failed';
  message: string;
  errors?: string[];
}

class BetaSubmissionService {
  private readonly airtableUrl: string;
  private readonly convertkitUrl: string;

  constructor() {
    // Use Netlify function URLs
    this.airtableUrl = '/.netlify/functions/submit-beta-user';
    this.convertkitUrl = '/.netlify/functions/convertkit-subscribe';
  }

  /**
   * Submit beta user data to both Airtable and ConvertKit
   */
  async submitBetaUser(userData: BetaUserData): Promise<SubmissionResult> {
    const results: SubmissionResult = {
      success: false,
      message: '',
      errors: []
    };

    try {
      // Step 1: Submit to Airtable
      console.log('Step 1: Submitting to Airtable...');
      const airtableResult = await this.submitToAirtable(userData);
      
      if (airtableResult.success) {
        results.airtable = 'success';
        console.log('✅ Airtable submission successful');
      } else {
        results.airtable = 'failed';
        results.errors?.push(`Airtable: ${airtableResult.error}`);
        console.error('❌ Airtable submission failed:', airtableResult.error);
      }

      // Step 2: Submit to ConvertKit (subscribe + tag)
      console.log('Step 2: Submitting to ConvertKit...');
      const convertkitResult = await this.submitToConvertKit(userData);
      
      if (convertkitResult.success) {
        results.convertkit = 'success';
        console.log('✅ ConvertKit submission successful');
      } else {
        results.convertkit = 'failed';
        results.errors?.push(`ConvertKit: ${convertkitResult.error}`);
        console.error('❌ ConvertKit submission failed:', convertkitResult.error);
      }

      // Determine overall success
      results.success = results.airtable === 'success' || results.convertkit === 'success';
      
      if (results.success) {
        const services = [];
        if (results.airtable === 'success') services.push('Airtable');
        if (results.convertkit === 'success') services.push('ConvertKit');
        results.message = `Successfully submitted to ${services.join(' and ')}`;
      } else {
        results.message = 'Failed to submit to any service';
      }

      return results;

    } catch (error) {
      console.error('Beta submission error:', error);
      return {
        success: false,
        message: 'An unexpected error occurred',
        errors: [`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`]
      };
    }
  }

  /**
   * Submit to Airtable only
   */
  private async submitToAirtable(userData: BetaUserData): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(this.airtableUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        return { success: false, error: `HTTP ${response.status}: ${errorText}` };
      }

      const result = await response.json();
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Network error' 
      };
    }
  }

  /**
   * Submit to ConvertKit (subscribe + tag)
   */
  private async submitToConvertKit(userData: BetaUserData): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(this.convertkitUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: userData.firstName,
          email: userData.email
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        return { success: false, error: `HTTP ${response.status}: ${errorText}` };
      }

      const result = await response.json();
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Network error' 
      };
    }
  }

  /**
   * Check if service is properly configured
   */
  isConfigured(): boolean {
    // Always return true since configuration is handled server-side
    return true;
  }
}

// Export singleton instance
export const betaSubmissionService = new BetaSubmissionService();
export type { BetaUserData, SubmissionResult };
