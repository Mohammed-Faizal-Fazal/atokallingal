-- Store the applicant's uploaded CV directly in the row as Postgres BYTEA. This
-- survives container redeploys via the existing pgdata volume (no separate object
-- store or mounted file volume to configure on Coolify), and stays transactional
-- with the application. Resumes are small (the UI caps uploads at 5 MB).
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS resume_filename     VARCHAR(255);
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS resume_content_type VARCHAR(120);
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS resume_data         BYTEA;
