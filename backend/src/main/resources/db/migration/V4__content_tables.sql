-- ============================================================
-- Production content: testimonials, FAQs, and the missing
-- gallery seed (gallery_images was never populated before, so
-- the public gallery only showed hardcoded fallbacks).
-- ============================================================

CREATE TABLE testimonials (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  role VARCHAR(200),
  quote TEXT NOT NULL,
  rating INT DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE faqs (
  id BIGSERIAL PRIMARY KEY,
  question VARCHAR(400) NOT NULL,
  answer TEXT NOT NULL,
  sort_order INT DEFAULT 0
);

INSERT INTO testimonials (name, role, quote, rating) VALUES
('Rahul Menon', 'Pulsar owner · Trivandrum', 'Smooth buying experience from test ride to delivery. The team handled finance and registration without me running around. Genuinely the easiest showroom I have dealt with.', 5),
('Anjali Nair', 'Chetak EV rider', 'Switched to the Chetak and never looked back. Charging guidance, service reminders and quick WhatsApp replies make ownership effortless.', 5),
('Saji Thomas', 'Fleet operator · RE autos', 'I run six autos and Kallingal keeps them all on the road. Same-day service and honest estimates — that is why I keep coming back.', 5),
('Fathima Beevi', 'First-time buyer', 'The staff explained every option patiently and never pushed. I rode home the same day on my new Platina with full confidence.', 5),
('Vishnu Prasad', 'Service customer', 'Booked a service on WhatsApp, dropped the bike in the morning, picked it up by evening. Transparent bill, genuine parts. Highly recommend.', 5);

INSERT INTO faqs (question, answer, sort_order) VALUES
('Do you offer finance and exchange?', 'Yes. We arrange on-spot finance with multiple lenders and give competitive exchange value on your existing vehicle, handled entirely in-showroom.', 1),
('Can I book a test ride online?', 'Absolutely. Use the Book a test drive button or message us on WhatsApp, pick your nearest showroom, and we will keep the vehicle ready.', 2),
('Is the Chetak EV serviced locally?', 'Yes. Our authorized centers handle Chetak battery, motor and software checks with trained EV technicians and genuine parts.', 3),
('Do you handle insurance and renewals?', 'We process new policies, renewals and claims in-house, so your purchase, service and insurance all live with one trusted team.', 4),
('How many showrooms do you have?', 'We operate 19 showrooms and service points across Trivandrum, so there is always a Kallingal counter close to you.', 5);

-- Seed the gallery so the public Gallery page and admin reflect real data.
INSERT INTO gallery_images (url, caption) VALUES
('assets/images/showroom-1.jpg',  'Chetak EV showroom'),
('assets/images/showroom-2.jpg',  'Kallingal Chetak experience center'),
('assets/images/showroom-3.jpg',  'Bajaj two wheeler display'),
('assets/images/showroom-4.jpg',  'New arrivals on the showroom floor'),
('assets/images/showroom-5.jpg',  'Customer delivery bay'),
('assets/images/showroom-6.jpg',  'Bajaj commercial three wheelers'),
('assets/images/showroom-7.jpg',  'RE auto fleet ready for delivery'),
('assets/images/showroom-8.jpg',  'Service reception'),
('assets/images/showroom-9.jpg',  'Kallingal showroom facade'),
('assets/images/showroom-10.jpg', 'Chetak showroom exterior'),
('assets/images/showroom-11.jpg', 'Display floor'),
('assets/images/showroom-12.jpg', 'Three wheeler delivery line');
