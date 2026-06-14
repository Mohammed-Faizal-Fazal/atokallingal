package com.kallingal.repository;

import com.kallingal.domain.Entities.CareerPerk;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;

public interface CareerPerkRepo extends ReactiveCrudRepository<CareerPerk, Long> {
  Flux<CareerPerk> findByActiveTrueOrderBySortOrderAsc();
}
