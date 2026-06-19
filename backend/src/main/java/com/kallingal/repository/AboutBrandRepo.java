package com.kallingal.repository;

import com.kallingal.domain.Entities.AboutBrand;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;

public interface AboutBrandRepo extends ReactiveCrudRepository<AboutBrand, Long> {
  Flux<AboutBrand> findByActiveTrueOrderBySortOrderAsc();
}
