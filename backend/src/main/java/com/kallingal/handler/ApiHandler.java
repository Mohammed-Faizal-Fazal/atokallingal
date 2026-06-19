package com.kallingal.handler;

import com.kallingal.cache.ContentCache;
import com.kallingal.domain.Entities.*;
import com.kallingal.repository.ShowroomRepo;
import com.kallingal.repository.GalleryRepo;
import com.kallingal.repository.ServiceRepo;
import com.kallingal.repository.JobRepo;
import com.kallingal.repository.ApplicationRepo;
import com.kallingal.repository.LeadRepo;
import com.kallingal.repository.SettingRepo;
import com.kallingal.repository.TestimonialRepo;
import com.kallingal.repository.FaqRepo;
import com.kallingal.repository.PageHeroRepo;
import com.kallingal.repository.BrandItemRepo;
import com.kallingal.repository.ProductCategoryRepo;
import com.kallingal.repository.HomeOfferRepo;
import com.kallingal.repository.HomeHighlightRepo;
import com.kallingal.repository.HomeVideoRepo;
import com.kallingal.repository.ServicePanelRepo;
import com.kallingal.repository.ServicePromiseRepo;
import com.kallingal.repository.CareerPerkRepo;
import com.kallingal.repository.AboutMilestoneRepo;
import com.kallingal.repository.AboutBrandRepo;
import com.kallingal.domain.Entities.Setting;
import org.springframework.r2dbc.core.DatabaseClient;
import java.util.Map;
import java.util.LinkedHashMap;
import java.util.List;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import org.springframework.web.server.ServerWebInputException;
import org.springframework.http.MediaType;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Instant;

import static org.springframework.web.reactive.function.server.ServerResponse.*;

@Component
public class ApiHandler {

  private final ShowroomRepo showrooms;
  private final GalleryRepo gallery;
  private final ServiceRepo services;
  private final JobRepo jobs;
  private final ApplicationRepo applications;
  private final LeadRepo leads;
  private final SettingRepo settings;
  private final TestimonialRepo testimonials;
  private final FaqRepo faqs;
  private final PageHeroRepo pageHeroes;
  private final BrandItemRepo brands;
  private final ProductCategoryRepo productCategories;
  private final HomeOfferRepo homeOffers;
  private final HomeHighlightRepo homeHighlights;
  private final HomeVideoRepo homeVideos;
  private final ServicePanelRepo servicePanels;
  private final ServicePromiseRepo servicePromises;
  private final CareerPerkRepo careerPerks;
  private final AboutMilestoneRepo aboutMilestones;
  private final AboutBrandRepo aboutBrands;
  private final DatabaseClient db;
  private final ContentCache cache;

  // Decoded-size cap for an uploaded CV — matches the 5 MB the UI advertises and
  // enforces. Well under spring.codec.max-in-memory-size and nginx client_max_body_size.
  private static final int MAX_CV_BYTES = 5 * 1024 * 1024;

  public ApiHandler(ShowroomRepo s, GalleryRepo g, ServiceRepo sv, JobRepo j, ApplicationRepo a, LeadRepo l,
                    SettingRepo st, TestimonialRepo tm, FaqRepo fq, PageHeroRepo ph, BrandItemRepo bi,
                    ProductCategoryRepo pc, HomeOfferRepo ho, HomeHighlightRepo hh, HomeVideoRepo hv,
                    ServicePanelRepo sp, ServicePromiseRepo spr, CareerPerkRepo cp, AboutMilestoneRepo am,
                    AboutBrandRepo abr, DatabaseClient db, ContentCache cache) {
    this.showrooms = s; this.gallery = g; this.services = sv; this.jobs = j; this.applications = a; this.leads = l;
    this.settings = st; this.testimonials = tm; this.faqs = fq; this.pageHeroes = ph; this.brands = bi;
    this.productCategories = pc; this.homeOffers = ho; this.homeHighlights = hh; this.homeVideos = hv;
    this.servicePanels = sp; this.servicePromises = spr; this.careerPerks = cp; this.aboutMilestones = am;
    this.aboutBrands = abr; this.db = db; this.cache = cache;
  }

