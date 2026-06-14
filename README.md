# Kallingal Group — Full Stack

Angular 19 + Tailwind + GSAP frontend, Spring WebFlux + R2DBC backend, PostgreSQL.

## Structure
```
frontend/   Angular 19, Tailwind, GSAP (preloader, scroll hero, pinned showcase)
backend/    Spring Boot 3.4 WebFlux, R2DBC Postgres, Flyway, functional routes
```

## Local dev
```bash
# DB only
docker compose up db -d

# Backend (needs Java 21)
cd backend && ./mvnw spring-boot:run

# Frontend (needs Node 22)
cd frontend && npm install && npm start   # http://localhost:4200, /api proxied to :8080
```

Or full stack: `docker compose up --build` → http://localhost

## API
Public:  GET /api/showrooms /api/gallery /api/services /api/jobs · POST /api/leads /api/applications
Admin (basic auth): POST/DELETE /api/admin/{showrooms,gallery,services,jobs} · GET /api/admin/{leads,applications}

Admin credentials via env: ADMIN_USERNAME / ADMIN_PASSWORD.

## Deploy on Coolify (Oracle Cloud) — single Docker Compose resource
The whole stack (db + backend + frontend) ships as one `docker-compose.yml`; the
services find each other by name (db, backend) so nothing extra needs wiring.

1. Push this repo to GitLab/GitHub.
2. Open the firewall in TWO places (both required on Oracle Cloud):
   - OCI Console → VCN → Security List/NSG: Ingress TCP 80 + 443 from 0.0.0.0/0.
   - The VM's own firewall (Ubuntu images REJECT 80/443 by default):
       sudo iptables -I INPUT 6 -p tcp --dport 80  -j ACCEPT
       sudo iptables -I INPUT 6 -p tcp --dport 443 -j ACCEPT
       sudo netfilter-persistent save
3. Coolify → New Resource → Docker Compose (from this repo). Compose path: `/docker-compose.yml`.
4. Set environment variables on the resource:
       SPRING_R2DBC_PASSWORD=<db password>
       ADMIN_PASSWORD=<admin password>
       CORS_ORIGINS=https://yourdomain.in
   (Defaults exist for local use; override them here.)
5. Assign your domain to the `frontend` service (Coolify/Traefik routes it to port 80).
   The frontend's nginx reverse-proxies /api/ to `backend:8080` internally, so the
   API is same-origin — no separate API domain or CORS round-trip needed.

## Brand tokens
kteal #19b3bd · kblue #1a5cb0 · kgreen #62b830 — from Chetak/Bajaj showroom photography (assets/images).
