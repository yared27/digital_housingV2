# Booking & Reservations API (MVP)

Base path: `/api/bookings`

Authentication: cookie-based auth (`requireAuth`) with `credentials: include`.

## Reservation model

Fields:

- `renterId` (ObjectId)
- `ownerId` (ObjectId)
- `propertyId` (ObjectId)
- `startDate` (Date)
- `endDate` (Date)
- `totalPrice` (number)
- `status`: `pending | confirmed | cancelled | completed | declined`
- `paymentStatus`: `pending | paid | refunded`
- `message` (optional string)
- `createdAt`, `updatedAt`

## Overlap rule

A requested date range blocks if it overlaps any existing `pending` or `confirmed` reservation for the same property.

Overlap formula:

- `(startA < endB) && (endA > startB)`

`cancelled` and `declined` reservations do not block availability.

## Price calculation (MVP)

`totalPrice = property.price.amount * bookingUnits`

Where `bookingUnits` is based on `property.price.period`:

- `daily`: `ceil(days)`
- `weekly`: `ceil(days / 7)`
- `monthly`: `ceil(days / 30)`
- `yearly`: `ceil(days / 365)`

`days = ceil((endDate - startDate) / 1 day)` with minimum `1`.

## Endpoints

### 1) Create booking

`POST /api/bookings`

Allowed roles: `renter`, `admin`

Body:

```json
{
  "propertyId": "67f0e77f9e57c80f5adf1c2e",
  "startDate": "2026-04-05T00:00:00.000Z",
  "endDate": "2026-04-12T00:00:00.000Z",
  "message": "I can move in this week"
}
```

Responses:

- `201` created
- `400` invalid payload/date range
- `404` property not found
- `409` overlapping reservation conflict

### 2) List bookings

`GET /api/bookings?page=1&limit=10&status=pending`

- `renter`: sees own bookings (`renterId = me`)
- `owner`: sees bookings for owned properties (`ownerId = me`)
- `admin`: can list all; optional `ownerId` / `renterId` filters

Response:

```json
{
  "data": [],
  "meta": { "page": 1, "limit": 10, "total": 0, "totalPages": 1 }
}
```

### 3) Get booking by id

`GET /api/bookings/:id`

Allowed: booking renter, booking owner, or admin.

### 4) Update booking status

`PUT /api/bookings/:id/status`

Body:

```json
{ "status": "confirmed" }
```

Allowed transitions:

- owner/admin: `pending -> confirmed`, `pending -> declined`
- renter/admin: `pending -> cancelled`, `confirmed -> cancelled`
- admin-only: set `completed`

### 5) Check property availability

`GET /api/properties/:id/availability?startDate=2026-04-05&endDate=2026-04-12`

Response:

```json
{ "available": true }
```

## Property deletion safety

Property deletion is blocked for non-admin users if the property has future `pending` or `confirmed` reservations.

Conflict response:

- `409` `Cannot delete property with active or future reservations`
