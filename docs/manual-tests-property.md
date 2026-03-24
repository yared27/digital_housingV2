# Manual Property Tests

## Preconditions

- Server is running.
- MongoDB is connected.
- You have at least:
  - one `owner` user
  - one different authenticated user
  - optionally one `admin`

## Checklist

### 1. Create property as owner

- Sign in as an owner.
- Call `POST /api/properties` with a valid payload.
- Expect `201` and a response body containing `data` with `ownerId` set to the signed-in user.

### 2. List with filters

- Call `GET /api/properties` using combinations of:
  - `village`
  - `city`
  - `state`
  - `propertyType`
  - `minPrice` / `maxPrice`
  - `amenities`
  - `sortBy`
  - `page` / `limit`
- Expect `200` and a `meta` object with `page`, `limit`, `total`, and `totalPages`.

### 3. Get property by id

- Call `GET /api/properties/:id` with a real id.
- Expect `200`.
- Call with an invalid id.
- Expect `400`.
- Call with a valid but missing id.
- Expect `404`.

### 4. Update as owner

- Sign in as the property owner.
- Call `PUT /api/properties/:id` with a partial update.
- Expect `200` and updated data.

### 5. Fail update as different user

- Sign in as a different non-admin user.
- Call `PUT /api/properties/:id`.
- Expect `403`.

### 6. Append images

- Upload image(s) to Cloudinary using `POST /api/uploads/sign`.
- Call `POST /api/properties/:id/images` with resulting `secure_url` values.
- Expect `200`.
- Try to exceed 10 total images.
- Expect `400`.

### 7. Delete property

- Sign in as owner or admin.
- Call `DELETE /api/properties/:id`.
- Expect `204`.
- Fetch the same id again.
- Expect `404`.

### 8. Pagination and sorting

- Seed multiple properties with different prices and timestamps.
- Check:
  - `sortBy=newest`
  - `sortBy=price_asc`
  - `sortBy=price_desc`
- Verify page boundaries with `page` and `limit`.
