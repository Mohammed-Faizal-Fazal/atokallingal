CREATE TABLE page_heroes (
  id BIGSERIAL PRIMARY KEY,
  page VARCHAR(80) UNIQUE NOT NULL,
  eyebrow VARCHAR(120) NOT NULL,
  title VARCHAR(240) NOT NULL,
  sub TEXT,
  image_url VARCHAR(500),
  video_url VARCHAR(500),
  chips TEXT
);

CREATE TABLE brand_items (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  sort_order INT DEFAULT 0,
  active BOOLEAN DEFAULT TRUE
);

CREATE TABLE product_categories (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  tag VARCHAR(120),
  accent VARCHAR(40),
  icon VARCHAR(40),
  image_url VARCHAR(500),
  description TEXT,
  specs TEXT,
  sort_order INT DEFAULT 0,
  active BOOLEAN DEFAULT TRUE
);

CREATE TABLE home_offers (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  tag VARCHAR(120),
  icon VARCHAR(40),
  text TEXT,
  image_url VARCHAR(500),
  link VARCHAR(120),
  sort_order INT DEFAULT 0,
  active BOOLEAN DEFAULT TRUE
);

CREATE TABLE home_highlights (
  id BIGSERIAL PRIMARY KEY,
  icon VARCHAR(40),
  value VARCHAR(160),
  label TEXT,
  sort_order INT DEFAULT 0,
  active BOOLEAN DEFAULT TRUE
);

CREATE TABLE home_videos (
  id BIGSERIAL PRIMARY KEY,
  youtube_id VARCHAR(80) NOT NULL,
  title VARCHAR(160) NOT NULL,
  tag VARCHAR(100),
  caption TEXT,
  sort_order INT DEFAULT 0,
  active BOOLEAN DEFAULT TRUE
);

CREATE TABLE service_panels (
  id BIGSERIAL PRIMARY KEY,
  eyebrow VARCHAR(120),
  title VARCHAR(180) NOT NULL,
  text TEXT,
  image_url VARCHAR(500),
  icon VARCHAR(40),
  cta_label VARCHAR(120),
  cta_link VARCHAR(120),
  theme VARCHAR(40),
  sort_order INT DEFAULT 0,
  active BOOLEAN DEFAULT TRUE
);

CREATE TABLE service_promises (
  id BIGSERIAL PRIMARY KEY,
  icon VARCHAR(40),
  label VARCHAR(160) NOT NULL,
  text TEXT,
  sort_order INT DEFAULT 0,
  active BOOLEAN DEFAULT TRUE
);

CREATE TABLE career_perks (
  id BIGSERIAL PRIMARY KEY,
  icon VARCHAR(40),
  label VARCHAR(160) NOT NULL,
  text TEXT,
  sort_order INT DEFAULT 0,
  active BOOLEAN DEFAULT TRUE
);

INSERT INTO page_heroes (page, eyebrow, title, sub, image_url, video_url, chips) VALUES
('home', 'Bajaj | Chetak | Tata Service', 'Kallingal|Moves', 'A sharper showroom experience for Bajaj riders, Chetak EV owners, commercial fleets, Tata service customers and insurance support.', 'assets/images/showroom-6.jpg', 'assets/video/kallingal-hero.mp4', 'Showroom network,Chetak EV,Tata Authorized Service,Insurance support'),
('products', 'Products', 'Built for every road.', 'Two wheelers, three wheelers and the all-electric Chetak. Explore the range, compare options, and ride home with confidence.', 'assets/images/showroom-3.jpg', NULL, 'Bajaj motorcycles,Commercial mobility,Chetak EV,Finance support'),
('services', 'Services', 'Care beyond the sale.', 'Authorized service, genuine parts and in-house insurance. Everything your vehicle needs, for life.', 'assets/images/showroom-8.jpg', NULL, 'Authorized service,Genuine parts,Insurance desk,Claims support'),
('gallery', 'Gallery', 'Our story in frames.', 'Showrooms, milestones and the people behind the Kallingal name. Tap any image to view fullscreen.', 'assets/images/showroom-10.jpg', NULL, 'Showrooms,Deliveries,Service floors,Milestones'),
('showrooms', 'Showroom directory', 'Find your nearest Kallingal showroom.', 'Pick a showroom, see it on the map, and get directions in one tap.', 'assets/images/showroom-6.jpg', NULL, 'Live locations,One-tap directions,Call support,WhatsApp routing'),
('careers', 'Careers', 'Drive your career forward.', 'Join the team behind Trivandrum''s trusted automotive name.', 'assets/images/showroom-11.jpg', NULL, 'Sales teams,Service roles,Operations,Brand training'),
('contact', 'Contact', 'Talk to the right team.', 'Sales, service or insurance. Your enquiry goes straight to the people who can act on it.', 'assets/images/showroom-13.jpg', NULL, 'Sales enquiry,Service booking,Insurance help,Fast WhatsApp reply');

