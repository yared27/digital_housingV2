# Manual Booking Tests (MVP)

## Preconditions

- Server running with MongoDB.
- Auth flows working with cookie sessions.
- One owner account and one renter account.

## 1) Create property as owner

1. Sign in as owner.
2. Create property with `POST /api/properties`.
3. Save returned property id.

Expected: `201` with `data` payload.

## 2) Create booking as renter

1. Sign in as renter.
2. Call `POST /api/bookings` with `propertyId`, `startDate`, `endDate`.

Expected: `201` with booking `status = pending` and `paymentStatus = pending`.

## 3) Overlap conflict

1. While first booking is still `pending`, submit second booking on same property with overlapping dates.

Expected: `409` and clear conflict message.

## 4) Owner confirms booking

1. Sign in as owner of the property.
2. Call `PUT /api/bookings/:id/status` with `{ "status": "confirmed" }`.

Expected: `200` and status changes to `confirmed`.

## 5) Booking visibility

1. Sign in as renter and call `GET /api/bookings`.
2. Sign in as owner and call `GET /api/bookings`.

Expected:

- renter sees own bookings
- owner sees bookings for owned properties

## 6) Renter cancellation

1. Sign in as renter.
2. Call `PUT /api/bookings/:id/status` with `{ "status": "cancelled" }` on pending/confirmed booking.

Expected: `200` and status is `cancelled`.

## 7) Availability endpoint behavior

1. Call `GET /api/properties/:id/availability` with overlapping dates for pending/confirmed reservation.

Expected: `{ "available": false }`

2. Call with non-overlapping dates.

Expected: `{ "available": true }`
