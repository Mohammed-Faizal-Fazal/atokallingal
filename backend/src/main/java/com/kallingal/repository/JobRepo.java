package com.kallingal.repository;

import com.kallingal.domain.Entities.JobOpening;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;

public interface JobRepo extends ReactiveCrudRepository<JobOpening, Long> {
  Flux<JobOpening> findByActiveTrue();
}
