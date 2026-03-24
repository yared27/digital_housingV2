# Property API

Chapter 3 MVP property management for `digital_housingV2`.

## Auth

- Protected routes use the existing HttpOnly cookie auth strategy.
- Send requests with `credentials: include` from the browser, or include the cookies in Postman/curl.

## Property shape

```json
{
  "title": "Modern Studio Near Town",
  "description": "Well-finished studio apartment with reliable water and power.",
  "village": "Bweyogerere",
  "address": {
    "street": "Plot 14 Market Street",
    "city": "Kampala",
    "state": "Central",
    "zipCode": "256",
    "coordinates": {
      "type": "Point",
      "coordinates": [32.6475, 0.3476]
    }
  },
  "price": {
    "amount": 450,
    "period": "monthly"
  },
  "propertyType": "studio",
  "amenities": ["wifi", "parking", "security"],
  "propertyImages": [
    "https://res.cloudinary.com/demo/image/upload/v1/properties/sample-1.jpg"
  ],
  "isAvailable": true
}
```

## Endpoints

### Create property

`POST /api/properties`

Requires authenticated user with `owner` or `admin` role.

Sample curl:

```bash
curl -X POST http://localhost:5000/api/properties \
  -H "Content-Type: application/json" \
  -b cookie.txt -c cookie.txt \
  -d '{
    "title": "Modern Studio Near Town",
    "description": "Well-finished studio apartment with reliable water and power.",
    "village": "Bweyogerere",
    "address": {
      "street": "Plot 14 Market Street",
      "city": "Kampala",
      "state": "Central",
      "zipCode": "256"
    },
    "price": { "amount": 450, "period": "monthly" },
    "propertyType": "studio",
    "amenities": ["wifi", "parking"],
    "propertyImages": []
  }'
```

### List properties

`GET /api/properties`

Supported query params:

- `village`
- `city`
- `state`
- `propertyType`
- `minPrice`
- `maxPrice`
- `amenities` (comma-separated or repeated)
- `isAvailable`
- `ownerId`
- `sortBy=newest|price_asc|price_desc`
- `page`
- `limit`

Sample:

```bash
curl "http://localhost:5000/api/properties?village=Bweyogerere&city=Kampala&minPrice=200&maxPrice=800&amenities=wifi,parking&sortBy=price_asc&page=1&limit=10"
```

Response shape:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 1
  }
}
```

### Get property by id

`GET /api/properties/:id`

### Update property

`PUT /api/properties/:id`

Requires authenticated property owner or admin.

### Delete property

`DELETE /api/properties/:id`

Requires authenticated property owner or admin.
Returns `204 No Content`.

### Append property images

`POST /api/properties/:id/images`

Requires authenticated property owner or admin.

Request body:

```json
{
  "propertyImages": [
    "https://res.cloudinary.com/demo/image/upload/v1/properties/sample-2.jpg"
  ]
}
```

## Cloudinary image upload flow

1. Authenticate as an owner.
2. Call `POST /api/uploads/sign` with a body like:

```json
{
  "folder": "properties",
  "filename": "front-view"
}
```

3. Upload the file directly to Cloudinary using the returned `signature`, `timestamp`, `folder`, and `public_id`.
4. Take Cloudinary's `secure_url` from the upload response.
5. Send that `secure_url` in `propertyImages` during property create/update or to `POST /api/properties/:id/images`.

## Postman quick test flow

1. Sign in as owner.
2. Create property.
3. Copy the returned property `_id`.
4. Update and append images.
5. Test a second user on the same property and confirm `403` on update/delete.
