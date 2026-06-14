package com.kallingal.repository;

import com.kallingal.domain.Entities.HomeVideo;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;

public interface HomeVideoRepo extends ReactiveCrudRepository<HomeVideo, Long> {
  Flux<HomeVideo> findByActiveTrueOrderBySortOrderAsc();
}
