-- About page content: a hero, the legacy timeline, and the partner brands grid.

-- 1) Hero for /api/page-heroes/about (mirrors the V6 page_heroes seeds).
INSERT INTO page_heroes (page, eyebrow, title, sub, image_url, video_url, chips) VALUES
('about', 'About us', 'Kallingal|Group',
 'Established 1985 - a prominent Bajaj dealer in Kerala, specialising in Bajaj two & three wheelers, Chetak EV and authorised Tata service, strengthened by experience and family values.',
 'assets/images/showroom-9.webp', NULL, 'Our story,Legacy timeline,Brands we carry,Where to find us');

-- 2) Legacy timeline. List-shaped content, editable from the admin Site Content tab.
CREATE TABLE about_milestones (
  id BIGSERIAL PRIMARY KEY,
  year_label VARCHAR(40),
  title VARCHAR(200) NOT NULL,
  body TEXT,
  sort_order INT DEFAULT 0,
  active BOOLEAN DEFAULT TRUE
);

INSERT INTO about_milestones (year_label, title, body, sort_order) VALUES
('1985', 'Visionary beginning', 'Founded under the visionary guidance of the late Mr. A.M. Basheer - built on trust, hard work and family values.', 1),
('1992', 'Humble start', 'Started in 1992 as an Authorised Service Centre (ASC) for Bajaj.', 2),
('', 'Multi-brand expertise', 'Offering Bajaj two-wheelers, three-wheelers and Tata vehicles under one trusted name.', 3),
('', 'Growth & expansion', 'From a modest service centre to a leading automobile group in Thiruvananthapuram.', 4),
('', 'Strong presence', 'Now operating 19 showrooms and service centres across the district.', 5),
('', 'Commitment to customers', 'Dedicated to delivering unmatched service, support and ownership experience.', 6),
('', '25+ years of excellence', 'Celebrating over 25 years of trusted service and genuine customer care.', 7);

-- 3) Partner brands for the "We offer products and services of" grid. Kept in their
-- OWN table so the curated home-page brand reel (brand_items) is left untouched.
-- Editable from the admin Site Content tab.
CREATE TABLE about_brands (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  sort_order INT DEFAULT 0,
  active BOOLEAN DEFAULT TRUE
);

INSERT INTO about_brands (name, sort_order) VALUES
('Tata', 1), ('Chetak', 2), ('Bajaj', 3), ('JK Tyre', 4), ('Motul', 5),
('Relstar', 6), ('SKF', 7), ('Hella', 8), ('Endurance', 9), ('Motherson', 10),
('Wurth', 11), ('Glosil', 12), ('UCAL', 13), ('HL Mando', 14), ('Anand', 15),
('SAI', 16), ('ACEY', 17), ('Loctite', 18), ('ISK', 19), ('ARRO', 20),
('RMP Bearings', 21), ('Aerostar Helmets', 22), ('Napino', 23), ('DID', 24), ('IFB', 25),
('ARB Bearings', 26), ('Sankar NP', 27), ('Advik', 28), ('PIX', 29);
