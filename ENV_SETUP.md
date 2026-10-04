# Environment Variables Setup

This application requires the following environment variables to be configured. Create a `.env.local` file in the project root with these values:

## Required Environment Variables

### JWT Secret
```
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
```
- Must be at least 32 characters long
- Used for signing JWT tokens
- Generate a strong random string for production

### Cron Secret
```
CRON_SECRET=your-cron-secret-key
```
- Used to authenticate cron job requests
- Generate a strong random string

### Google OAuth Configuration
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```
- Get these from Google Cloud Console
- Create OAuth 2.0 credentials for Web application
- Add authorized redirect URIs (e.g., http://localhost:3000/api/auth/callback/google)

### NextAuth Configuration
```
NEXTAUTH_SECRET=your-nextauth-secret-key-min-32-chars
NEXTAUTH_URL=http://localhost:3000
```
- NEXTAUTH_SECRET: Used for NextAuth.js session encryption (min 32 chars)
- NEXTAUTH_URL: Your application's base URL (change for production)

### Admin Email Whitelist
```
ADMIN_EMAIL_WHITELIST=admin@example.com,owner@example.com
```
- Comma-separated list of Gmail addresses that can access admin portal
- Only these emails will be granted ADMIN role when logging in via Google OAuth
- Example: `ADMIN_EMAIL_WHITELIST=salonowner@gmail.com,manager@gmail.com`

## How to Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth client ID
5. Configure consent screen (external user type)
6. Add authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`
7. Copy Client ID and Client Secret to your `.env.local`

## Security Notes

- Never commit `.env.local` to version control
- Use strong, randomly generated secrets
- Rotate secrets periodically
- In production, use HTTPS and proper domain configuration
- Only add trusted email addresses to ADMIN_EMAIL_WHITELIST
