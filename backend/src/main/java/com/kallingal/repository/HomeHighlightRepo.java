package com.kallingal.repository;

import com.kallingal.domain.Entities.HomeHighlight;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;

public interface HomeHighlightRepo extends ReactiveCrudRepository<HomeHighlight, Long> {
  Flux<HomeHighlight> findByActiveTrueOrderBySortOrderAsc();
}
