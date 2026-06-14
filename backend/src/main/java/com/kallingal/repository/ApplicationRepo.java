package com.kallingal.repository;

import com.kallingal.domain.Entities.JobApplication;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;

public interface ApplicationRepo extends ReactiveCrudRepository<JobApplication, Long> {}
