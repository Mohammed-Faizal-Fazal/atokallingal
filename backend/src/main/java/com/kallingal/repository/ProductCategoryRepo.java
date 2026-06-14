package com.kallingal.repository;

import com.kallingal.domain.Entities.ProductCategory;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;

public interface ProductCategoryRepo extends ReactiveCrudRepository<ProductCategory, Long> {
  Flux<ProductCategory> findByActiveTrueOrderBySortOrderAsc();
}
