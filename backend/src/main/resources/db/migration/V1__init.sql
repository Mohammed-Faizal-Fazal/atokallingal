CREATE TABLE showrooms (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  address VARCHAR(500) NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  phone VARCHAR(30),
  image_url VARCHAR(500)
);

CREATE TABLE gallery_images (
  id BIGSERIAL PRIMARY KEY,
  url VARCHAR(500) NOT NULL,
  caption VARCHAR(300),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE service_items (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT
);

CREATE TABLE job_openings (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  department VARCHAR(100),
  location VARCHAR(200),
  description TEXT,
  active BOOLEAN DEFAULT TRUE
);

CREATE TABLE job_applications (
  id BIGSERIAL PRIMARY KEY,
  job_id BIGINT REFERENCES job_openings(id),
  name VARCHAR(200) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  email VARCHAR(200) NOT NULL,
  resume_url VARCHAR(500),
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE leads (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  email VARCHAR(200),
  type VARCHAR(50) NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- seed
INSERT INTO service_items (title, category, description) VALUES
('Periodic maintenance', 'Automotive', 'Scheduled service with genuine parts at our Tata Authorized Service Center.'),
('Insurance renewal', 'Insurance', 'Hassle-free policy renewals with claims assistance.'),
('EV battery health check', 'Chetak EV', 'Complete diagnostic for your Chetak battery and motor.');

INSERT INTO job_openings (title, department, location, description, active) VALUES
('Sales executive', 'Sales', 'Pattom, Trivandrum', 'Front-line sales for Bajaj two wheelers. Two-wheeler license required.', TRUE),
('Service technician', 'Service', 'Karamana, Trivandrum', 'Trained technician for our authorized service center.', TRUE);