  // ---------- public ----------
  public Mono<ServerResponse> listShowrooms(ServerRequest r) { return ok().body(cache.flux("showrooms", Showroom.class, showrooms::findAll), Showroom.class); }
  public Mono<ServerResponse> listGallery(ServerRequest r)   { return ok().body(cache.flux("gallery", GalleryImage.class, gallery::findAll), GalleryImage.class); }
  public Mono<ServerResponse> listServices(ServerRequest r)  { return ok().body(cache.flux("services", ServiceItem.class, services::findAll), ServiceItem.class); }
  public Mono<ServerResponse> listJobs(ServerRequest r)      { return ok().body(cache.flux("jobs", JobOpening.class, jobs::findByActiveTrue), JobOpening.class); }
  public Mono<ServerResponse> pageHero(ServerRequest r) {
    String page = r.pathVariable("page");
    return cache.mono("pageHero:" + page, PageHero.class, () -> pageHeroes.findByPage(page))
      .flatMap(h -> ok().bodyValue(h))
      .switchIfEmpty(notFound().build());
  }
  public Mono<ServerResponse> listBrands(ServerRequest r)    { return ok().body(cache.flux("brands", BrandItem.class, brands::findByActiveTrueOrderBySortOrderAsc), BrandItem.class); }
  public Mono<ServerResponse> listProductCategories(ServerRequest r) { return ok().body(cache.flux("productCategories", ProductCategory.class, productCategories::findByActiveTrueOrderBySortOrderAsc), ProductCategory.class); }
  public Mono<ServerResponse> listHomeOffers(ServerRequest r) { return ok().body(cache.flux("homeOffers", HomeOffer.class, homeOffers::findByActiveTrueOrderBySortOrderAsc), HomeOffer.class); }
  public Mono<ServerResponse> listHomeHighlights(ServerRequest r) { return ok().body(cache.flux("homeHighlights", HomeHighlight.class, homeHighlights::findByActiveTrueOrderBySortOrderAsc), HomeHighlight.class); }
  public Mono<ServerResponse> listHomeVideos(ServerRequest r) { return ok().body(cache.flux("homeVideos", HomeVideo.class, homeVideos::findByActiveTrueOrderBySortOrderAsc), HomeVideo.class); }
  public Mono<ServerResponse> listServicePanels(ServerRequest r) { return ok().body(cache.flux("servicePanels", ServicePanel.class, servicePanels::findByActiveTrueOrderBySortOrderAsc), ServicePanel.class); }
  public Mono<ServerResponse> listServicePromises(ServerRequest r) { return ok().body(cache.flux("servicePromises", ServicePromise.class, servicePromises::findByActiveTrueOrderBySortOrderAsc), ServicePromise.class); }
  public Mono<ServerResponse> listCareerPerks(ServerRequest r) { return ok().body(cache.flux("careerPerks", CareerPerk.class, careerPerks::findByActiveTrueOrderBySortOrderAsc), CareerPerk.class); }
  public Mono<ServerResponse> stats(ServerRequest r) {
    return cache.mono("stats", List.class, () -> Mono.zip(showrooms.count(), services.count(), settings.findAll().collectMap(Setting::skey, Setting::svalue))
      .map(t -> List.of(
        stat("store", t.getT1(), "", "Showrooms"),
        stat("users", longSetting(t.getT3(), "stat_happy_riders"), "+", "Happy riders"),
        stat("award", longSetting(t.getT3(), "stat_years_trust"), "+", "Years of trust"),
        stat("wrench", t.getT2(), "", "Core services")
      ))).flatMap(v -> ok().bodyValue(v));
  }

  public Mono<ServerResponse> createLead(ServerRequest r) {
    return r.bodyToMono(Lead.class)
      .switchIfEmpty(Mono.error(new ServerWebInputException("Request body is required")))
      .flatMap(l -> {
        if (blank(l.name()) || blank(l.phone()) || blank(l.type())) {
          return badRequest().bodyValue(Map.of("error", "name, phone and type are required"));
        }
        return leads.save(new Lead(null, l.name().trim(), l.phone().trim(), l.email(), l.type().trim(), l.message(), Instant.now()))
          .flatMap(saved -> status(201).bodyValue(saved));
      });
  }

