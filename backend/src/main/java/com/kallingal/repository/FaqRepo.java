package com.kallingal.repository;

import com.kallingal.domain.Entities.Faq;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;

public interface FaqRepo extends ReactiveCrudRepository<Faq, Long> {
  Flux<Faq> findAllByOrderBySortOrderAsc();
}
