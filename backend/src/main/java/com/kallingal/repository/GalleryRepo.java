package com.kallingal.repository;

import com.kallingal.domain.Entities.GalleryImage;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;

public interface GalleryRepo extends ReactiveCrudRepository<GalleryImage, Long> {}
