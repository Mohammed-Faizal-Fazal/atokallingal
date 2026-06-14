package com.kallingal.repository;

import com.kallingal.domain.Entities.ServicePromise;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;

public interface ServicePromiseRepo extends ReactiveCrudRepository<ServicePromise, Long> {
  Flux<ServicePromise> findByActiveTrueOrderBySortOrderAsc();
}
