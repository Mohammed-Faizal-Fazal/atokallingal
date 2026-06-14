-- Seed the showroom directory so the public site and admin both reflect real data
-- (previously the showrooms table was empty; the public page only showed hardcoded fallbacks).
INSERT INTO showrooms (name, address, lat, lng, phone, image_url) VALUES
('Kallingal Chetak - Pattom',      'Pattom, Trivandrum, Kerala 695004',   8.5241, 76.9366, '+914710000001', 'assets/images/showroom-1.jpg'),
('Kallingal Bajaj - Karamana',     'Karamana, Trivandrum, Kerala 695002', 8.4855, 76.9610, '+914710000002', 'assets/images/showroom-3.jpg'),
('Kallingal Commercial - Attingal', 'Attingal, Trivandrum, Kerala 695101', 8.6960, 76.8144, '+914710000003', 'assets/images/showroom-6.jpg');
