CREATE TABLE site_settings (
  id BIGSERIAL PRIMARY KEY,
  skey VARCHAR(100) UNIQUE NOT NULL,
  svalue VARCHAR(500) NOT NULL
);

INSERT INTO site_settings (skey, svalue) VALUES
('whatsapp_number', '917907789521'),
('phone_number', '+917907789521'),
('contact_email', 'faizalfazal56@gmail.com'),
('head_office', 'Kallingal Group, Trivandrum');
