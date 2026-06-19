package com.kallingal.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import java.time.Instant;

public class Entities {

  @Table("showrooms")
  public record Showroom(@Id Long id, String name, String address, Double lat, Double lng, String phone, String imageUrl) {}

  @Table("gallery_images")
  public record GalleryImage(@Id Long id, String url, String caption, Instant createdAt) {}

  @Table("service_items")
  public record ServiceItem(@Id Long id, String title, String category, String description) {}

  @Table("job_openings")
  public record JobOpening(@Id Long id, String title, String department, String location, String description, Boolean active) {}

  @Table("job_applications")
  public record JobApplication(@Id Long id, Long jobId, String name, String phone, String email,
                               String resumeUrl, String resumeFilename, String resumeContentType,
                               byte[] resumeData, String note, Instant createdAt) {}

  @Table("leads")
  public record Lead(@Id Long id, String name, String phone, String email, String type, String message, Instant createdAt) {}

  @Table("site_settings")
  public record Setting(@Id Long id, String skey, String svalue) {}

  @Table("testimonials")
  public record Testimonial(@Id Long id, String name, String role, String quote, Integer rating, Instant createdAt) {}

  @Table("faqs")
  public record Faq(@Id Long id, String question, String answer, Integer sortOrder) {}

  @Table("page_heroes")
  public record PageHero(@Id Long id, String page, String eyebrow, String title, String sub, String imageUrl, String videoUrl, String chips) {}

  @Table("brand_items")
  public record BrandItem(@Id Long id, String name, Integer sortOrder, Boolean active) {}

  @Table("product_categories")
  public record ProductCategory(@Id Long id, String name, String tag, String accent, String icon, String imageUrl, String description, String specs, Integer sortOrder, Boolean active) {}

  @Table("home_offers")
  public record HomeOffer(@Id Long id, String title, String tag, String icon, String text, String imageUrl, String link, Integer sortOrder, Boolean active) {}

  @Table("home_highlights")
  public record HomeHighlight(@Id Long id, String icon, String value, String label, Integer sortOrder, Boolean active) {}

  @Table("home_videos")
  public record HomeVideo(@Id Long id, String youtubeId, String title, String tag, String caption, Integer sortOrder, Boolean active) {}

  @Table("service_panels")
  public record ServicePanel(@Id Long id, String eyebrow, String title, String text, String imageUrl, String icon, String ctaLabel, String ctaLink, String theme, Integer sortOrder, Boolean active) {}

  @Table("service_promises")
  public record ServicePromise(@Id Long id, String icon, String label, String text, Integer sortOrder, Boolean active) {}

  @Table("career_perks")
  public record CareerPerk(@Id Long id, String icon, String label, String text, Integer sortOrder, Boolean active) {}

  @Table("about_milestones")
  public record AboutMilestone(@Id Long id, String yearLabel, String title, String body, Integer sortOrder, Boolean active) {}

  @Table("about_brands")
  public record AboutBrand(@Id Long id, String name, String logoUrl, Integer sortOrder, Boolean active) {}
}
