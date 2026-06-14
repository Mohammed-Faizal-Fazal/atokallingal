package com.kallingal.repository;

import com.kallingal.domain.Entities.ServiceItem;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;

public interface ServiceRepo extends ReactiveCrudRepository<ServiceItem, Long> {}