  public Mono<ServerResponse> createApplication(ServerRequest r) {
    return r.bodyToMono(JobApplication.class)
      .switchIfEmpty(Mono.error(new ServerWebInputException("Request body is required")))
      .flatMap(a -> {
        if (blank(a.name()) || blank(a.phone()) || blank(a.email())) {
          return badRequest().bodyValue(Map.of("error", "name, phone and email are required"));
        }
        if (a.resumeData() != null && a.resumeData().length > MAX_CV_BYTES) {
          return badRequest().bodyValue(Map.of("error", "CV file is too large (max 5 MB)"));
        }
        JobApplication toSave = new JobApplication(null, a.jobId(), a.name().trim(), a.phone().trim(),
          a.email().trim(), a.resumeUrl(), a.resumeFilename(), a.resumeContentType(), a.resumeData(),
          a.note(), Instant.now());
        // Don't echo the (potentially multi-MB) CV bytes back to the browser; the client only needs the id.
        return applications.save(toSave)
          .flatMap(saved -> status(201).bodyValue(Map.of("id", saved.id(), "status", "received")));
      });
  }

  // ---------- admin CMS ----------
  public Mono<ServerResponse> saveShowroom(ServerRequest r) {
    return r.bodyToMono(Showroom.class).flatMap(showrooms::save).flatMap(this::createdCached);
  }
  public Mono<ServerResponse> deleteShowroom(ServerRequest r) {
    return showrooms.deleteById(Long.valueOf(r.pathVariable("id"))).then(clearCache()).then(noContent().build());
  }
  public Mono<ServerResponse> saveGalleryImage(ServerRequest r) {
    return r.bodyToMono(GalleryImage.class)
      .map(g -> new GalleryImage(g.id(), g.url(), g.caption(), g.createdAt() == null ? Instant.now() : g.createdAt()))
      .flatMap(gallery::save).flatMap(this::createdCached);
  }
  public Mono<ServerResponse> deleteGalleryImage(ServerRequest r) {
    return gallery.deleteById(Long.valueOf(r.pathVariable("id"))).then(clearCache()).then(noContent().build());
  }
  public Mono<ServerResponse> saveService(ServerRequest r) {
    return r.bodyToMono(ServiceItem.class).flatMap(services::save).flatMap(this::createdCached);
  }
  public Mono<ServerResponse> deleteService(ServerRequest r) {
    return services.deleteById(Long.valueOf(r.pathVariable("id"))).then(clearCache()).then(noContent().build());
  }
  public Mono<ServerResponse> saveJob(ServerRequest r) {
    // Default active (matches the other content handlers): an omitted/null active
    // would write NULL, and `WHERE active = TRUE` excludes NULL, silently hiding
    // the job from the public /api/jobs listing.
    return r.bodyToMono(JobOpening.class)
      .map(j -> new JobOpening(j.id(), j.title(), j.department(), j.location(), j.description(), j.active() == null || j.active()))
      .flatMap(jobs::save).flatMap(this::createdCached);
  }
  public Mono<ServerResponse> deleteJob(ServerRequest r) {
    return jobs.deleteById(Long.valueOf(r.pathVariable("id"))).then(clearCache()).then(noContent().build());
  }
  public Mono<ServerResponse> listApplications(ServerRequest r) {
    // Project every column EXCEPT resume_data so the admin list stays light — the CV
    // bytes are streamed on demand by downloadCv. Keys are camelCased to match the
    // JobApplication TS interface; a non-null resumeFilename tells the UI a CV exists.
    Flux<Map<String, Object>> rows = db.sql(
        "SELECT id, job_id, name, phone, email, note, resume_url, resume_filename, created_at " +
        "FROM job_applications ORDER BY id")
      .fetch().all()
      .map(row -> {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", row.get("id"));
        m.put("jobId", row.get("job_id"));
        m.put("name", row.get("name"));
        m.put("phone", row.get("phone"));
        m.put("email", row.get("email"));
        m.put("note", row.get("note"));
        m.put("resumeUrl", row.get("resume_url"));
        m.put("resumeFilename", row.get("resume_filename"));
        m.put("createdAt", row.get("created_at"));
        return m;
      });
    return ok().body(rows, new org.springframework.core.ParameterizedTypeReference<Map<String, Object>>() {});
  }

