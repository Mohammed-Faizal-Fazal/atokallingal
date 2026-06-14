package com.kallingal.repository;

import com.kallingal.domain.Entities.BrandItem;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;

public interface BrandItemRepo extends ReactiveCrudRepository<BrandItem, Long> {
  Flux<BrandItem> findByActiveTrueOrderBySortOrderAsc();
}
