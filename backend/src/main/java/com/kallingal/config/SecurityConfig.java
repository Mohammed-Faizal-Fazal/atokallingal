package com.kallingal.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.core.userdetails.MapReactiveUserDetailsService;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

  @Bean
  public SecurityWebFilterChain chain(ServerHttpSecurity http) {
    return http
      .csrf(ServerHttpSecurity.CsrfSpec::disable)
      .cors(c -> {})
      .authorizeExchange(ex -> ex
        .pathMatchers("/api/admin/**").authenticated()
        .anyExchange().permitAll())
      .httpBasic(b -> {})
      .build();
  }

  @Bean
  public MapReactiveUserDetailsService users(
      @Value("${app.admin.username:admin}") String username,
      @Value("${app.admin.password:}") String password,
      PasswordEncoder encoder) {
    // Fail fast instead of silently shipping a publicly-known default credential:
    // /api/admin/** (leads/applications PII, all CMS, settings) hangs off this user.
    if (password == null || password.isBlank() || password.equals("change-me-in-coolify")) {
      throw new IllegalStateException(
        "ADMIN_PASSWORD must be set to a strong, non-default value before startup.");
    }
    return new MapReactiveUserDetailsService(
      User.withUsername(username).password(encoder.encode(password)).roles("ADMIN").build());
  }

  @Bean public PasswordEncoder encoder() { return new BCryptPasswordEncoder(); }

  @Bean
  public CorsConfigurationSource corsConfigurationSource(
      @Value("${app.cors.origins:http://localhost:4200}") String origins) {
    CorsConfiguration cfg = new CorsConfiguration();
    cfg.setAllowedOrigins(List.of(origins.split(",")));
    cfg.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));
    cfg.setAllowedHeaders(List.of("*"));
    UrlBasedCorsConfigurationSource src = new UrlBasedCorsConfigurationSource();
    src.registerCorsConfiguration("/api/**", cfg);
    return src;
  }
}
