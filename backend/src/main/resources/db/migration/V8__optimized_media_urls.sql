-- Move existing seeded/public content to optimized local media.
-- Admin can still override these URLs later with CDN-hosted URLs.

UPDATE showrooms
SET image_url = replace(image_url, '.jpg', '.webp')
WHERE image_url LIKE 'assets/images/%.jpg';

UPDATE gallery_images
SET url = replace(url, '.jpg', '.webp')
WHERE url LIKE 'assets/images/%.jpg';

UPDATE page_heroes
SET image_url = replace(image_url, '.jpg', '.webp')
WHERE image_url LIKE 'assets/images/%.jpg';

UPDATE page_heroes
SET video_url = 'assets/video/kallingal-hero-lite.mp4'
WHERE page = 'home'
  AND video_url = 'assets/video/kallingal-hero.mp4';

UPDATE product_categories
SET image_url = replace(image_url, '.jpg', '.webp')
WHERE image_url LIKE 'assets/images/%.jpg';

UPDATE home_offers
SET image_url = replace(image_url, '.jpg', '.webp')
WHERE image_url LIKE 'assets/images/%.jpg';

UPDATE service_panels
SET image_url = replace(image_url, '.jpg', '.webp')
WHERE image_url LIKE 'assets/images/%.jpg';
