import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API = '/api';

export interface Showroom { id?: number; name: string; address: string; lat: number; lng: number; phone: string; imageUrl: string; }
export interface GalleryImage { id?: number; url: string; caption: string; createdAt?: string; }
export interface ServiceItem { id?: number; title: string; category: string; description: string; }
export interface JobOpening { id?: number; title: string; department: string; location: string; description: string; active: boolean; }
export interface Lead { id?: number; name: string; phone: string; email: string; type: string; message: string; createdAt?: string; }
export interface JobApplication { id?: number; jobId: number; name: string; phone: string; email: string; resumeUrl?: string; resumeFilename?: string; resumeContentType?: string; resumeData?: string; note?: string; createdAt?: string; }
export interface Testimonial { id?: number; name: string; role: string; quote: string; rating?: number; createdAt?: string; }
export interface Faq { id?: number; question: string; answer: string; sortOrder?: number; }
export type StatIcon = 'store' | 'users' | 'award' | 'wrench' | 'bike' | 'map';
export interface SiteStat { icon: StatIcon; value: number; suffix?: string; label: string; }
export interface PageHero { id?: number; page: string; eyebrow: string; title: string; sub: string; imageUrl: string; videoUrl?: string; chips: string; }
export interface BrandItem { id?: number; name: string; sortOrder?: number; active?: boolean; }
export interface ProductCategory { id?: number; name: string; tag: string; accent: string; icon: string; imageUrl: string; description: string; specs: string; sortOrder?: number; active?: boolean; }
export interface HomeOffer { id?: number; title: string; tag: string; icon: string; text: string; imageUrl: string; link: string; sortOrder?: number; active?: boolean; }
export interface HomeHighlight { id?: number; icon: string; value: string; label: string; sortOrder?: number; active?: boolean; }
export interface HomeVideo { id?: number; youtubeId: string; title: string; tag: string; caption: string; sortOrder?: number; active?: boolean; }
export interface ServicePanel { id?: number; eyebrow: string; title: string; text: string; imageUrl: string; icon: string; ctaLabel: string; ctaLink: string; theme: string; sortOrder?: number; active?: boolean; }
export interface ServicePromise { id?: number; icon: string; label: string; text: string; sortOrder?: number; active?: boolean; }
export interface CareerPerk { id?: number; icon: string; label: string; text: string; sortOrder?: number; active?: boolean; }
export interface AboutMilestone { id?: number; yearLabel?: string; title: string; body?: string; sortOrder?: number; active?: boolean; }
export interface AboutBrand { id?: number; name: string; sortOrder?: number; active?: boolean; }

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  showrooms(): Observable<Showroom[]> { return this.http.get<Showroom[]>(`${API}/showrooms`); }
  gallery(): Observable<GalleryImage[]> { return this.http.get<GalleryImage[]>(`${API}/gallery`); }
  services(): Observable<ServiceItem[]> { return this.http.get<ServiceItem[]>(`${API}/services`); }
  jobs(): Observable<JobOpening[]> { return this.http.get<JobOpening[]>(`${API}/jobs`); }
  stats(): Observable<SiteStat[]> { return this.http.get<SiteStat[]>(`${API}/stats`); }
  pageHero(page: string): Observable<PageHero> { return this.http.get<PageHero>(`${API}/page-heroes/${page}`); }
  brands(): Observable<BrandItem[]> { return this.http.get<BrandItem[]>(`${API}/brands`); }
  productCategories(): Observable<ProductCategory[]> { return this.http.get<ProductCategory[]>(`${API}/product-categories`); }
  homeOffers(): Observable<HomeOffer[]> { return this.http.get<HomeOffer[]>(`${API}/home-offers`); }
  homeHighlights(): Observable<HomeHighlight[]> { return this.http.get<HomeHighlight[]>(`${API}/home-highlights`); }
  homeVideos(): Observable<HomeVideo[]> { return this.http.get<HomeVideo[]>(`${API}/home-videos`); }
  servicePanels(): Observable<ServicePanel[]> { return this.http.get<ServicePanel[]>(`${API}/service-panels`); }
  servicePromises(): Observable<ServicePromise[]> { return this.http.get<ServicePromise[]>(`${API}/service-promises`); }
  careerPerks(): Observable<CareerPerk[]> { return this.http.get<CareerPerk[]>(`${API}/career-perks`); }
  aboutMilestones(): Observable<AboutMilestone[]> { return this.http.get<AboutMilestone[]>(`${API}/about-milestones`); }
  aboutBrands(): Observable<AboutBrand[]> { return this.http.get<AboutBrand[]>(`${API}/about-brands`); }
  testimonials(): Observable<Testimonial[]> { return this.http.get<Testimonial[]>(`${API}/testimonials`); }
  faqs(): Observable<Faq[]> { return this.http.get<Faq[]>(`${API}/faqs`); }
  submitLead(l: Lead) { return this.http.post(`${API}/leads`, l); }
  applyJob(a: JobApplication) { return this.http.post(`${API}/applications`, a); }
}