  public Mono<ServerResponse> downloadCv(ServerRequest r) {
    long id = Long.parseLong(r.pathVariable("id"));
    return db.sql("SELECT resume_filename, resume_content_type, resume_data FROM job_applications WHERE id = :id")
      .bind("id", id)
      .map(row -> new CvFile(
        row.get("resume_data", byte[].class),
        row.get("resume_filename", String.class),
        row.get("resume_content_type", String.class)))
      .one()
      .flatMap(cv -> {
        if (cv.data() == null) return notFound().build();
        MediaType type;
        try {
          type = MediaType.parseMediaType(cv.contentType() == null ? "application/octet-stream" : cv.contentType());
        } catch (Exception e) {
          type = MediaType.APPLICATION_OCTET_STREAM;
        }
        String filename = (cv.filename() == null ? "cv-" + id : cv.filename()).replaceAll("[\"\\r\\n]", "");
        // RFC 6266 / 5987 encoding so non-ASCII names (accents, Malayalam, ...) survive
        // the (ISO-8859-1-only) HTTP header instead of becoming mojibake.
        String disposition = org.springframework.http.ContentDisposition.attachment()
          .filename(filename, java.nio.charset.StandardCharsets.UTF_8).build().toString();
        return ok()
          .contentType(type)
          .header("Content-Disposition", disposition)
          .bodyValue(cv.data());
      })
      .switchIfEmpty(notFound().build());
  }

  private record CvFile(byte[] data, String filename, String contentType) {}

  public Mono<ServerResponse> listLeads(ServerRequest r)        { return ok().body(leads.findAll(), Lead.class); }

  public Mono<ServerResponse> listPageHeroes(ServerRequest r) { return ok().body(pageHeroes.findAll(), PageHero.class); }
  public Mono<ServerResponse> savePageHero(ServerRequest r) {
    return r.bodyToMono(PageHero.class).flatMap(pageHeroes::save).flatMap(this::createdCached);
  }
  public Mono<ServerResponse> deletePageHero(ServerRequest r) {
    return pageHeroes.deleteById(Long.valueOf(r.pathVariable("id"))).then(clearCache()).then(noContent().build());
  }

  public Mono<ServerResponse> listAdminBrands(ServerRequest r) { return ok().body(brands.findAll(), BrandItem.class); }
  public Mono<ServerResponse> saveBrand(ServerRequest r) {
    return r.bodyToMono(BrandItem.class)
      .map(b -> new BrandItem(b.id(), b.name(), b.sortOrder() == null ? 0 : b.sortOrder(), b.active() == null || b.active()))
      .flatMap(brands::save).flatMap(this::createdCached);
  }
  public Mono<ServerResponse> deleteBrand(ServerRequest r) {
    return brands.deleteById(Long.valueOf(r.pathVariable("id"))).then(clearCache()).then(noContent().build());
  }

  public Mono<ServerResponse> listAdminProductCategories(ServerRequest r) { return ok().body(productCategories.findAll(), ProductCategory.class); }
  public Mono<ServerResponse> saveProductCategory(ServerRequest r) {
    return r.bodyToMono(ProductCategory.class)
      .map(p -> new ProductCategory(p.id(), p.name(), p.tag(), p.accent(), p.icon(), p.imageUrl(), p.description(), p.specs(), p.sortOrder() == null ? 0 : p.sortOrder(), p.active() == null || p.active()))
      .flatMap(productCategories::save).flatMap(this::createdCached);
  }
  public Mono<ServerResponse> deleteProductCategory(ServerRequest r) {
    return productCategories.deleteById(Long.valueOf(r.pathVariable("id"))).then(clearCache()).then(noContent().build());
  }

