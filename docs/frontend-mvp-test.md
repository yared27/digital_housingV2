# Frontend MVP Manual Test Checklist

1) Login as owner, create a property with images
   - Go to `/owner/properties` (must be authenticated as owner/admin)
   - Click `New Property`, fill title/description/price, upload images, submit
   - Expect success message and property appears in owner list

2) Visit `/properties`, see it in list, open details
   - Navigate to `/properties`
   - Find the new property in the list and click `View`
   - Expect property details and image gallery

3) Login as renter, request a booking
   - On the property detail page, use the booking widget to select date range and message
   - If not logged in, you will be redirected to `/auth/login`
   - If logged in as renter, booking request should be created and success message shown

4) Owner confirms booking
   - Owner visits `/owner/bookings`
   - Find pending booking and click `Confirm`
   - Expect success and status change

5) Renter sees status update in `/bookings`
   - Renter visits `/bookings` (user bookings) and sees updated status

6) Verify refresh token behaviour
   - The app uses cookie-based auth and RTK baseQuery with `credentials: 'include'` and refresh-on-401.
   - Ensure requests have cookies and that flows work when access token expires (server should issue refresh token)

Notes:
- Owner pages are protected with `ProtectedRoute` (allowedRoles ['owner','admin']).
- Image uploads use `/api/uploads/sign` and Cloudinary; ensure server is running and credentials set.

*** End Checklist
