package com.kallingal.cache;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Supplier;

@Component
public class ContentCache {
  private final Cache<String, Object> cache;

  public ContentCache(
      @Value("${app.cache.maximum-size:500}") long maximumSize,
      @Value("${app.cache.ttl-seconds:300}") long ttlSeconds) {
    this.cache = Caffeine.newBuilder()
      .maximumSize(maximumSize)
      .expireAfterWrite(Duration.ofSeconds(ttlSeconds))
      .recordStats()
      .build();
  }

  public <T> Mono<T> mono(String key, Class<T> type, Supplier<Mono<T>> source) {
    Object cached = cache.getIfPresent(key);
    if (type.isInstance(cached)) return Mono.just(type.cast(cached));
    return source.get().doOnNext(value -> cache.put(key, value));
  }

  public <T> Flux<T> flux(String key, Class<T> type, Supplier<Flux<T>> source) {
    Object cached = cache.getIfPresent(key);
    if (cached instanceof List<?> list) return Flux.fromIterable(list).cast(type);
    return source.get()
      .collectList()
      .doOnNext(list -> cache.put(key, List.copyOf(list)))
      .flatMapMany(Flux::fromIterable);
  }

  public void clearAll() {
    cache.invalidateAll();
  }

  public Map<String, Object> info() {
    List<String> keys = new ArrayList<>(cache.asMap().keySet());
    keys.sort(Comparator.naturalOrder());
    Map<String, Object> info = new LinkedHashMap<>();
    info.put("entries", cache.estimatedSize());
    info.put("keys", keys);
    info.put("stats", cache.stats().toString());
    return info;
  }
}
