# UI Routes by Role

## Public / Auth

- `/` - Marketing landing page
- `/auth/login` - Login
- `/auth/signup` - Sign up
- `/auth/callback` - Google OAuth callback bridge to dashboard
- `/dashboard` - Role smart redirect (renter/owner/admin)

## Renter

- `/properties` - Property discovery, filters, sorting, pagination
- `/properties/[id]` - Property details + booking widget
- `/bookings` - My bookings list and cancellation action where allowed
- `/profile` - Profile edit + avatar upload

## Owner

- `/owner/properties` - Owner property dashboard with stats and create/edit/delete
- `/owner/bookings` - Booking requests dashboard with pending-first workflow
- `/profile` - Shared profile page

## Admin

- `/admin` - Overview dashboard (stats + recent activity)
- `/admin/users` - Admin user list (read-only)
- `/admin/properties` - Property management view with delete action
- `/admin/bookings` - Booking management view with status actions
- `/admin/reports` - Placeholder page for future reports

## Legacy Aliases

- `/createProperty` -> `/owner/properties`
- `/property` -> `/properties`
