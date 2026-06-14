package com.kallingal.repository;

import com.kallingal.domain.Entities.Testimonial;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;

public interface TestimonialRepo extends ReactiveCrudRepository<Testimonial, Long> {}
