package com.kallingal.repository;

import com.kallingal.domain.Entities.Lead;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;

public interface LeadRepo extends ReactiveCrudRepository<Lead, Long> {}
