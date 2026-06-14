package com.kallingal.router;

import com.kallingal.handler.ApiHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.ServerResponse;

import static org.springframework.web.reactive.function.server.RequestPredicates.*;
import static org.springframework.web.reactive.function.server.RouterFunctions.route;

@Configuration
public class ApiRouter {

  @Bean
  public RouterFunction<ServerResponse> routes(ApiHandler h) {
    return route(GET("/api/showrooms"), h::listShowrooms)
      .andRoute(GET("/api/gallery"), h::listGallery)
      .andRoute(GET("/api/services"), h::listServices)
      .andRoute(GET("/api/jobs"), h::listJobs)
      .andRoute(GET("/api/stats"), h::stats)
      .andRoute(GET("/api/page-heroes/{page}"), h::pageHero)
      .andRoute(GET("/api/brands"), h::listBrands)
      .andRoute(GET("/api/product-categories"), h::listProductCategories)
      .andRoute(GET("/api/home-offers"), h::listHomeOffers)
      .andRoute(GET("/api/home-highlights"), h::listHomeHighlights)
      .andRoute(GET("/api/home-videos"), h::listHomeVideos)
      .andRoute(GET("/api/service-panels"), h::listServicePanels)
      .andRoute(GET("/api/service-promises"), h::listServicePromises)
      .andRoute(GET("/api/career-perks"), h::listCareerPerks)
      .andRoute(GET("/api/testimonials"), h::listTestimonials)
      .andRoute(GET("/api/faqs"), h::listFaqs)
      .andRoute(POST("/api/leads"), h::createLead)
      .andRoute(POST("/api/applications"), h::createApplication)
      // admin CMS
      .andRoute(POST("/api/admin/showrooms"), h::saveShowroom)
      .andRoute(DELETE("/api/admin/showrooms/{id}"), h::deleteShowroom)
      .andRoute(POST("/api/admin/gallery"), h::saveGalleryImage)
      .andRoute(DELETE("/api/admin/gallery/{id}"), h::deleteGalleryImage)
      .andRoute(POST("/api/admin/services"), h::saveService)
      .andRoute(DELETE("/api/admin/services/{id}"), h::deleteService)
      .andRoute(POST("/api/admin/jobs"), h::saveJob)
      .andRoute(DELETE("/api/admin/jobs/{id}"), h::deleteJob)
      .andRoute(GET("/api/admin/page-heroes"), h::listPageHeroes)
      .andRoute(POST("/api/admin/page-heroes"), h::savePageHero)
      .andRoute(DELETE("/api/admin/page-heroes/{id}"), h::deletePageHero)
      .andRoute(GET("/api/admin/brands"), h::listAdminBrands)
      .andRoute(POST("/api/admin/brands"), h::saveBrand)
      .andRoute(DELETE("/api/admin/brands/{id}"), h::deleteBrand)
      .andRoute(GET("/api/admin/product-categories"), h::listAdminProductCategories)
      .andRoute(POST("/api/admin/product-categories"), h::saveProductCategory)
      .andRoute(DELETE("/api/admin/product-categories/{id}"), h::deleteProductCategory)
      .andRoute(GET("/api/admin/home-offers"), h::listAdminHomeOffers)
      .andRoute(POST("/api/admin/home-offers"), h::saveHomeOffer)
      .andRoute(DELETE("/api/admin/home-offers/{id}"), h::deleteHomeOffer)
      .andRoute(GET("/api/admin/home-highlights"), h::listAdminHomeHighlights)
      .andRoute(POST("/api/admin/home-highlights"), h::saveHomeHighlight)
      .andRoute(DELETE("/api/admin/home-highlights/{id}"), h::deleteHomeHighlight)
      .andRoute(GET("/api/admin/home-videos"), h::listAdminHomeVideos)
      .andRoute(POST("/api/admin/home-videos"), h::saveHomeVideo)
      .andRoute(DELETE("/api/admin/home-videos/{id}"), h::deleteHomeVideo)
      .andRoute(GET("/api/admin/service-panels"), h::listAdminServicePanels)
      .andRoute(POST("/api/admin/service-panels"), h::saveServicePanel)
      .andRoute(DELETE("/api/admin/service-panels/{id}"), h::deleteServicePanel)
      .andRoute(GET("/api/admin/service-promises"), h::listAdminServicePromises)
      .andRoute(POST("/api/admin/service-promises"), h::saveServicePromise)
      .andRoute(DELETE("/api/admin/service-promises/{id}"), h::deleteServicePromise)
      .andRoute(GET("/api/admin/career-perks"), h::listAdminCareerPerks)
      .andRoute(POST("/api/admin/career-perks"), h::saveCareerPerk)
      .andRoute(DELETE("/api/admin/career-perks/{id}"), h::deleteCareerPerk)
      .andRoute(POST("/api/admin/testimonials"), h::saveTestimonial)
      .andRoute(DELETE("/api/admin/testimonials/{id}"), h::deleteTestimonial)
      .andRoute(POST("/api/admin/faqs"), h::saveFaq)
      .andRoute(DELETE("/api/admin/faqs/{id}"), h::deleteFaq)
      .andRoute(GET("/api/admin/applications"), h::listApplications)
      .andRoute(GET("/api/admin/leads"), h::listLeads)
      .andRoute(GET("/api/settings"), h::getSettings)
      .andRoute(POST("/api/admin/settings"), h::saveSettings)
      .andRoute(GET("/api/admin/cache"), h::cacheInfo)
      .andRoute(DELETE("/api/admin/cache"), h::clearSiteCache)
      .andRoute(GET("/api/admin/reports"), h::reports);
  }
}
