# Airtable Integration Setup

This project uses Airtable to store beta user registrations from both the homepage and pricing page forms.

## Environment Variables Setup

1. Create a `.env` file in the root directory of your project
2. Add the following environment variables:

```env
# Airtable Configuration
VITE_AIRTABLE_API_KEY=your_airtable_api_key_here
VITE_AIRTABLE_BASE_ID=your_airtable_base_id_here
VITE_AIRTABLE_TABLE_NAME=your_airtable_table_name_here
```

## Getting Your Airtable Credentials

### 1. API Key
- Go to [Airtable Account](https://airtable.com/account)
- Generate a personal access token
- Copy the token and use it as `VITE_AIRTABLE_API_KEY`

### 2. Base ID
- Open your Airtable base
- Go to Help → API Documentation
- Your Base ID will be shown at the top (starts with `app...`)
- Copy and use as `VITE_AIRTABLE_BASE_ID`

### 3. Table Name
- Use the exact name of your table in Airtable
- Case-sensitive (e.g., "Beta Users", "Waitlist", etc.)
- Use as `VITE_AIRTABLE_TABLE_NAME`

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

The integration uses a service layer pattern:

- **Service**: `src/services/airtableService.ts`
- **Forms**: Homepage and Pricing page forms both use the same service
- **Environment**: All credentials stored in `.env` file
- **Error Handling**: Comprehensive error handling and user feedback

## Testing

1. Fill out either form on the homepage or pricing page
2. Check your Airtable base to confirm the data was submitted
3. Check browser console for any errors if submission fails

## Security Notes

- Never commit your `.env` file to version control
- The `.env` file is already included in `.gitignore`
- API credentials are only accessible on the client side (suitable for this use case)
- For production, consider using server-side API calls for additional security
