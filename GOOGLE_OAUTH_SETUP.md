# Google OAuth Implementation Guide

## Overview

The application now supports secure Google OAuth authentication for both regular users and admin access. The admin portal is protected by an email whitelist system - only Gmail addresses explicitly whitelisted in the environment configuration can access admin privileges.

## Key Security Features

### 1. Email Whitelist for Admin Access
- Only emails listed in `ADMIN_EMAIL_WHITELIST` can access the admin portal
- Whitelist is checked during Google OAuth sign-in
- Whitelist is verified on every admin API request
- Prevents unauthorized access even if someone bypasses frontend checks

### 2. Dual Authentication Methods
- **Traditional Login**: Email/phone + password (existing functionality)
- **Google OAuth**: Sign in with Google account (new functionality)
- Both methods share the same user database and authorization system

### 3. Automatic User Creation
- New Google OAuth users are automatically created in the database
- Admin users get 500 loyalty points, regular users get 50
- Profile photo and name are synced from Google

### 4. Role Assignment
- Whitelisted emails automatically get ADMIN role
- Non-whitelisted emails get CLIENT role
- Existing users' roles are updated if they're added to the whitelist

## Setup Instructions

### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to: APIs & Services → Credentials
4. Click "Create Credentials" → "OAuth client ID"
5. Configure OAuth consent screen (external user type)
6. Add authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`
7. Copy the Client ID and Client Secret

### Step 2: Configure Environment Variables

Create or update `.env.local` in your project root:

```env
# JWT Secret (existing)
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long

# Cron Secret (existing)
CRON_SECRET=your-cron-secret-key

# Google OAuth Configuration (NEW)
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# NextAuth Configuration (NEW)
NEXTAUTH_SECRET=your-nextauth-secret-key-min-32-chars
NEXTAUTH_URL=http://localhost:3000

# Admin Email Whitelist (NEW - CRITICAL)
ADMIN_EMAIL_WHITELIST=admin@example.com,owner@example.com,salon.manager@gmail.com
```

### Step 3: Update Whitelist for Admin Access

Add the Gmail addresses of users who should have admin access:

```env
ADMIN_EMAIL_WHITELIST=salonowner@gmail.com,manager@gmail.com
```

**Important:** Only these exact email addresses will be able to access the admin portal when signing in with Google OAuth.

## How It Works

### User Sign-In Flow

1. User clicks "Sign in with Google" on the login page
2. User is redirected to Google's OAuth consent screen
3. User authorizes the application
4. Google redirects back with authorization code
5. NextAuth exchanges code for user profile (email, name, photo)
6. Application checks if email is in admin whitelist
7. User is created/updated in local database
8. Session is established with appropriate role
9. User is redirected to dashboard (or admin if whitelisted)

### Admin Authorization Flow

1. User attempts to access `/admin` route
2. Frontend checks if user has ADMIN role or isAdmin flag
3. If authorized, user can access admin panel
4. Every admin API call verifies the whitelist flag
5. Unauthorized requests are rejected with 403 error

### Security Layers

1. **Frontend Route Protection**: Checks user role before rendering admin page
2. **API Authorization**: Verifies role and whitelist on every admin API call
3. **Email Whitelist**: Only whitelisted emails get admin privileges
4. **Origin Validation**: CSRF protection on all state-changing endpoints
5. **Rate Limiting**: Prevents brute force on traditional login

## Testing

### Test Regular User Access

1. Add a Gmail that is NOT in the whitelist to your test account
2. Sign in with Google OAuth
3. Verify you're redirected to the client dashboard
4. Verify you cannot access `/admin`

### Test Admin Access

1. Add your Gmail to `ADMIN_EMAIL_WHITELIST`
2. Sign in with Google OAuth
3. Verify you're redirected to the admin panel
4. Verify you can perform admin actions (view stats, manage appointments, etc.)

### Test Traditional Login

1. Traditional email/password login still works
2. Admin users can still use traditional login with their credentials
3. Both authentication methods work independently

## Files Modified

- `src/app/api/auth/[...nextauth]/route.ts` - Google OAuth handler
- `src/context/AuthContext.tsx` - Updated to support NextAuth sessions
- `src/components/providers/ClientProviders.tsx` - Added SessionProvider
- `src/app/auth/page.tsx` - Added Google OAuth button
- `src/app/admin/page.tsx` - Added whitelist verification
- `src/app/api/admin/stats/route.ts` - Added whitelist verification
- `src/app/api/appointments/route.ts` - Added whitelist verification
- `src/lib/auth.ts` - Added isAdmin to SessionPayload
- `src/types/declarations.d.ts` - Added NextAuth type definitions
- `ENV_SETUP.md` - Environment variables documentation

## Security Best Practices

1. **Never commit `.env.local`** - It contains sensitive secrets
2. **Use strong secrets** - Generate random 32+ character strings
3. **Limit whitelist** - Only add trusted email addresses
4. **Monitor access** - Log admin access attempts
5. **Rotate secrets** - Change secrets periodically
6. **Use HTTPS** - Required for production OAuth
7. **Keep dependencies updated** - Run `npm audit` regularly

## Troubleshooting

### Google OAuth Not Working

- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
- Check that redirect URIs match exactly in Google Console
- Ensure `NEXTAUTH_URL` matches your application URL
- Check browser console for OAuth errors

### Admin Access Denied

- Verify email is in `ADMIN_EMAIL_WHITELIST` (case-insensitive)
- Check that email matches exactly (no typos)
- Ensure `.env.local` is being loaded (restart dev server)
- Check browser dev tools for authentication state

### Build Errors

- Ensure all environment variables are set
- Check TypeScript types in declarations.d.ts
- Verify NextAuth is properly installed
- Run `npm install` to ensure dependencies are current

## Migration Notes

- Existing users can continue using traditional login
- New users can choose either authentication method
- User accounts are synced across both methods
- Admin privileges are controlled by whitelist, not role field alone
- No data migration required - both methods use the same database

## Support

For issues with Google OAuth setup:
- Check Google Cloud Console for API quota issues
- Verify domain verification for production
- Review NextAuth.js documentation: https://next-auth.js.org
- Check application logs for detailed error messages
