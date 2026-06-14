INSERT INTO site_settings (skey, svalue) VALUES
('stat_happy_riders', '100000'),
('stat_years_trust', '50')
ON CONFLICT (skey) DO NOTHING;
