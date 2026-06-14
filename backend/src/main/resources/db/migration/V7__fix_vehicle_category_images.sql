-- Point each vehicle category at a correct, real Kallingal photo.
--   Two wheelers -> Bajaj motorcycles (Pulsar / Dominar lineup)
--   Chetak EV    -> Chetak electric scooters at the showroom front
--   Three wheelers -> Bajaj RE auto-rickshaw (sourced from Wikimedia Commons,
--     CC BY-SA 4.0; swap for an official Bajaj/own photo when available).
UPDATE product_categories SET image_url = 'assets/images/IMG_2796.jpg' WHERE name = 'Two wheelers';
UPDATE product_categories SET image_url = 'assets/images/IMG_2789.jpg' WHERE name = 'Chetak EV';
UPDATE product_categories SET image_url = 'assets/images/bajaj-re-3w.jpg' WHERE name = 'Three wheelers';
