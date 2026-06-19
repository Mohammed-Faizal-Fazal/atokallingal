-- Optional per-brand logo for the About-page "products & services of" grid.
-- When set, the grid renders this image; otherwise the frontend falls back to
-- the convention path assets/brand/logos/<slug>.png (e.g. jk-tyre.png) and, if
-- that file is absent too, to the brand wordmark. The column can hold a local
-- asset path or any external URL the admin pastes in.
ALTER TABLE about_brands ADD COLUMN IF NOT EXISTS logo_url VARCHAR(500);
