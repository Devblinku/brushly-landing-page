# Airtable Integration Setup

This project uses Airtable to store beta user registrations from both the homepage and pricing page forms. The integration uses **Netlify Functions** to securely handle API calls server-side, keeping your API keys safe.

## Environment Variables Setup

1. Create a `.env` file in the root directory of your project
2. Add the following environment variables (note: NO `VITE_` prefix for security):

```env
# Airtable Configuration (Server-side only)
AIRTABLE_API_KEY=your_airtable_api_key_here
AIRTABLE_BASE_ID=your_airtable_base_id_here
AIRTABLE_TABLE_NAME=your_airtable_table_name_here
```

**Important**: These variables are now server-side only and will NOT be exposed to the client.

## Getting Your Airtable Credentials

### 1. API Key
- Go to [Airtable Account](https://airtable.com/account)
- Generate a personal access token
- Copy the token and use it as `AIRTABLE_API_KEY`

### 2. Base ID
- Open your Airtable base
- Go to Help → API Documentation
- Your Base ID will be shown at the top (starts with `app...`)
- Copy and use as `AIRTABLE_BASE_ID`

### 3. Table Name
- Use the exact name of your table in Airtable
- Case-sensitive (e.g., "Beta Users", "Waitlist", etc.)
- Use as `AIRTABLE_TABLE_NAME`

## Airtable Table Structure

Your Airtable table should have the following fields with these exact Field IDs:

| Field Name | Field ID | Type |
|------------|----------|------|
| First Name | `fldDPM6QejGFJFByl` | Single line text |
| Phone Number | `fldENlHz6yCYtP8U4` | Single line text |
| Email Address | `fldCDA50S9gdyIsu0` | Single line text |
| Primary Art type | `fldrMgWWVK1JAjVjk` | Single line text |

## Form Fields Mapping

Both forms (homepage and pricing page) collect:
- **First Name** → Stored in Airtable field `fldDPM6QejGFJFByl`
- **Phone Number** → Stored in Airtable field `fldENlHz6yCYtP8U4`
- **Email Address** → Stored in Airtable field `fldCDA50S9gdyIsu0`
- **Primary Art Type** → Stored in Airtable field `fldrMgWWVK1JAjVjk`

## Service Architecture

The integration now uses a **secure server-side architecture**:

- **Client Service**: `src/services/airtableService.ts` - Calls Netlify function
- **Server Function**: `netlify/functions/submit-beta-user.js` - Handles Airtable API calls
- **Forms**: Homepage and Pricing page forms both use the same client service
- **Environment**: All credentials stored securely server-side in `.env` file
- **Error Handling**: Comprehensive error handling and user feedback

## Netlify Functions

The project uses Netlify Functions to:
- Keep API keys secure on the server-side
- Handle CORS automatically
- Provide better error handling
- Prevent API key exposure in client-side code

## Testing

### Local Development
1. Install Netlify CLI: `npm install -g netlify-cli`
2. Run locally: `netlify dev`
3. Fill out forms to test the integration

### Production
1. Deploy to Netlify
2. Set environment variables in Netlify dashboard (Site settings → Environment variables)
3. Test forms on your live site

## Security Notes

✅ **Secure Implementation**:
- API credentials are server-side only and never exposed to clients
- Environment variables don't use `VITE_` prefix (not bundled with client code)
- Netlify Functions provide secure server-side execution
- CORS is properly handled for cross-origin requests

⚠️ **Important**:
- Never commit your `.env` file to version control
- Set environment variables in Netlify dashboard for production
- The `.env` file is already included in `.gitignore`
