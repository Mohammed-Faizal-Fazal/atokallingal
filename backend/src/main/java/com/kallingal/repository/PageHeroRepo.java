package com.kallingal.repository;

import com.kallingal.domain.Entities.PageHero;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Mono;

public interface PageHeroRepo extends ReactiveCrudRepository<PageHero, Long> {
  Mono<PageHero> findByPage(String page);
}