  public Mono<ServerResponse> listAdminHomeOffers(ServerRequest r) { return ok().body(homeOffers.findAll(), HomeOffer.class); }
  public Mono<ServerResponse> saveHomeOffer(ServerRequest r) {
    return r.bodyToMono(HomeOffer.class)
      .map(o -> new HomeOffer(o.id(), o.title(), o.tag(), o.icon(), o.text(), o.imageUrl(), o.link(), o.sortOrder() == null ? 0 : o.sortOrder(), o.active() == null || o.active()))
      .flatMap(homeOffers::save).flatMap(this::createdCached);
  }
  public Mono<ServerResponse> deleteHomeOffer(ServerRequest r) {
    return homeOffers.deleteById(Long.valueOf(r.pathVariable("id"))).then(clearCache()).then(noContent().build());
  }

  public Mono<ServerResponse> listAdminHomeHighlights(ServerRequest r) { return ok().body(homeHighlights.findAll(), HomeHighlight.class); }
  public Mono<ServerResponse> saveHomeHighlight(ServerRequest r) {
    return r.bodyToMono(HomeHighlight.class)
      .map(h -> new HomeHighlight(h.id(), h.icon(), h.value(), h.label(), h.sortOrder() == null ? 0 : h.sortOrder(), h.active() == null || h.active()))
      .flatMap(homeHighlights::save).flatMap(this::createdCached);
  }
  public Mono<ServerResponse> deleteHomeHighlight(ServerRequest r) {
    return homeHighlights.deleteById(Long.valueOf(r.pathVariable("id"))).then(clearCache()).then(noContent().build());
  }

  public Mono<ServerResponse> listAdminHomeVideos(ServerRequest r) { return ok().body(homeVideos.findAll(), HomeVideo.class); }
  public Mono<ServerResponse> saveHomeVideo(ServerRequest r) {
    return r.bodyToMono(HomeVideo.class)
      .map(v -> new HomeVideo(v.id(), v.youtubeId(), v.title(), v.tag(), v.caption(), v.sortOrder() == null ? 0 : v.sortOrder(), v.active() == null || v.active()))
      .flatMap(homeVideos::save).flatMap(this::createdCached);
  }
  public Mono<ServerResponse> deleteHomeVideo(ServerRequest r) {
    return homeVideos.deleteById(Long.valueOf(r.pathVariable("id"))).then(clearCache()).then(noContent().build());
  }

  public Mono<ServerResponse> listAdminServicePanels(ServerRequest r) { return ok().body(servicePanels.findAll(), ServicePanel.class); }
  public Mono<ServerResponse> saveServicePanel(ServerRequest r) {
    return r.bodyToMono(ServicePanel.class)
      .map(p -> new ServicePanel(p.id(), p.eyebrow(), p.title(), p.text(), p.imageUrl(), p.icon(), p.ctaLabel(), p.ctaLink(), p.theme(), p.sortOrder() == null ? 0 : p.sortOrder(), p.active() == null || p.active()))
      .flatMap(servicePanels::save).flatMap(this::createdCached);
  }
  public Mono<ServerResponse> deleteServicePanel(ServerRequest r) {
    return servicePanels.deleteById(Long.valueOf(r.pathVariable("id"))).then(clearCache()).then(noContent().build());
  }

  public Mono<ServerResponse> listAdminServicePromises(ServerRequest r) { return ok().body(servicePromises.findAll(), ServicePromise.class); }
  public Mono<ServerResponse> saveServicePromise(ServerRequest r) {
    return r.bodyToMono(ServicePromise.class)
      .map(p -> new ServicePromise(p.id(), p.icon(), p.label(), p.text(), p.sortOrder() == null ? 0 : p.sortOrder(), p.active() == null || p.active()))
      .flatMap(servicePromises::save).flatMap(this::createdCached);
  }
  public Mono<ServerResponse> deleteServicePromise(ServerRequest r) {
    return servicePromises.deleteById(Long.valueOf(r.pathVariable("id"))).then(clearCache()).then(noContent().build());
  }

