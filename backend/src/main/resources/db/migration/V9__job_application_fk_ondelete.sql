-- Previously job_applications.job_id REFERENCES job_openings(id) with the
-- implicit ON DELETE NO ACTION, so deleting a job that had received any
-- application failed with a foreign-key violation (surfaced as HTTP 500) and the
-- job became permanently undeletable. Keep the application records but null out
-- their job reference when the parent job is deleted.
ALTER TABLE job_applications DROP CONSTRAINT IF EXISTS job_applications_job_id_fkey;
ALTER TABLE job_applications
  ADD CONSTRAINT job_applications_job_id_fkey
  FOREIGN KEY (job_id) REFERENCES job_openings(id) ON DELETE SET NULL;
