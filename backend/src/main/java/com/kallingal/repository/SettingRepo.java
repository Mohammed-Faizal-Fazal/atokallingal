package com.kallingal.repository;

import com.kallingal.domain.Entities.Setting;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Mono;

public interface SettingRepo extends ReactiveCrudRepository<Setting, Long> {
  Mono<Setting> findBySkey(String skey);
}