  public Mono<ServerResponse> listAdminCareerPerks(ServerRequest r) { return ok().body(careerPerks.findAll(), CareerPerk.class); }
  public Mono<ServerResponse> saveCareerPerk(ServerRequest r) {
    return r.bodyToMono(CareerPerk.class)
      .map(p -> new CareerPerk(p.id(), p.icon(), p.label(), p.text(), p.sortOrder() == null ? 0 : p.sortOrder(), p.active() == null || p.active()))
      .flatMap(careerPerks::save).flatMap(this::createdCached);
  }
  public Mono<ServerResponse> deleteCareerPerk(ServerRequest r) {
    return careerPerks.deleteById(Long.valueOf(r.pathVariable("id"))).then(clearCache()).then(noContent().build());
  }

  // ---------- about / legacy timeline ----------
  public Mono<ServerResponse> listAboutMilestones(ServerRequest r) { return ok().body(cache.flux("aboutMilestones", AboutMilestone.class, aboutMilestones::findByActiveTrueOrderBySortOrderAsc), AboutMilestone.class); }
  public Mono<ServerResponse> listAdminAboutMilestones(ServerRequest r) { return ok().body(aboutMilestones.findAll(), AboutMilestone.class); }
  public Mono<ServerResponse> saveAboutMilestone(ServerRequest r) {
    return r.bodyToMono(AboutMilestone.class)
      .map(m -> new AboutMilestone(m.id(), m.yearLabel(), m.title(), m.body(), m.sortOrder() == null ? 0 : m.sortOrder(), m.active() == null || m.active()))
      .flatMap(aboutMilestones::save).flatMap(this::createdCached);
  }
  public Mono<ServerResponse> deleteAboutMilestone(ServerRequest r) {
    return aboutMilestones.deleteById(Long.valueOf(r.pathVariable("id"))).then(clearCache()).then(noContent().build());
  }

  // ---------- about / partner brands ----------
  public Mono<ServerResponse> listAboutBrands(ServerRequest r) { return ok().body(cache.flux("aboutBrands", AboutBrand.class, aboutBrands::findByActiveTrueOrderBySortOrderAsc), AboutBrand.class); }
  public Mono<ServerResponse> listAdminAboutBrands(ServerRequest r) { return ok().body(aboutBrands.findAll(), AboutBrand.class); }
  public Mono<ServerResponse> saveAboutBrand(ServerRequest r) {
    return r.bodyToMono(AboutBrand.class)
      .map(b -> new AboutBrand(b.id(), b.name(), b.sortOrder() == null ? 0 : b.sortOrder(), b.active() == null || b.active()))
      .flatMap(aboutBrands::save).flatMap(this::createdCached);
  }
  public Mono<ServerResponse> deleteAboutBrand(ServerRequest r) {
    return aboutBrands.deleteById(Long.valueOf(r.pathVariable("id"))).then(clearCache()).then(noContent().build());
  }

  public Mono<ServerResponse> cacheInfo(ServerRequest r) { return ok().bodyValue(cache.info()); }
  public Mono<ServerResponse> clearSiteCache(ServerRequest r) {
    cache.clearAll();
    return ok().bodyValue(Map.of("cleared", true, "entries", 0));
  }

  // ---------- testimonials ----------
  public Mono<ServerResponse> listTestimonials(ServerRequest r) { return ok().body(cache.flux("testimonials", Testimonial.class, testimonials::findAll), Testimonial.class); }
  public Mono<ServerResponse> saveTestimonial(ServerRequest r) {
    return r.bodyToMono(Testimonial.class)
      .map(t -> new Testimonial(t.id(), t.name(), t.role(), t.quote(),
        t.rating() == null ? 5 : t.rating(), t.createdAt() == null ? Instant.now() : t.createdAt()))
      .flatMap(testimonials::save).flatMap(this::createdCached);
  }
  public Mono<ServerResponse> deleteTestimonial(ServerRequest r) {
    return testimonials.deleteById(Long.valueOf(r.pathVariable("id"))).then(clearCache()).then(noContent().build());
  }

