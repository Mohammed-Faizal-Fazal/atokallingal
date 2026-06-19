package com.kallingal.repository;

import com.kallingal.domain.Entities.AboutMilestone;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;

public interface AboutMilestoneRepo extends ReactiveCrudRepository<AboutMilestone, Long> {
  Flux<AboutMilestone> findByActiveTrueOrderBySortOrderAsc();
}
