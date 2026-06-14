package com.kallingal.repository;

import com.kallingal.domain.Entities.Showroom;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;

public interface ShowroomRepo extends ReactiveCrudRepository<Showroom, Long> {}
