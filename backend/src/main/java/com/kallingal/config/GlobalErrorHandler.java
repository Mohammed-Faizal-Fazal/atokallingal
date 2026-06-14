package com.kallingal.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.ServerWebInputException;
import org.springframework.web.server.WebExceptionHandler;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;

/**
 * Single place that turns uncaught errors into clean JSON responses with the
 * right status, instead of the default opaque 500. Registered ahead of Spring's
 * DefaultErrorWebExceptionHandler (order -1) so it wins. Notably maps:
 *  - bad numeric path id (NumberFormatException)        -> 400
 *  - malformed/empty body (ServerWebInputException)     -> 400
 *  - DB constraint failures (DataIntegrityViolation:
 *      NOT NULL / too-long / FK / unique)               -> 400
 *  - explicit ResponseStatusException                   -> its own status
 *  - anything else                                      -> 500 (and logged)
 */
@Component
@Order(-2)
public class GlobalErrorHandler implements WebExceptionHandler {

  private static final Logger log = LoggerFactory.getLogger(GlobalErrorHandler.class);

  @Override
  public Mono<Void> handle(ServerWebExchange exchange, Throwable ex) {
    if (exchange.getResponse().isCommitted()) {
      return Mono.error(ex);
    }
    HttpStatus status = statusFor(ex);
    if (status.is5xxServerError()) {
      log.error("Unhandled server error on {} {}", exchange.getRequest().getMethod(), exchange.getRequest().getPath(), ex);
    }
    exchange.getResponse().setStatusCode(status);
    exchange.getResponse().getHeaders().setContentType(MediaType.APPLICATION_JSON);
    byte[] body = ("{\"status\":" + status.value() + ",\"error\":\"" + status.getReasonPhrase() + "\"}")
        .getBytes(StandardCharsets.UTF_8);
    DataBuffer buffer = exchange.getResponse().bufferFactory().wrap(body);
    return exchange.getResponse().writeWith(Mono.just(buffer));
  }

  private HttpStatus statusFor(Throwable ex) {
    if (ex instanceof ResponseStatusException rse) {
      HttpStatus resolved = HttpStatus.resolve(rse.getStatusCode().value());
      return resolved != null ? resolved : HttpStatus.INTERNAL_SERVER_ERROR;
    }
    if (ex instanceof ServerWebInputException) return HttpStatus.BAD_REQUEST;
    if (ex instanceof NumberFormatException) return HttpStatus.BAD_REQUEST;
    if (ex instanceof IllegalArgumentException) return HttpStatus.BAD_REQUEST;
    if (ex instanceof DataIntegrityViolationException) return HttpStatus.BAD_REQUEST;
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
