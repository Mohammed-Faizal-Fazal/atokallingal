package com.kallingal.repository;

import com.kallingal.domain.Entities.ServicePanel;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;

public interface ServicePanelRepo extends ReactiveCrudRepository<ServicePanel, Long> {
  Flux<ServicePanel> findByActiveTrueOrderBySortOrderAsc();
}
