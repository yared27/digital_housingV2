# UI Homepage and Public Experience

## Implemented Sections

The homepage now includes:

- Sticky site header with navigation and auth-aware actions
- Hero section with primary and secondary CTA buttons
- Trust strip with platform capability highlights
- Feature grid explaining key workflows
- Three-step how-it-works section
- Featured properties section populated from live API data
- Testimonial section with neutral placeholder quotes
- Final call-to-action block
- Shared footer

Additional public pages:

- `/properties` polished public listing page
- `/about` company summary page
- `/contact` support/contact page
- `/not-found` custom 404 page

## Featured Properties Data Loading

Homepage featured properties use RTK Query:

- Endpoint: `GET /api/properties`
- Query params used: `sortBy=newest`, `limit=6`, `page=1`

Fallback behavior:

- Loading state: skeleton cards
- Error state: retry empty state with action button
- Empty state: no-featured-properties message

## Branding and Color Customization

To customize branding:

1. Update header logo text and mark in `src/components/common/SiteHeader.tsx`.
2. Update primary brand color classes (currently slate-based) across:
   - `src/components/common/SiteHeader.tsx`
   - `src/components/marketing/Hero.tsx`
   - `src/components/marketing/CTASection.tsx`
3. Adjust global background/foreground defaults in `src/app/globals.css`.
4. Update footer links and contact labels in `src/components/common/SiteFooter.tsx`.

All sections use shared spacing containers through `src/components/common/PageSection.tsx` for consistency.