  // ---------- faqs ----------
  public Mono<ServerResponse> listFaqs(ServerRequest r) { return ok().body(cache.flux("faqs", Faq.class, faqs::findAllByOrderBySortOrderAsc), Faq.class); }
  public Mono<ServerResponse> saveFaq(ServerRequest r) {
    return r.bodyToMono(Faq.class)
      .map(f -> new Faq(f.id(), f.question(), f.answer(), f.sortOrder() == null ? 0 : f.sortOrder()))
      .flatMap(faqs::save).flatMap(this::createdCached);
  }
  public Mono<ServerResponse> deleteFaq(ServerRequest r) {
    return faqs.deleteById(Long.valueOf(r.pathVariable("id"))).then(clearCache()).then(noContent().build());
  }

  // ---------- settings ----------
  public Mono<ServerResponse> getSettings(ServerRequest r) {
    return cache.mono("settings", Map.class, () -> settings.findAll().collectMap(Setting::skey, Setting::svalue).map(m -> (Map) m))
      .flatMap(m -> ok().bodyValue(m));
  }

  public Mono<ServerResponse> saveSettings(ServerRequest r) {
    // Atomic per-key upsert. The previous findBySkey-then-save was a non-atomic
    // read-modify-write that raced the UNIQUE(skey) constraint: two concurrent
    // saves of a brand-new key both read empty, both INSERT, and the second blew
    // up with a constraint violation (HTTP 500). ON CONFLICT makes it race-free.
    return r.bodyToMono(new org.springframework.core.ParameterizedTypeReference<Map<String, String>>() {})
      .flatMapMany(map -> reactor.core.publisher.Flux.fromIterable(map.entrySet())
        .concatMap(e -> db.sql("INSERT INTO site_settings (skey, svalue) VALUES (:k, :v) ON CONFLICT (skey) DO UPDATE SET svalue = EXCLUDED.svalue")
          .bind("k", e.getKey()).bind("v", e.getValue()).fetch().rowsUpdated()))
      .then(clearCache())
      .then(getSettings(r));
  }

  // ---------- reports ----------
  public Mono<ServerResponse> reports(ServerRequest r) {
    Mono<Map<String, Object>> base = Mono.zip(
      leads.count(), applications.count(), showrooms.count(), gallery.count(), jobs.count()
    ).map(t -> {
      Map<String, Object> m = new LinkedHashMap<>();
      m.put("totalLeads", t.getT1());
      m.put("totalApplications", t.getT2());
      m.put("showrooms", t.getT3());
      m.put("galleryImages", t.getT4());
      m.put("jobOpenings", t.getT5());
      return m;
    });

    Mono<Map<String, Object>> byType = db.sql("SELECT type, COUNT(*) AS c FROM leads GROUP BY type")
      .fetch().all()
      .collectMap(row -> String.valueOf(row.get("type")), row -> (Object) row.get("c"));

    Mono<Map<String, Object>> last7 = db.sql(
        "SELECT COUNT(*) AS c FROM leads WHERE created_at > now() - interval '7 days'")
      .fetch().one().map(row -> Map.of("leadsLast7Days", row.get("c")));

    return Mono.zip(base, byType, last7).flatMap(t -> {
      Map<String, Object> m = new LinkedHashMap<>(t.getT1());
      m.put("leadsByType", t.getT2());
      m.putAll(t.getT3());
      return ok().bodyValue(m);
    });
  }

  private static Map<String, Object> stat(String icon, Long value, String suffix, String label) {
    Map<String, Object> m = new LinkedHashMap<>();
    m.put("icon", icon);
    m.put("value", value == null ? 0L : value);
    m.put("suffix", suffix);
    m.put("label", label);
    return m;
  }

  private static long longSetting(Map<String, String> settings, String key) {
    try {
      return Long.parseLong(settings.getOrDefault(key, "0"));
    } catch (NumberFormatException e) {
      return 0L;
    }
  }

  private static boolean blank(String s) { return s == null || s.isBlank(); }

  private Mono<Void> clearCache() {
    return Mono.fromRunnable(cache::clearAll).then();
  }

  private <T> Mono<ServerResponse> createdCached(T saved) {
    cache.clearAll();
    return status(201).bodyValue(saved);
  }
}
