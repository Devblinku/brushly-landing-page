# Dashboard Setup Guide

## How to Access the Dashboard

### Step 1: Create a User Account in Supabase

Before you can log in, you need to create a user account in your Supabase project:

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Users**
3. Click **Add User** → **Create New User**
4. Enter an email and password
5. Click **Create User**

Alternatively, you can enable email signup:
1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Users can then sign up via `/dashboard/login` (signup link can be added)

### Step 2: Access the Dashboard

1. **Login Page**: Navigate to `http://localhost:5173/dashboard/login`
2. **Enter Credentials**: Use the email and password you created in Supabase
3. **Dashboard**: After successful login, you'll be redirected to `/dashboard`

## Dashboard Features

### Current Features:
- ✅ Authentication system
- ✅ Protected routes
- ✅ Dashboard overview with stats
- ✅ Sidebar navigation
- ✅ User profile display

### Coming Soon:
- ⏳ Blog post management (create, edit, delete)
- ⏳ Rich text editor for blog posts
- ⏳ Category management
- ⏳ Tag management
- ⏳ Image upload functionality

## Dashboard Routes

- `/dashboard/login` - Login page (public)
- `/dashboard` - Main dashboard (protected)
- `/dashboard/posts` - Blog posts list (protected, coming soon)
- `/dashboard/categories` - Categories management (protected, coming soon)
- `/dashboard/tags` - Tags management (protected, coming soon)

## Troubleshooting

### "Failed to sign in" Error
- Check that the user exists in Supabase Authentication → Users
- Verify email and password are correct
- Check browser console for detailed error messages

### Redirect Loop
- Clear browser cookies/localStorage
- Check that AuthProvider is properly set up in `main.tsx`

### User Not Found
- Create a user in Supabase Dashboard first
- Or enable email signup if you want users to register themselves

## Security Notes

- All dashboard routes are protected by authentication
- Users must be authenticated to access dashboard
- Sessions are managed by Supabase Auth
- Logout clears session and redirects to login

