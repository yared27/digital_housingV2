# Auth Redirect Rules

## Role Mapping

- renter -> /properties
- owner -> /owner/properties
- admin -> /admin

## Where Redirects Happen

- /dashboard
  - Not authenticated: redirects to /auth/login
  - Authenticated: redirects by role using the mapping above
- Login flow
  - After successful sign-in, client redirects immediately by role
- Signup flow
  - After successful signup, client redirects immediately by role
- Google OAuth flow
  - Backend callback now redirects to `${CLIENT_URL}/auth/callback`
  - /auth/callback checks auth state and forwards to /dashboard
  - /dashboard applies role-to-route redirect

## Manual Test Steps

1. Seed test users (if needed):
   - `cd server`
   - `npm run seed:users`
2. Start backend and frontend.
3. Login with renter account (`renter@test.com`) and confirm landing page is /properties.
4. Login with owner account (`owner@test.com`) and confirm landing page is /owner/properties.
5. Login with admin account (`admin@test.com`) and confirm landing page is /admin.
6. Open /dashboard while logged out and confirm redirect to /auth/login.
7. Use Google login and confirm browser goes to /auth/callback, then /dashboard, then final role page.
8. Refresh browser on /properties, /owner/properties, and /admin and confirm no redirect loop.
