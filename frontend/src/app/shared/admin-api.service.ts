import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Showroom, GalleryImage, ServiceItem, JobOpening, Lead, JobApplication, Testimonial, Faq,
  PageHero, BrandItem, ProductCategory, HomeOffer, HomeHighlight, HomeVideo,
  ServicePanel, ServicePromise, CareerPerk, AboutMilestone, AboutBrand
} from './api.service';

export interface Reports {
  totalLeads: number; totalApplications: number; showrooms: number;
  galleryImages: number; jobOpenings: number; leadsLast7Days: number;
  leadsByType: Record<string, number>;
}
export interface CacheInfo { entries: number; keys: string[]; stats: string; }

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private http = inject(HttpClient);
  loggedIn = signal(!!sessionStorage.getItem('adminAuth'));

  private headers(): HttpHeaders {
    return new HttpHeaders({ Authorization: 'Basic ' + (sessionStorage.getItem('adminAuth') || '') });
  }

  login(username: string, password: string): Observable<Reports> {
    const token = btoa(`${username}:${password}`);
    sessionStorage.setItem('adminAuth', token);
    return this.reports();
  }
  logout() { sessionStorage.removeItem('adminAuth'); this.loggedIn.set(false); }
  confirmLogin() { this.loggedIn.set(true); }

  reports(): Observable<Reports> { return this.http.get<Reports>('/api/admin/reports', { headers: this.headers() }); }

  leads(): Observable<Lead[]> { return this.http.get<Lead[]>('/api/admin/leads', { headers: this.headers() }); }
  applications(): Observable<JobApplication[]> { return this.http.get<JobApplication[]>('/api/admin/applications', { headers: this.headers() }); }
  downloadCv(id: number): Observable<Blob> { return this.http.get(`/api/admin/applications/${id}/cv`, { headers: this.headers(), responseType: 'blob' }); }

  saveShowroom(s: Showroom) { return this.http.post<Showroom>('/api/admin/showrooms', s, { headers: this.headers() }); }
  deleteShowroom(id: number) { return this.http.delete(`/api/admin/showrooms/${id}`, { headers: this.headers() }); }

  saveGallery(g: GalleryImage) { return this.http.post<GalleryImage>('/api/admin/gallery', g, { headers: this.headers() }); }
  deleteGallery(id: number) { return this.http.delete(`/api/admin/gallery/${id}`, { headers: this.headers() }); }

  saveService(s: ServiceItem) { return this.http.post<ServiceItem>('/api/admin/services', s, { headers: this.headers() }); }
  deleteService(id: number) { return this.http.delete(`/api/admin/services/${id}`, { headers: this.headers() }); }

  saveJob(j: JobOpening) { return this.http.post<JobOpening>('/api/admin/jobs', j, { headers: this.headers() }); }
  deleteJob(id: number) { return this.http.delete(`/api/admin/jobs/${id}`, { headers: this.headers() }); }

  pageHeroes(): Observable<PageHero[]> { return this.http.get<PageHero[]>('/api/admin/page-heroes', { headers: this.headers() }); }
  savePageHero(v: PageHero) { return this.http.post<PageHero>('/api/admin/page-heroes', v, { headers: this.headers() }); }
  deletePageHero(id: number) { return this.http.delete(`/api/admin/page-heroes/${id}`, { headers: this.headers() }); }

  brands(): Observable<BrandItem[]> { return this.http.get<BrandItem[]>('/api/admin/brands', { headers: this.headers() }); }
  saveBrand(v: BrandItem) { return this.http.post<BrandItem>('/api/admin/brands', v, { headers: this.headers() }); }
  deleteBrand(id: number) { return this.http.delete(`/api/admin/brands/${id}`, { headers: this.headers() }); }

  productCategories(): Observable<ProductCategory[]> { return this.http.get<ProductCategory[]>('/api/admin/product-categories', { headers: this.headers() }); }
  saveProductCategory(v: ProductCategory) { return this.http.post<ProductCategory>('/api/admin/product-categories', v, { headers: this.headers() }); }
  deleteProductCategory(id: number) { return this.http.delete(`/api/admin/product-categories/${id}`, { headers: this.headers() }); }

  homeOffers(): Observable<HomeOffer[]> { return this.http.get<HomeOffer[]>('/api/admin/home-offers', { headers: this.headers() }); }
  saveHomeOffer(v: HomeOffer) { return this.http.post<HomeOffer>('/api/admin/home-offers', v, { headers: this.headers() }); }
  deleteHomeOffer(id: number) { return this.http.delete(`/api/admin/home-offers/${id}`, { headers: this.headers() }); }

  homeHighlights(): Observable<HomeHighlight[]> { return this.http.get<HomeHighlight[]>('/api/admin/home-highlights', { headers: this.headers() }); }
  saveHomeHighlight(v: HomeHighlight) { return this.http.post<HomeHighlight>('/api/admin/home-highlights', v, { headers: this.headers() }); }
  deleteHomeHighlight(id: number) { return this.http.delete(`/api/admin/home-highlights/${id}`, { headers: this.headers() }); }

  homeVideos(): Observable<HomeVideo[]> { return this.http.get<HomeVideo[]>('/api/admin/home-videos', { headers: this.headers() }); }
  saveHomeVideo(v: HomeVideo) { return this.http.post<HomeVideo>('/api/admin/home-videos', v, { headers: this.headers() }); }
  deleteHomeVideo(id: number) { return this.http.delete(`/api/admin/home-videos/${id}`, { headers: this.headers() }); }

  servicePanels(): Observable<ServicePanel[]> { return this.http.get<ServicePanel[]>('/api/admin/service-panels', { headers: this.headers() }); }
  saveServicePanel(v: ServicePanel) { return this.http.post<ServicePanel>('/api/admin/service-panels', v, { headers: this.headers() }); }
  deleteServicePanel(id: number) { return this.http.delete(`/api/admin/service-panels/${id}`, { headers: this.headers() }); }

  servicePromises(): Observable<ServicePromise[]> { return this.http.get<ServicePromise[]>('/api/admin/service-promises', { headers: this.headers() }); }
  saveServicePromise(v: ServicePromise) { return this.http.post<ServicePromise>('/api/admin/service-promises', v, { headers: this.headers() }); }
  deleteServicePromise(id: number) { return this.http.delete(`/api/admin/service-promises/${id}`, { headers: this.headers() }); }

  careerPerks(): Observable<CareerPerk[]> { return this.http.get<CareerPerk[]>('/api/admin/career-perks', { headers: this.headers() }); }
  saveCareerPerk(v: CareerPerk) { return this.http.post<CareerPerk>('/api/admin/career-perks', v, { headers: this.headers() }); }
  deleteCareerPerk(id: number) { return this.http.delete(`/api/admin/career-perks/${id}`, { headers: this.headers() }); }

  aboutMilestones(): Observable<AboutMilestone[]> { return this.http.get<AboutMilestone[]>('/api/admin/about-milestones', { headers: this.headers() }); }
  saveAboutMilestone(v: AboutMilestone) { return this.http.post<AboutMilestone>('/api/admin/about-milestones', v, { headers: this.headers() }); }
  deleteAboutMilestone(id: number) { return this.http.delete(`/api/admin/about-milestones/${id}`, { headers: this.headers() }); }

  aboutBrands(): Observable<AboutBrand[]> { return this.http.get<AboutBrand[]>('/api/admin/about-brands', { headers: this.headers() }); }
  saveAboutBrand(v: AboutBrand) { return this.http.post<AboutBrand>('/api/admin/about-brands', v, { headers: this.headers() }); }
  deleteAboutBrand(id: number) { return this.http.delete(`/api/admin/about-brands/${id}`, { headers: this.headers() }); }

  saveTestimonial(t: Testimonial) { return this.http.post<Testimonial>('/api/admin/testimonials', t, { headers: this.headers() }); }
  deleteTestimonial(id: number) { return this.http.delete(`/api/admin/testimonials/${id}`, { headers: this.headers() }); }

  saveFaq(f: Faq) { return this.http.post<Faq>('/api/admin/faqs', f, { headers: this.headers() }); }
  deleteFaq(id: number) { return this.http.delete(`/api/admin/faqs/${id}`, { headers: this.headers() }); }

  settings(): Observable<Record<string, string>> { return this.http.get<Record<string, string>>('/api/settings', { headers: this.headers() }); }
  saveSettings(s: Record<string, string>) { return this.http.post<Record<string, string>>('/api/admin/settings', s, { headers: this.headers() }); }
  cacheInfo(): Observable<CacheInfo> { return this.http.get<CacheInfo>('/api/admin/cache', { headers: this.headers() }); }
  clearCache(): Observable<{ cleared: boolean; entries: number }> { return this.http.delete<{ cleared: boolean; entries: number }>('/api/admin/cache', { headers: this.headers() }); }
}
