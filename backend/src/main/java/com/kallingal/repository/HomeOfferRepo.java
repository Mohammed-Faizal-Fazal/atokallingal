package com.kallingal.repository;

import com.kallingal.domain.Entities.HomeOffer;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;

public interface HomeOfferRepo extends ReactiveCrudRepository<HomeOffer, Long> {
  Flux<HomeOffer> findByActiveTrueOrderBySortOrderAsc();
}