INSERT INTO brand_items (name, sort_order) VALUES
('Bajaj', 1), ('Chetak', 2), ('Tata', 3), ('Bajaj Allianz', 4), ('Bajaj Finserv', 5),
('Pulsar', 6), ('Platina', 7), ('Dominar', 8), ('Avenger', 9), ('RE', 10), ('Maxima', 11);

INSERT INTO product_categories (name, tag, accent, icon, image_url, description, specs, sort_order) VALUES
('Two wheelers', 'Bajaj', '#1a5cb0', 'bike', 'assets/images/showroom-3.jpg', 'Pulsar, Platina, CT and more. The complete Bajaj motorcycle lineup with finance, exchange and same-day delivery.', 'Full Bajaj range,On-spot finance,Exchange offers,Accessories studio', 1),
('Three wheelers', 'Bajaj commercial', '#4c9622', 'store', 'assets/images/showroom-6.jpg', 'RE and Maxima passenger and cargo autos engineered for Kerala roads and built to earn.', 'Petrol,CNG,Diesel,Commercial finance', 2),
('Chetak EV', 'All electric', '#0e8f98', 'zap', 'assets/images/showroom-1.jpg', 'The legend returns electric with premium build, smart connectivity and a ride that is whisper quiet.', '127 km range,Metal body,IP67,Home charging', 3);

INSERT INTO home_offers (title, tag, icon, text, image_url, link, sort_order) VALUES
('Buy your next vehicle', 'Showroom', 'bike', 'Bajaj two wheelers, three wheelers and Chetak EV discovery with quick enquiry and showroom routing.', 'assets/images/showroom-3.jpg', '/products', 1),
('Service without confusion', 'Workshop', 'service', 'Service pages, contact actions and location flow make it easier to move from website visit to workshop visit.', 'assets/images/showroom-8.jpg', '/services', 2),
('Insurance support', 'Protection', 'shield', 'Claims, renewals and policy enquiries stay visible as part of the same Kallingal ownership ecosystem.', 'assets/images/showroom-9.jpg', '/services', 3);

INSERT INTO home_highlights (icon, value, label, sort_order) VALUES
('bike', 'Bajaj + Chetak', 'Two wheelers, electric mobility and commercial three wheelers under one retail network.', 1),
('service', 'Tata ASC', 'Authorized service support with trained technicians, genuine parts and clear follow-up.', 2),
('shield', 'Insurance', 'Policies, renewals and claims assistance connected to the same customer journey.', 3);

INSERT INTO home_videos (youtube_id, title, tag, caption, sort_order) VALUES
('QDW6rcfboCk', 'Two Wheelers', 'Bajaj', 'Discover the showroom range and the daily mobility line-up customers come for.', 1),
('6MivFlIy67A', 'Three Wheelers', 'Commercial', 'Commercial mobility for businesses that need dependable day-to-day earning machines.', 2),
('jzgNZXHIu8U', 'Tata Authorized Service', 'Service', 'Service support positioned as a serious ownership experience, not an afterthought.', 3),
('pJxHgU2H4MI', 'Chetak EV', 'Electric', 'The electric side of the network, framed for modern city riders.', 4);

INSERT INTO service_panels (eyebrow, title, text, image_url, icon, cta_label, cta_link, theme, sort_order) VALUES
('Workshop', 'Exceptional automotive service', 'Factory-trained technicians, genuine parts and transparent estimates for every visit.', 'assets/images/showroom-8.jpg', 'wrench', 'Schedule service', '/contact', 'blue', 1),
('Insurance', 'Reliable ownership support', 'New policies, renewals and claims assistance handled in-house from start to finish.', 'assets/images/showroom-9.jpg', 'shield', 'Get a quote', '/contact', 'teal', 2);

INSERT INTO service_promises (icon, label, text, sort_order) VALUES
('clock', 'Same-day turnaround', 'Most periodic services completed the same day with live status updates.', 1),
('badge', 'Genuine parts only', 'Authorized parts and fluids, fully covered under manufacturer warranty.', 2),
('support', 'Lifetime support', 'One team for service, insurance and claims for as long as you ride.', 3);

INSERT INTO career_perks (icon, label, text, sort_order) VALUES
('growth', 'Real growth', 'Clear paths from showroom floor to management across the Kallingal network.', 1),
('team', 'Strong team', 'Work alongside people who built the trusted Kallingal name.', 2),
('learn', 'Brand training', 'Factory-backed Bajaj, Chetak and Tata product and service training.', 3),
('care', 'People first', 'Stable, respectful workplace with benefits and genuine support.', 4);

INSERT INTO site_settings (skey, svalue) VALUES
('lead_types', 'Sales,Service,Insurance')
ON CONFLICT (skey) DO NOTHING;
