import { Component, inject, signal, OnInit, HostListener } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Observable, finalize } from 'rxjs';
import {
  LucideBriefcaseBusiness,
  LucideCalendarClock,
  LucideDownload,
  LucideFilter,
  LucideImages,
  LucideLayoutDashboard,
  LucideLogOut,
  LucideMail,
  LucideMapPin,
  LucidePhone,
  LucidePlus,
  LucideRefreshCw,
  LucideSave,
  LucideSearch,
  LucideSettings,
  LucideStore,
  LucideTrash2,
  LucideUser,
  LucideUsers,
  LucideWrench,
  LucideStar,
  LucideQuote
} from '@lucide/angular';
import { AdminApiService, CacheInfo, Reports } from '../../shared/admin-api.service';
import {
  ApiService, Showroom, GalleryImage, ServiceItem, JobOpening, Lead, JobApplication, Testimonial, Faq,
  PageHero, BrandItem, ProductCategory, HomeOffer, HomeHighlight, HomeVideo,
  ServicePanel, ServicePromise, CareerPerk, AboutMilestone, AboutBrand
} from '../../shared/api.service';
import { ToastService } from '../../shared/toast.service';
import { SettingsService } from '../../shared/settings.service';
import { WhatsappIconComponent } from '../../shared/whatsapp-icon.component';
import { BrandLogoComponent } from '../../shared/brand-logo.component';

type Tab = 'dashboard' | 'leads' | 'applications' | 'showrooms' | 'jobs' | 'gallery' | 'services' | 'testimonials' | 'faqs' | 'content' | 'cache' | 'settings';

/**
 * Reject empty AND whitespace-only values. nonBlank treats "   " as
 * valid, which let visually-blank rows (a name/title of just spaces) be saved.
 */
function nonBlank(control: AbstractControl): ValidationErrors | null {
  return (control.value ?? '').toString().trim().length ? null : { required: true };
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DatePipe,
    LucideBriefcaseBusiness,
    LucideCalendarClock,
    LucideDownload,
    LucideFilter,
    LucideImages,
    LucideLayoutDashboard,
    LucideLogOut,
    LucideMail,
    LucideMapPin,
    WhatsappIconComponent,
    LucidePhone,
    LucidePlus,
    LucideRefreshCw,
    LucideSave,
    LucideSearch,
    LucideSettings,
    LucideStore,
    LucideTrash2,
    LucideUser,
    LucideUsers,
    LucideWrench,
    LucideStar,
    LucideQuote,
    BrandLogoComponent
  ],
  template: `
  @if (!admin.loggedIn()) {
    <section class="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-kblue-900 px-4">
      <img src="assets/images/IMG_2785.webp" alt="" class="absolute inset-0 -z-20 h-full w-full object-cover opacity-35"/>
      <div class="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(30,112,173,0.30),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(6,161,84,0.18),transparent_36%),linear-gradient(135deg,rgba(7,6,4,0.98),rgba(31,29,26,0.84))]"></div>
      <form [formGroup]="loginForm" (ngSubmit)="login()" class="w-full max-w-md rounded-2xl border border-white/20 bg-white/[.94] p-8 shadow-2xl">
        <app-brand-logo [size]="46"/>
        <p class="mt-6 font-display text-2xl font-bold text-kblue-800">Admin command center</p>
        <p class="mt-1 text-sm text-ink/60">Manage leads, applications, showrooms, jobs, gallery, services and site settings.</p>
        <input formControlName="username" placeholder="Username" autocomplete="username" class="adm-in mt-6 w-full"/>
        <input formControlName="password" type="password" placeholder="Password" autocomplete="current-password" class="adm-in mt-3 w-full"/>
        <button type="submit" [disabled]="loginForm.invalid || busy()" class="btn-primary mt-6 w-full disabled:opacity-50">
          {{ busy() ? 'Signing in...' : 'Sign in' }}
        </button>
      </form>
    </section>
  } @else {
    <div class="min-h-screen bg-[#05161c] pt-24 lg:grid lg:grid-cols-[280px_1fr]">
      <aside class="hidden border-r border-kgreen-300/20 bg-[linear-gradient(180deg,rgba(31,29,26,0.96),rgba(7,6,4,0.98))] px-4 py-6 shadow-[18px_0_50px_rgba(0,0,0,0.24)] lg:block">
        <div class="sticky top-28">
          <app-brand-logo [size]="38"/>
          <p class="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-kgreen-300">Operations</p>
          <nav class="mt-3 space-y-1">
            @for (t of tabs; track t.id) {
              <button (click)="setTab(t.id)" class="admin-nav" [class.admin-nav-active]="tab() === t.id">
                @switch (t.id) {
                  @case ('dashboard') { <svg lucideLayoutDashboard class="h-4 w-4"></svg> }
                  @case ('leads') { <svg lucideUsers class="h-4 w-4"></svg> }
                  @case ('applications') { <svg lucideBriefcaseBusiness class="h-4 w-4"></svg> }
                  @case ('showrooms') { <svg lucideStore class="h-4 w-4"></svg> }
                  @case ('jobs') { <svg lucideUser class="h-4 w-4"></svg> }
                  @case ('gallery') { <svg lucideImages class="h-4 w-4"></svg> }
                  @case ('services') { <svg lucideWrench class="h-4 w-4"></svg> }
                  @case ('testimonials') { <svg lucideStar class="h-4 w-4"></svg> }
                  @case ('faqs') { <svg lucideQuote class="h-4 w-4"></svg> }
                  @case ('content') { <svg lucideImages class="h-4 w-4"></svg> }
                  @case ('cache') { <svg lucideRefreshCw class="h-4 w-4"></svg> }
                  @case ('settings') { <svg lucideSettings class="h-4 w-4"></svg> }
                }
                <span>{{ t.label }}</span>
              </button>
            }
          </nav>
          <button (click)="signOut()" class="mt-8 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-red-200 hover:bg-red-500/12">
            <svg lucideLogOut class="h-4 w-4"></svg>Sign out
          </button>
        </div>
      </aside>

      <main class="min-w-0 px-4 pb-16 sm:px-6 lg:px-8">
        <div class="adm-tabscroll mb-5 flex gap-2 overflow-x-auto pb-1 lg:hidden">
          @for (t of tabs; track t.id) {
              <button (click)="setTab(t.id)" class="shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition active:scale-95"
                [class.adm-chip-active]="tab() === t.id" [class.adm-chip]="tab() !== t.id">{{ t.label }}</button>
          }
        </div>

        <header class="mb-6 flex flex-col justify-between gap-4 rounded-lg border border-kgreen-300/20 bg-[#f4f1ea]/95 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.20)] sm:flex-row sm:items-center">
          <div>
            <p class="eyebrow">{{ tab() }}</p>
            <h1 class="mt-1 font-display text-3xl font-bold text-kblue-900">{{ tabTitle() }}</h1>
            @if (loading()) {
              <span class="mt-1.5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-kteal-600">
                <svg lucideRefreshCw class="h-3.5 w-3.5 animate-spin"></svg>Loading…
              </span>
            }
          </div>
          <div class="flex items-center gap-2.5">
            <button (click)="refreshActive()" [disabled]="loading()" class="btn-outline flex-1 disabled:opacity-50 sm:flex-none">
              <svg lucideRefreshCw class="mr-2 h-4 w-4" [class.animate-spin]="loading()"></svg>Refresh
            </button>
            <button (click)="signOut()" aria-label="Sign out"
              class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-red-300/40 bg-red-500/10 text-red-600 transition active:scale-95 lg:hidden">
              <svg lucideLogOut class="h-5 w-5"></svg>
            </button>
          </div>
        </header>

        @if (tab() === 'dashboard') {
          @if (reports(); as r) {
            <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <article class="admin-metric">
                <span class="admin-metric-icon bg-kteal-50 text-kteal-700"><svg lucideUsers class="h-5 w-5"></svg></span>
                <p class="text-sm text-ink/60">Total leads</p>
                <p class="mt-2 font-display text-4xl font-bold text-kblue-900">{{ r.totalLeads }}</p>
              </article>
              <article class="admin-metric">
                <span class="admin-metric-icon bg-kblue-50 text-kblue-700"><svg lucideCalendarClock class="h-5 w-5"></svg></span>
                <p class="text-sm text-ink/60">Leads last 7 days</p>
                <p class="mt-2 font-display text-4xl font-bold text-kblue-900">{{ r.leadsLast7Days }}</p>
              </article>
              <article class="admin-metric">
                <span class="admin-metric-icon bg-kgreen-100 text-kgreen-700"><svg lucideBriefcaseBusiness class="h-5 w-5"></svg></span>
                <p class="text-sm text-ink/60">Applications</p>
                <p class="mt-2 font-display text-4xl font-bold text-kblue-900">{{ r.totalApplications }}</p>
              </article>
              <article class="admin-metric">
                <span class="admin-metric-icon bg-white text-kblue-700"><svg lucideStore class="h-5 w-5"></svg></span>
                <p class="text-sm text-ink/60">Showrooms</p>
                <p class="mt-2 font-display text-4xl font-bold text-kblue-900">{{ r.showrooms }}</p>
              </article>
            </section>

            <section class="mt-6 grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
              <article class="card !p-6">
                <h2 class="font-display text-xl font-semibold">Leads by department</h2>
                <div class="mt-5 space-y-4">
                  @for (k of leadTypeKeys(r); track k) {
                    <div>
                      <div class="flex justify-between text-sm"><span class="font-semibold">{{ k }}</span><span>{{ r.leadsByType[k] }}</span></div>
                      <div class="mt-2 h-3 overflow-hidden rounded-full bg-kteal-100">
                        <div class="h-full rounded-full bg-gradient-to-r from-kteal-500 to-kblue-600" [style.width.%]="barWidth(r, k)"></div>
                      </div>
                    </div>
                  }
                  @if (!leadTypeKeys(r).length) { <p class="text-sm text-ink/50">No leads yet.</p> }
                </div>
              </article>

              <article class="card !p-6">
                <div class="flex items-center justify-between gap-4">
                  <h2 class="font-display text-xl font-semibold">Latest enquiries</h2>
                  <button (click)="setTab('leads')" class="text-sm font-bold text-kteal-700 hover:text-kteal-900">View all</button>
                </div>
                <div class="mt-5 space-y-3">
                  @for (l of recentLeads(); track l.id ?? $index) {
                    <div class="rounded-lg border border-ink/5 bg-kteal-50/50 p-4">
                      <div class="flex items-start justify-between gap-3">
                        <div>
                          <p class="font-display font-semibold">{{ l.name }}</p>
                          <p class="text-xs text-ink/50">{{ l.createdAt | date:'medium' }}</p>
                        </div>
                        <span class="rounded-full bg-white px-3 py-1 text-xs font-bold text-kblue-700">{{ l.type }}</span>
                      </div>
                      <div class="mt-3 flex gap-2">
                        <a [href]="callLink(l.phone)" class="icon-action bg-kblue-700 text-white" aria-label="Call"><svg lucidePhone class="h-4 w-4"></svg></a>
                        <a [href]="whatsAppLeadLink(l)" target="_blank" rel="noopener" class="icon-action bg-[#25D366] text-white" aria-label="WhatsApp"><app-whatsapp-icon className="h-4 w-4"/></a>
                        @if (l.email) {
                          <a [href]="emailLeadLink(l)" class="icon-action bg-white text-kblue-700" aria-label="Email"><svg lucideMail class="h-4 w-4"></svg></a>
                        }
                      </div>
                    </div>
                  }
                  @if (!recentLeads().length) { <p class="text-sm text-ink/50">No enquiries yet.</p> }
                </div>
              </article>
            </section>
          }
        }

        @if (tab() === 'leads') {
          <section class="card !p-5">
            <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <label class="relative block w-full lg:max-w-md">
                <svg lucideSearch class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40"></svg>
                <input [value]="leadSearch()" (input)="leadSearch.set($any($event.target).value)" placeholder="Search enquiries" class="adm-in adm-search w-full"/>
              </label>
              <div class="flex items-center gap-2 overflow-x-auto">
                <svg lucideFilter class="h-4 w-4 shrink-0 text-kteal-700"></svg>
                @for (type of leadFilterOptions(); track type) {
                  <button (click)="leadFilter.set(type)" class="shrink-0 rounded-full px-4 py-2 text-sm font-bold"
                    [class.bg-kblue-700]="leadFilter() === type" [class.text-white]="leadFilter() === type"
                    [class.bg-kteal-50]="leadFilter() !== type" [class.text-kteal-700]="leadFilter() !== type">
                    {{ type }}
                  </button>
                }
              </div>
            </div>
          </section>

          <section class="mt-5 grid gap-4 xl:grid-cols-2">
            @for (l of filteredLeads(); track l.id ?? $index) {
              <article class="lead-card">
                <div class="flex items-start justify-between gap-4">
                  <div class="flex min-w-0 gap-4">
                    <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-kblue-700 font-display font-bold text-white">{{ initials(l.name) }}</span>
                    <div class="min-w-0">
                      <div class="flex flex-wrap items-center gap-2">
                        <h2 class="font-display text-xl font-bold text-kblue-900">{{ l.name }}</h2>
                        <span class="rounded-full bg-kteal-50 px-3 py-1 text-xs font-bold text-kteal-700">{{ l.type }}</span>
                      </div>
                      <p class="mt-1 flex items-center gap-2 text-xs text-ink/50"><svg lucideCalendarClock class="h-3.5 w-3.5"></svg>{{ l.createdAt | date:'medium' }}</p>
                    </div>
                  </div>
                </div>

                <div class="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                  <a [href]="callLink(l.phone)" class="contact-line"><svg lucidePhone class="h-4 w-4"></svg>{{ l.phone }}</a>
                  @if (l.email) {
                    <a [href]="emailLeadLink(l)" class="contact-line"><svg lucideMail class="h-4 w-4"></svg>{{ l.email }}</a>
                  }
                </div>
                <p class="mt-5 rounded-lg bg-kteal-50 p-4 text-sm leading-6 text-ink/70">{{ l.message || 'No message provided.' }}</p>
                <div class="mt-5 flex flex-wrap gap-3">
                  <a [href]="callLink(l.phone)" class="admin-action bg-kblue-700 text-white"><svg lucidePhone class="h-4 w-4"></svg>Call</a>
                  <a [href]="whatsAppLeadLink(l)" target="_blank" rel="noopener" class="admin-action bg-[#25D366] text-white"><app-whatsapp-icon className="h-4 w-4"/>WhatsApp</a>
                  @if (l.email) {
                    <a [href]="emailLeadLink(l)" class="admin-action bg-white text-kblue-800 ring-1 ring-kblue-100"><svg lucideMail class="h-4 w-4"></svg>Email</a>
                  }
                </div>
              </article>
            }
            @if (!loading() && !filteredLeads().length) {
              <div class="card xl:col-span-2">No matching leads.</div>
            }
          </section>
        }

        @if (tab() === 'applications') {
          <section class="card !p-5">
            <label class="relative block w-full lg:max-w-md">
              <svg lucideSearch class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40"></svg>
              <input [value]="applicationSearch()" (input)="applicationSearch.set($any($event.target).value)" placeholder="Search applications" class="adm-in adm-search w-full"/>
            </label>
          </section>

          <section class="mt-5 grid gap-4 xl:grid-cols-2">
            @for (a of filteredApplications(); track a.id ?? $index) {
              <article class="lead-card">
                <div class="flex items-start justify-between gap-4">
                  <div class="flex gap-4">
                    <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-kgreen-600 font-display font-bold text-white">{{ initials(a.name) }}</span>
                    <div>
                      <h2 class="font-display text-xl font-bold text-kblue-900">{{ a.name }}</h2>
                      <p class="mt-1 text-sm font-semibold text-kteal-700">Job ID #{{ a.jobId }}</p>
                      <p class="mt-1 flex items-center gap-2 text-xs text-ink/50"><svg lucideCalendarClock class="h-3.5 w-3.5"></svg>{{ a.createdAt | date:'medium' }}</p>
                    </div>
                  </div>
                </div>
                <div class="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                  <a [href]="callLink(a.phone)" class="contact-line"><svg lucidePhone class="h-4 w-4"></svg>{{ a.phone }}</a>
                  <a [href]="emailApplicationLink(a)" class="contact-line"><svg lucideMail class="h-4 w-4"></svg>{{ a.email }}</a>
                </div>
                <p class="mt-5 rounded-lg bg-kteal-50 p-4 text-sm leading-6 text-ink/70">{{ a.note || 'No note provided.' }}</p>
                <div class="mt-5 flex flex-wrap gap-3">
                  @if (a.resumeFilename) {
                    <button (click)="downloadCv(a)" class="admin-action bg-kteal-600 text-white"><svg lucideDownload class="h-4 w-4"></svg>Download CV</button>
                  }
                  <a [href]="callLink(a.phone)" class="admin-action bg-kblue-700 text-white"><svg lucidePhone class="h-4 w-4"></svg>Call</a>
                  <a [href]="whatsAppApplicationLink(a)" target="_blank" rel="noopener" class="admin-action bg-[#25D366] text-white"><app-whatsapp-icon className="h-4 w-4"/>WhatsApp</a>
                  <a [href]="emailApplicationLink(a)" class="admin-action bg-white text-kblue-800 ring-1 ring-kblue-100"><svg lucideMail class="h-4 w-4"></svg>Email</a>
                </div>
              </article>
            }
            @if (!loading() && !filteredApplications().length) {
              <div class="card xl:col-span-2">No matching applications.</div>
            }
          </section>
        }

        @if (tab() === 'showrooms') {
          <section class="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
            <form [formGroup]="storeForm" (ngSubmit)="saveStore()" class="card grid gap-3 !p-6 lg:sticky lg:top-28 lg:self-start"
                  [class.ring-2]="editingStore() !== null" [class.ring-kteal-400]="editingStore() !== null">
              <div class="flex items-center justify-between">
                <h2 class="font-display text-xl font-bold">{{ editingStore() ? 'Edit showroom' : 'Add showroom' }}</h2>
                @if (editingStore()) { <span class="rounded-full bg-kteal-50 px-3 py-1 text-xs font-bold text-kteal-700">Editing</span> }
              </div>
              <input formControlName="name" placeholder="Store name *" class="adm-in"/>
              <input formControlName="phone" placeholder="Phone (+91...) *" class="adm-in"/>
              <input formControlName="address" placeholder="Address *" class="adm-in"/>
              <div class="grid gap-3 sm:grid-cols-2">
                <input formControlName="lat" type="number" step="any" placeholder="Latitude *" class="adm-in"/>
                <input formControlName="lng" type="number" step="any" placeholder="Longitude *" class="adm-in"/>
              </div>
              <input formControlName="imageUrl" placeholder="Image URL (optional)" class="adm-in"/>
              <div class="flex flex-wrap gap-2">
                <button type="submit" [disabled]="storeForm.invalid" class="btn-primary w-fit disabled:opacity-50">
                  @if (editingStore()) { <svg lucideSave class="mr-2 h-4 w-4"></svg>Update } @else { <svg lucidePlus class="mr-2 h-4 w-4"></svg>Add showroom }
                </button>
                @if (editingStore()) { <button type="button" (click)="cancelStore()" class="btn-outline w-fit">Cancel</button> }
              </div>
            </form>
            <div class="grid gap-4 md:grid-cols-2">
              @for (s of showrooms(); track s.id ?? $index) {
                <article class="card !p-5" [class.ring-2]="editingStore() === s.id" [class.ring-kteal-400]="editingStore() === s.id">
                  <p class="font-display text-lg font-semibold">{{ s.name }}</p>
                  <p class="mt-2 flex gap-2 text-sm leading-6 text-ink/60"><svg lucideMapPin class="mt-1 h-4 w-4 shrink-0 text-kteal-700"></svg>{{ s.address }}</p>
                  <p class="mt-1 text-xs text-ink/45">{{ s.phone }} · {{ s.lat }}, {{ s.lng }}</p>
                  <div class="mt-4 flex flex-wrap gap-2">
                    <button (click)="editStore(s)" class="admin-action bg-kteal-50 text-kteal-700 ring-1 ring-kteal-100"><svg lucideSave class="h-4 w-4"></svg>Edit</button>
                    <a [href]="callLink(s.phone)" class="icon-action bg-kblue-700 text-white"><svg lucidePhone class="h-4 w-4"></svg></a>
                    <a [href]="whatsAppPhoneLink(s.phone, 'Hi Kallingal, I need showroom assistance')" target="_blank" rel="noopener" class="icon-action bg-[#25D366] text-white"><app-whatsapp-icon className="h-4 w-4"/></a>
                    <button (click)="deleteStore(s)" class="icon-action bg-red-50 text-red-600"><svg lucideTrash2 class="h-4 w-4"></svg></button>
                  </div>
                </article>
              }
              @if (!loading() && !showrooms().length) { <div class="card text-sm text-ink/50 md:col-span-2">No showrooms yet. Add your first one.</div> }
            </div>
          </section>
        }

        @if (tab() === 'jobs') {
          <section class="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
            <form [formGroup]="jobForm" (ngSubmit)="saveJob()" class="card grid gap-3 !p-6 lg:sticky lg:top-28 lg:self-start"
                  [class.ring-2]="editingJob() !== null" [class.ring-kteal-400]="editingJob() !== null">
              <div class="flex items-center justify-between">
                <h2 class="font-display text-xl font-bold">{{ editingJob() ? 'Edit opening' : 'Post opening' }}</h2>
                @if (editingJob()) { <span class="rounded-full bg-kteal-50 px-3 py-1 text-xs font-bold text-kteal-700">Editing</span> }
              </div>
              <input formControlName="title" placeholder="Job title *" class="adm-in"/>
              <input formControlName="department" placeholder="Department *" class="adm-in"/>
              <input formControlName="location" placeholder="Location *" class="adm-in"/>
              <textarea formControlName="description" rows="3" placeholder="Description" class="adm-in"></textarea>
              <div class="flex flex-wrap gap-2">
                <button type="submit" [disabled]="jobForm.invalid" class="btn-primary w-fit disabled:opacity-50">
                  @if (editingJob()) { <svg lucideSave class="mr-2 h-4 w-4"></svg>Update } @else { <svg lucidePlus class="mr-2 h-4 w-4"></svg>Post job }
                </button>
                @if (editingJob()) { <button type="button" (click)="cancelJob()" class="btn-outline w-fit">Cancel</button> }
              </div>
            </form>
            <div class="grid gap-4 md:grid-cols-2">
              @for (j of jobs(); track j.id ?? $index) {
                <article class="card !p-5" [class.ring-2]="editingJob() === j.id" [class.ring-kteal-400]="editingJob() === j.id">
                  <p class="eyebrow">{{ j.department }}</p>
                  <p class="mt-2 font-display text-lg font-semibold">{{ j.title }}</p>
                  <p class="mt-1 text-sm text-ink/60">{{ j.location }}</p>
                  <p class="mt-3 text-sm leading-6 text-ink/70">{{ j.description }}</p>
                  <div class="mt-4 flex flex-wrap gap-2">
                    <button (click)="editJob(j)" class="admin-action bg-kteal-50 text-kteal-700 ring-1 ring-kteal-100"><svg lucideSave class="h-4 w-4"></svg>Edit</button>
                    <button (click)="deleteJob(j)" class="admin-action bg-red-50 text-red-600"><svg lucideTrash2 class="h-4 w-4"></svg>Close role</button>
                  </div>
                </article>
              }
              @if (!loading() && !jobs().length) { <div class="card text-sm text-ink/50 md:col-span-2">No openings yet. Post your first role.</div> }
            </div>
          </section>
        }

        @if (tab() === 'gallery') {
          <section class="card !p-6" [class.ring-2]="editingGallery() !== null" [class.ring-kteal-400]="editingGallery() !== null">
            <div class="mb-3 flex items-center justify-between">
              <h2 class="font-display text-lg font-bold">{{ editingGallery() ? 'Edit image' : 'Add image' }}</h2>
              @if (editingGallery()) { <button type="button" (click)="cancelImage()" class="text-sm font-bold text-ink/50 hover:text-ink">Cancel</button> }
            </div>
            <form [formGroup]="galleryForm" (ngSubmit)="saveImage()" class="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
              <input formControlName="url" placeholder="Image URL *" class="adm-in"/>
              <input formControlName="caption" placeholder="Caption" class="adm-in"/>
              <button type="submit" [disabled]="galleryForm.invalid" class="btn-primary disabled:opacity-50">
                @if (editingGallery()) { <svg lucideSave class="mr-2 h-4 w-4"></svg>Update } @else { <svg lucidePlus class="mr-2 h-4 w-4"></svg>Add }
              </button>
            </form>
          </section>
          <section class="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
            @for (g of galleryImages(); track g.id ?? $index) {
              <article class="group relative overflow-hidden rounded-lg shadow-lg" [class.ring-2]="editingGallery() === g.id" [class.ring-kteal-400]="editingGallery() === g.id">
                <img [src]="g.url" [alt]="g.caption" class="h-40 w-full object-cover"/>
                <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-kblue-900/90 to-transparent p-3 pt-10 text-sm font-semibold text-white">{{ g.caption }}</div>
                <div class="absolute right-2 top-2 flex gap-2 opacity-0 transition group-hover:opacity-100">
                  <button (click)="editImage(g)" class="flex h-9 w-9 items-center justify-center rounded-full bg-white text-kblue-800 shadow"><svg lucideSave class="h-4 w-4"></svg></button>
                  <button (click)="deleteImage(g)" class="flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-white shadow"><svg lucideTrash2 class="h-4 w-4"></svg></button>
                </div>
              </article>
            }
            @if (!loading() && !galleryImages().length) { <div class="card col-span-2 text-sm text-ink/50 md:col-span-4">No images yet. Add image URLs above.</div> }
          </section>
        }

        @if (tab() === 'services') {
          <section class="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
            <form [formGroup]="serviceForm" (ngSubmit)="saveSvc()" class="card grid gap-3 !p-6 lg:sticky lg:top-28 lg:self-start"
                  [class.ring-2]="editingService() !== null" [class.ring-kteal-400]="editingService() !== null">
              <div class="flex items-center justify-between">
                <h2 class="font-display text-xl font-bold">{{ editingService() ? 'Edit service' : 'Add service' }}</h2>
                @if (editingService()) { <span class="rounded-full bg-kteal-50 px-3 py-1 text-xs font-bold text-kteal-700">Editing</span> }
              </div>
              <input formControlName="title" placeholder="Title *" class="adm-in"/>
              <input formControlName="category" placeholder="Category *" class="adm-in"/>
              <textarea formControlName="description" rows="3" placeholder="Description" class="adm-in"></textarea>
              <div class="flex flex-wrap gap-2">
                <button type="submit" [disabled]="serviceForm.invalid" class="btn-primary w-fit disabled:opacity-50">
                  @if (editingService()) { <svg lucideSave class="mr-2 h-4 w-4"></svg>Update } @else { <svg lucidePlus class="mr-2 h-4 w-4"></svg>Add service }
                </button>
                @if (editingService()) { <button type="button" (click)="cancelSvc()" class="btn-outline w-fit">Cancel</button> }
              </div>
            </form>
            <div class="grid gap-4 md:grid-cols-2">
              @for (s of serviceItems(); track s.id ?? $index) {
                <article class="card !p-5" [class.ring-2]="editingService() === s.id" [class.ring-kteal-400]="editingService() === s.id">
                  <p class="eyebrow">{{ s.category }}</p>
                  <p class="mt-2 font-display text-lg font-semibold">{{ s.title }}</p>
                  <p class="mt-3 text-sm leading-6 text-ink/70">{{ s.description }}</p>
                  <div class="mt-4 flex flex-wrap gap-2">
                    <button (click)="editSvc(s)" class="admin-action bg-kteal-50 text-kteal-700 ring-1 ring-kteal-100"><svg lucideSave class="h-4 w-4"></svg>Edit</button>
                    <button (click)="deleteSvc(s)" class="admin-action bg-red-50 text-red-600"><svg lucideTrash2 class="h-4 w-4"></svg>Delete</button>
                  </div>
                </article>
              }
              @if (!loading() && !serviceItems().length) { <div class="card text-sm text-ink/50 md:col-span-2">No services yet. Add your first one.</div> }
            </div>
          </section>
        }

        @if (tab() === 'testimonials') {
          <section class="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
            <form [formGroup]="testimonialForm" (ngSubmit)="saveTestimonial()" class="card grid gap-3 !p-6 lg:sticky lg:top-28 lg:self-start"
                  [class.ring-2]="editingTestimonial() !== null" [class.ring-kteal-400]="editingTestimonial() !== null">
              <div class="flex items-center justify-between">
                <h2 class="font-display text-xl font-bold">{{ editingTestimonial() ? 'Edit testimonial' : 'Add testimonial' }}</h2>
                @if (editingTestimonial()) { <span class="rounded-full bg-kteal-50 px-3 py-1 text-xs font-bold text-kteal-700">Editing</span> }
              </div>
              <input formControlName="name" placeholder="Customer name *" class="adm-in"/>
              <input formControlName="role" placeholder="Role (e.g. Pulsar owner · Trivandrum)" class="adm-in"/>
              <textarea formControlName="quote" rows="4" placeholder="Quote *" class="adm-in"></textarea>
              <label class="text-sm font-semibold text-ink/70">Rating
                <select formControlName="rating" class="adm-in mt-1 w-full">
                  @for (n of [5,4,3,2,1]; track n) { <option [ngValue]="n">{{ n }} stars</option> }
                </select>
              </label>
              <div class="flex flex-wrap gap-2">
                <button type="submit" [disabled]="testimonialForm.invalid" class="btn-primary w-fit disabled:opacity-50">
                  @if (editingTestimonial()) { <svg lucideSave class="mr-2 h-4 w-4"></svg>Update } @else { <svg lucidePlus class="mr-2 h-4 w-4"></svg>Add }
                </button>
                @if (editingTestimonial()) { <button type="button" (click)="cancelTestimonial()" class="btn-outline w-fit">Cancel</button> }
              </div>
            </form>
            <div class="grid gap-4 md:grid-cols-2">
              @for (t of testimonialsList(); track t.id ?? $index) {
                <article class="card !p-5" [class.ring-2]="editingTestimonial() === t.id" [class.ring-kteal-400]="editingTestimonial() === t.id">
                  <div class="flex gap-0.5 text-kgreen-500">
                    @for (s of [].constructor(t.rating || 5); track $index) { <svg lucideStar class="h-4 w-4 fill-current"></svg> }
                  </div>
                  <p class="mt-3 text-sm leading-6 text-ink/70">"{{ t.quote }}"</p>
                  <p class="mt-3 font-display font-bold text-kblue-900">{{ t.name }}</p>
                  <p class="text-xs text-ink/50">{{ t.role }}</p>
                  <div class="mt-4 flex flex-wrap gap-2">
                    <button (click)="editTestimonial(t)" class="admin-action bg-kteal-50 text-kteal-700 ring-1 ring-kteal-100"><svg lucideSave class="h-4 w-4"></svg>Edit</button>
                    <button (click)="deleteTestimonial(t)" class="admin-action bg-red-50 text-red-600"><svg lucideTrash2 class="h-4 w-4"></svg>Delete</button>
                  </div>
                </article>
              }
              @if (!loading() && !testimonialsList().length) { <div class="card text-sm text-ink/50 md:col-span-2">No testimonials yet. Add your first one.</div> }
            </div>
          </section>
        }

        @if (tab() === 'faqs') {
          <section class="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
            <form [formGroup]="faqForm" (ngSubmit)="saveFaq()" class="card grid gap-3 !p-6 lg:sticky lg:top-28 lg:self-start"
                  [class.ring-2]="editingFaq() !== null" [class.ring-kteal-400]="editingFaq() !== null">
              <div class="flex items-center justify-between">
                <h2 class="font-display text-xl font-bold">{{ editingFaq() ? 'Edit FAQ' : 'Add FAQ' }}</h2>
                @if (editingFaq()) { <span class="rounded-full bg-kteal-50 px-3 py-1 text-xs font-bold text-kteal-700">Editing</span> }
              </div>
              <input formControlName="question" placeholder="Question *" class="adm-in"/>
              <textarea formControlName="answer" rows="4" placeholder="Answer *" class="adm-in"></textarea>
              <input formControlName="sortOrder" type="number" placeholder="Sort order" class="adm-in"/>
              <div class="flex flex-wrap gap-2">
                <button type="submit" [disabled]="faqForm.invalid" class="btn-primary w-fit disabled:opacity-50">
                  @if (editingFaq()) { <svg lucideSave class="mr-2 h-4 w-4"></svg>Update } @else { <svg lucidePlus class="mr-2 h-4 w-4"></svg>Add }
                </button>
                @if (editingFaq()) { <button type="button" (click)="cancelFaq()" class="btn-outline w-fit">Cancel</button> }
              </div>
            </form>
            <div class="grid gap-4">
              @for (f of faqsList(); track f.id ?? $index) {
                <article class="card !p-5" [class.ring-2]="editingFaq() === f.id" [class.ring-kteal-400]="editingFaq() === f.id">
                  <div class="flex items-start justify-between gap-3">
                    <p class="font-display text-lg font-semibold text-kblue-900">{{ f.question }}</p>
                    <span class="shrink-0 rounded-full bg-kteal-50 px-2.5 py-1 text-xs font-bold text-kteal-700">#{{ f.sortOrder }}</span>
                  </div>
                  <p class="mt-2 text-sm leading-6 text-ink/70">{{ f.answer }}</p>
                  <div class="mt-4 flex flex-wrap gap-2">
                    <button (click)="editFaq(f)" class="admin-action bg-kteal-50 text-kteal-700 ring-1 ring-kteal-100"><svg lucideSave class="h-4 w-4"></svg>Edit</button>
                    <button (click)="deleteFaq(f)" class="admin-action bg-red-50 text-red-600"><svg lucideTrash2 class="h-4 w-4"></svg>Delete</button>
                  </div>
                </article>
              }
              @if (!loading() && !faqsList().length) { <div class="card text-sm text-ink/50">No FAQs yet. Add your first one.</div> }
            </div>
          </section>
        }

        @if (tab() === 'content') {
          <section class="space-y-5">
            <article class="card !p-6">
              <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p class="eyebrow">Backend controlled</p>
                  <h2 class="font-display text-2xl font-bold text-kblue-900">Site content library</h2>
                  <p class="mt-1 text-sm text-ink/60">Manage every public page block from the admin panel. Saving any item clears the site cache.</p>
                </div>
                <button (click)="clearCache()" type="button" class="btn-outline w-fit"><svg lucideRefreshCw class="mr-2 h-4 w-4"></svg>Clear cache</button>
              </div>
            </article>

            <section class="content-block">
              <form [formGroup]="pageHeroForm" (ngSubmit)="savePageHero()" class="content-form">
                <h3 class="content-title">{{ editingPageHero() ? 'Edit page hero' : 'Add page hero' }}</h3>
                <div class="grid gap-3 sm:grid-cols-2">
                  <input formControlName="page" placeholder="Page key (home, products...) *" class="adm-in"/>
                  <input formControlName="eyebrow" placeholder="Eyebrow" class="adm-in"/>
                </div>
                <input formControlName="title" placeholder="Hero title *" class="adm-in"/>
                <textarea formControlName="sub" rows="3" placeholder="Hero subtitle" class="adm-in"></textarea>
                <div class="grid gap-3 sm:grid-cols-2">
                  <input formControlName="imageUrl" placeholder="Background image URL" class="adm-in"/>
                  <input formControlName="videoUrl" placeholder="Optional video URL" class="adm-in"/>
                </div>
                <input formControlName="chips" placeholder="Chips, comma separated" class="adm-in"/>
                <div class="flex flex-wrap gap-2">
                  <button type="submit" [disabled]="pageHeroForm.invalid" class="btn-primary disabled:opacity-50"><svg lucideSave class="mr-2 h-4 w-4"></svg>{{ editingPageHero() ? 'Update hero' : 'Save hero' }}</button>
                  @if (editingPageHero()) { <button type="button" (click)="cancelPageHero()" class="btn-outline">Cancel</button> }
                </div>
              </form>
              <div class="content-list">
                @for (h of pageHeroes(); track h.id ?? h.page) {
                  <article class="content-card" [class.ring-2]="editingPageHero() === h.id" [class.ring-kteal-400]="editingPageHero() === h.id">
                    <img [src]="h.imageUrl" [alt]="h.title" class="h-24 w-full rounded-lg object-cover"/>
                    <p class="eyebrow mt-3">{{ h.page }}</p>
                    <h4 class="font-display text-lg font-bold text-kblue-900">{{ h.title }}</h4>
                    <p class="mt-1 line-clamp-2 text-sm text-ink/60">{{ h.sub }}</p>
                    <div class="mt-4 flex flex-wrap gap-2">
                      <button (click)="editPageHero(h)" class="admin-action bg-kteal-50 text-kteal-700 ring-1 ring-kteal-100"><svg lucideSave class="h-4 w-4"></svg>Edit</button>
                      <button (click)="deletePageHero(h)" class="icon-action bg-red-50 text-red-600"><svg lucideTrash2 class="h-4 w-4"></svg></button>
                    </div>
                  </article>
                }
              </div>
            </section>

            <section class="content-block">
              <form [formGroup]="brandForm" (ngSubmit)="saveBrand()" class="content-form">
                <h3 class="content-title">{{ editingBrand() ? 'Edit brand' : 'Add brand' }}</h3>
                <input formControlName="name" placeholder="Brand name *" class="adm-in"/>
                <div class="grid gap-3 sm:grid-cols-2">
                  <input formControlName="sortOrder" type="number" placeholder="Sort order" class="adm-in"/>
                  <label class="admin-toggle"><input type="checkbox" formControlName="active"/> Active</label>
                </div>
                <div class="flex flex-wrap gap-2">
                  <button type="submit" [disabled]="brandForm.invalid" class="btn-primary disabled:opacity-50"><svg lucideSave class="mr-2 h-4 w-4"></svg>{{ editingBrand() ? 'Update brand' : 'Save brand' }}</button>
                  @if (editingBrand()) { <button type="button" (click)="cancelBrand()" class="btn-outline">Cancel</button> }
                </div>
              </form>
              <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                @for (b of brandItems(); track b.id ?? b.name) {
                  <article class="content-card">
                    <div class="flex items-start justify-between gap-3">
                      <p class="font-display text-lg font-bold text-kblue-900">{{ b.name }}</p>
                      <span class="rounded-full px-2.5 py-1 text-xs font-bold" [class.bg-kgreen-100]="b.active !== false" [class.text-kgreen-700]="b.active !== false" [class.bg-red-50]="b.active === false" [class.text-red-600]="b.active === false">{{ b.active === false ? 'Hidden' : 'Live' }}</span>
                    </div>
                    <p class="mt-1 text-xs text-ink/50">Order #{{ b.sortOrder ?? 0 }}</p>
                    <div class="mt-4 flex flex-wrap gap-2">
                      <button (click)="editBrand(b)" class="admin-action bg-kteal-50 text-kteal-700 ring-1 ring-kteal-100"><svg lucideSave class="h-4 w-4"></svg>Edit</button>
                      <button (click)="deleteBrand(b)" class="icon-action bg-red-50 text-red-600"><svg lucideTrash2 class="h-4 w-4"></svg></button>
                    </div>
                  </article>
                }
              </div>
            </section>

            <section class="content-block">
              <form [formGroup]="milestoneForm" (ngSubmit)="saveMilestone()" class="content-form">
                <h3 class="content-title">{{ editingMilestone() ? 'Edit milestone' : 'Add legacy milestone' }}</h3>
                <div class="grid gap-3 sm:grid-cols-2">
                  <input formControlName="yearLabel" placeholder="Year label (e.g. 1992, 25+ years)" class="adm-in"/>
                  <input formControlName="title" placeholder="Title *" class="adm-in"/>
                </div>
                <textarea formControlName="body" rows="3" placeholder="Description" class="adm-in"></textarea>
                <div class="grid gap-3 sm:grid-cols-2">
                  <input formControlName="sortOrder" type="number" placeholder="Sort order" class="adm-in"/>
                  <label class="admin-toggle"><input type="checkbox" formControlName="active"/> Active</label>
                </div>
                <div class="flex flex-wrap gap-2">
                  <button type="submit" [disabled]="milestoneForm.invalid" class="btn-primary disabled:opacity-50"><svg lucideSave class="mr-2 h-4 w-4"></svg>{{ editingMilestone() ? 'Update milestone' : 'Save milestone' }}</button>
                  @if (editingMilestone()) { <button type="button" (click)="cancelMilestone()" class="btn-outline">Cancel</button> }
                </div>
              </form>
              <div class="content-list">
                @for (m of aboutMilestones(); track m.id ?? m.title) {
                  <article class="content-card" [class.ring-2]="editingMilestone() === m.id" [class.ring-kteal-400]="editingMilestone() === m.id">
                    <div class="flex items-start justify-between gap-3">
                      <div>
                        @if (m.yearLabel) { <p class="eyebrow">{{ m.yearLabel }}</p> }
                        <h4 class="font-display text-lg font-bold text-kblue-900">{{ m.title }}</h4>
                      </div>
                      <span class="rounded-full px-2.5 py-1 text-xs font-bold" [class.bg-kgreen-100]="m.active !== false" [class.text-kgreen-700]="m.active !== false" [class.bg-red-50]="m.active === false" [class.text-red-600]="m.active === false">{{ m.active === false ? 'Hidden' : 'Live' }}</span>
                    </div>
                    <p class="mt-1 line-clamp-2 text-sm text-ink/60">{{ m.body }}</p>
                    <p class="mt-1 text-xs text-ink/50">Order #{{ m.sortOrder ?? 0 }}</p>
                    <div class="mt-4 flex flex-wrap gap-2">
                      <button (click)="editMilestone(m)" class="admin-action bg-kteal-50 text-kteal-700 ring-1 ring-kteal-100"><svg lucideSave class="h-4 w-4"></svg>Edit</button>
                      <button (click)="deleteMilestone(m)" class="icon-action bg-red-50 text-red-600"><svg lucideTrash2 class="h-4 w-4"></svg></button>
                    </div>
                  </article>
                }
              </div>
            </section>

            <section class="content-block">
              <form [formGroup]="aboutBrandForm" (ngSubmit)="saveAboutBrand()" class="content-form">
                <h3 class="content-title">{{ editingAboutBrand() ? 'Edit About brand' : 'Add About-page brand' }}</h3>
                <input formControlName="name" placeholder="Partner brand name *" class="adm-in"/>
                <input formControlName="logoUrl" placeholder="Logo URL or path (optional)" class="adm-in"/>
                <p class="-mt-1 text-xs text-ink/50">Leave blank to auto-use <code>assets/brand/logos/&lt;name&gt;.png</code>; falls back to the brand name if no image is found.</p>
                <div class="grid gap-3 sm:grid-cols-2">
                  <input formControlName="sortOrder" type="number" placeholder="Sort order" class="adm-in"/>
                  <label class="admin-toggle"><input type="checkbox" formControlName="active"/> Active</label>
                </div>
                <div class="flex flex-wrap gap-2">
                  <button type="submit" [disabled]="aboutBrandForm.invalid" class="btn-primary disabled:opacity-50"><svg lucideSave class="mr-2 h-4 w-4"></svg>{{ editingAboutBrand() ? 'Update brand' : 'Save brand' }}</button>
                  @if (editingAboutBrand()) { <button type="button" (click)="cancelAboutBrand()" class="btn-outline">Cancel</button> }
                </div>
              </form>
              <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                @for (b of aboutBrandsList(); track b.id ?? b.name) {
                  <article class="content-card">
                    <div class="flex items-start justify-between gap-3">
                      <p class="font-display text-lg font-bold text-kblue-900">{{ b.name }}</p>
                      <span class="rounded-full px-2.5 py-1 text-xs font-bold" [class.bg-kgreen-100]="b.active !== false" [class.text-kgreen-700]="b.active !== false" [class.bg-red-50]="b.active === false" [class.text-red-600]="b.active === false">{{ b.active === false ? 'Hidden' : 'Live' }}</span>
                    </div>
                    <p class="mt-1 text-xs text-ink/50">Order #{{ b.sortOrder ?? 0 }}</p>
                    <div class="mt-4 flex flex-wrap gap-2">
                      <button (click)="editAboutBrand(b)" class="admin-action bg-kteal-50 text-kteal-700 ring-1 ring-kteal-100"><svg lucideSave class="h-4 w-4"></svg>Edit</button>
                      <button (click)="deleteAboutBrand(b)" class="icon-action bg-red-50 text-red-600"><svg lucideTrash2 class="h-4 w-4"></svg></button>
                    </div>
                  </article>
                }
              </div>
            </section>

            <section class="content-block">
              <form [formGroup]="productCategoryForm" (ngSubmit)="saveProductCategory()" class="content-form">
                <h3 class="content-title">{{ editingProductCategory() ? 'Edit product category' : 'Add product category' }}</h3>
                <div class="grid gap-3 sm:grid-cols-2">
                  <input formControlName="name" placeholder="Category name *" class="adm-in"/>
                  <input formControlName="tag" placeholder="Tag" class="adm-in"/>
                  <input formControlName="accent" placeholder="Accent color" class="adm-in"/>
                  <input formControlName="icon" placeholder="Icon key" class="adm-in"/>
                </div>
                <input formControlName="imageUrl" placeholder="Image URL" class="adm-in"/>
                <textarea formControlName="description" rows="3" placeholder="Description" class="adm-in"></textarea>
                <input formControlName="specs" placeholder="Specs, comma separated" class="adm-in"/>
                <div class="grid gap-3 sm:grid-cols-2">
                  <input formControlName="sortOrder" type="number" placeholder="Sort order" class="adm-in"/>
                  <label class="admin-toggle"><input type="checkbox" formControlName="active"/> Active</label>
                </div>
                <div class="flex flex-wrap gap-2">
                  <button type="submit" [disabled]="productCategoryForm.invalid" class="btn-primary disabled:opacity-50"><svg lucideSave class="mr-2 h-4 w-4"></svg>{{ editingProductCategory() ? 'Update category' : 'Save category' }}</button>
                  @if (editingProductCategory()) { <button type="button" (click)="cancelProductCategory()" class="btn-outline">Cancel</button> }
                </div>
              </form>
              <div class="content-list">
                @for (p of productCategories(); track p.id ?? p.name) {
                  <article class="content-card">
                    <img [src]="p.imageUrl" [alt]="p.name" class="h-28 w-full rounded-lg object-cover"/>
                    <p class="eyebrow mt-3">{{ p.tag }}</p>
                    <h4 class="font-display text-lg font-bold text-kblue-900">{{ p.name }}</h4>
                    <p class="mt-1 line-clamp-2 text-sm text-ink/60">{{ p.description }}</p>
                    <div class="mt-4 flex flex-wrap gap-2">
                      <button (click)="editProductCategory(p)" class="admin-action bg-kteal-50 text-kteal-700 ring-1 ring-kteal-100"><svg lucideSave class="h-4 w-4"></svg>Edit</button>
                      <button (click)="deleteProductCategory(p)" class="icon-action bg-red-50 text-red-600"><svg lucideTrash2 class="h-4 w-4"></svg></button>
                    </div>
                  </article>
                }
              </div>
            </section>

            <section class="grid gap-5 xl:grid-cols-3">
              <form [formGroup]="homeOfferForm" (ngSubmit)="saveHomeOffer()" class="content-form">
                <h3 class="content-title">{{ editingHomeOffer() ? 'Edit home offer' : 'Add home offer' }}</h3>
                <input formControlName="title" placeholder="Title *" class="adm-in"/>
                <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                  <input formControlName="tag" placeholder="Tag" class="adm-in"/>
                  <input formControlName="icon" placeholder="Icon key" class="adm-in"/>
                </div>
                <textarea formControlName="text" rows="3" placeholder="Text" class="adm-in"></textarea>
                <input formControlName="imageUrl" placeholder="Image URL" class="adm-in"/>
                <input formControlName="link" placeholder="CTA link" class="adm-in"/>
                <input formControlName="sortOrder" type="number" placeholder="Sort order" class="adm-in"/>
                <label class="admin-toggle"><input type="checkbox" formControlName="active"/> Active</label>
                <div class="flex flex-wrap gap-2">
                  <button type="submit" [disabled]="homeOfferForm.invalid || busy()" class="btn-primary disabled:opacity-50"><svg lucideSave class="mr-2 h-4 w-4"></svg>{{ editingHomeOffer() ? 'Update offer' : 'Save offer' }}</button>
                  @if (editingHomeOffer()) { <button type="button" (click)="cancelHomeOffer()" class="btn-outline">Cancel</button> }
                </div>
              </form>

              <form [formGroup]="homeHighlightForm" (ngSubmit)="saveHomeHighlight()" class="content-form">
                <h3 class="content-title">{{ editingHomeHighlight() ? 'Edit highlight' : 'Add highlight' }}</h3>
                <p class="text-xs text-ink/55">The three highlight cards on the home page (e.g. “Bajaj + Chetak”, “Tata ASC”, “Insurance”).</p>
                <label class="block text-xs font-semibold uppercase tracking-wide text-ink/55">Icon</label>
                <select formControlName="icon" class="adm-in">
                  <option value="bike">Two-wheelers / EV — bike</option>
                  <option value="service">Service · Tata ASC — wrench</option>
                  <option value="shield">Insurance — shield</option>
                  <option value="sparkles">Other — sparkle</option>
                </select>
                <input formControlName="value" placeholder="Title — e.g. Bajaj + Chetak *" class="adm-in"/>
                <input formControlName="label" placeholder="Description — e.g. Two wheelers, electric mobility… *" class="adm-in"/>
                <input formControlName="sortOrder" type="number" placeholder="Sort order (1, 2, 3…)" class="adm-in"/>
                <label class="admin-toggle"><input type="checkbox" formControlName="active"/> Active</label>
                <div class="flex flex-wrap gap-2">
                  <button type="submit" [disabled]="homeHighlightForm.invalid || busy()" class="btn-primary disabled:opacity-50"><svg lucideSave class="mr-2 h-4 w-4"></svg>{{ editingHomeHighlight() ? 'Update highlight' : 'Save highlight' }}</button>
                  @if (editingHomeHighlight()) { <button type="button" (click)="cancelHomeHighlight()" class="btn-outline">Cancel</button> }
                </div>
              </form>

              <form [formGroup]="homeVideoForm" (ngSubmit)="saveHomeVideo()" class="content-form">
                <h3 class="content-title">{{ editingHomeVideo() ? 'Edit home video' : 'Add home video' }}</h3>
                <input formControlName="youtubeId" placeholder="YouTube video ID *" class="adm-in"/>
                <input formControlName="title" placeholder="Title *" class="adm-in"/>
                <input formControlName="tag" placeholder="Tag" class="adm-in"/>
                <textarea formControlName="caption" rows="3" placeholder="Caption" class="adm-in"></textarea>
                <input formControlName="sortOrder" type="number" placeholder="Sort order" class="adm-in"/>
                <label class="admin-toggle"><input type="checkbox" formControlName="active"/> Active</label>
                <div class="flex flex-wrap gap-2">
                  <button type="submit" [disabled]="homeVideoForm.invalid || busy()" class="btn-primary disabled:opacity-50"><svg lucideSave class="mr-2 h-4 w-4"></svg>{{ editingHomeVideo() ? 'Update video' : 'Save video' }}</button>
                  @if (editingHomeVideo()) { <button type="button" (click)="cancelHomeVideo()" class="btn-outline">Cancel</button> }
                </div>
              </form>
            </section>

            <section class="grid gap-5 xl:grid-cols-3">
              <div class="content-card">
                <h3 class="content-title">Home offers</h3>
                <div class="mt-3 space-y-3">
                  @for (o of homeOffers(); track o.id ?? o.title) {
                    <div class="rounded-lg border border-ink/5 bg-kteal-50/60 p-3">
                      <p class="font-bold text-kblue-900">{{ o.title }}</p>
                      <p class="text-xs text-ink/50">{{ o.tag }} / #{{ o.sortOrder ?? 0 }}</p>
                      <div class="mt-3 flex gap-2"><button (click)="editHomeOffer(o)" class="admin-action bg-white text-kteal-700 ring-1 ring-kteal-100"><svg lucideSave class="h-4 w-4"></svg>Edit</button><button (click)="deleteHomeOffer(o)" class="icon-action bg-red-50 text-red-600"><svg lucideTrash2 class="h-4 w-4"></svg></button></div>
                    </div>
                  }
                </div>
              </div>
              <div class="content-card">
                <h3 class="content-title">Home highlights</h3>
                <div class="mt-3 space-y-3">
                  @for (h of homeHighlights(); track h.id ?? h.label) {
                    <div class="rounded-lg border border-ink/5 bg-kblue-50/70 p-3">
                      <p class="font-display text-xl font-bold text-kblue-900">{{ h.value }}</p>
                      <p class="text-sm text-ink/60">{{ h.label }}</p>
                      <div class="mt-3 flex gap-2"><button (click)="editHomeHighlight(h)" class="admin-action bg-white text-kteal-700 ring-1 ring-kteal-100"><svg lucideSave class="h-4 w-4"></svg>Edit</button><button (click)="deleteHomeHighlight(h)" class="icon-action bg-red-50 text-red-600"><svg lucideTrash2 class="h-4 w-4"></svg></button></div>
                    </div>
                  }
                </div>
              </div>
              <div class="content-card">
                <h3 class="content-title">Home YouTube videos</h3>
                <div class="mt-3 space-y-3">
                  @for (v of homeVideos(); track v.id ?? v.youtubeId) {
                    <div class="rounded-lg border border-ink/5 bg-white p-3 shadow-sm">
                      <p class="font-bold text-kblue-900">{{ v.title }}</p>
                      <p class="text-xs text-ink/50">{{ v.youtubeId }} / #{{ v.sortOrder ?? 0 }}</p>
                      <div class="mt-3 flex gap-2"><button (click)="editHomeVideo(v)" class="admin-action bg-kteal-50 text-kteal-700 ring-1 ring-kteal-100"><svg lucideSave class="h-4 w-4"></svg>Edit</button><button (click)="deleteHomeVideo(v)" class="icon-action bg-red-50 text-red-600"><svg lucideTrash2 class="h-4 w-4"></svg></button></div>
                    </div>
                  }
                </div>
              </div>
            </section>

            <section class="content-block">
              <form [formGroup]="servicePanelForm" (ngSubmit)="saveServicePanel()" class="content-form">
                <h3 class="content-title">{{ editingServicePanel() ? 'Edit service panel' : 'Add service panel' }}</h3>
                <input formControlName="eyebrow" placeholder="Eyebrow" class="adm-in"/>
                <input formControlName="title" placeholder="Title *" class="adm-in"/>
                <textarea formControlName="text" rows="3" placeholder="Text" class="adm-in"></textarea>
                <input formControlName="imageUrl" placeholder="Image URL" class="adm-in"/>
                <div class="grid gap-3 sm:grid-cols-2">
                  <input formControlName="icon" placeholder="Icon key" class="adm-in"/>
                  <input formControlName="theme" placeholder="Theme" class="adm-in"/>
                  <input formControlName="ctaLabel" placeholder="CTA label" class="adm-in"/>
                  <input formControlName="ctaLink" placeholder="CTA link" class="adm-in"/>
                  <input formControlName="sortOrder" type="number" placeholder="Sort order" class="adm-in"/>
                  <label class="admin-toggle"><input type="checkbox" formControlName="active"/> Active</label>
                </div>
                <div class="flex flex-wrap gap-2">
                  <button type="submit" [disabled]="servicePanelForm.invalid" class="btn-primary disabled:opacity-50"><svg lucideSave class="mr-2 h-4 w-4"></svg>{{ editingServicePanel() ? 'Update panel' : 'Save panel' }}</button>
                  @if (editingServicePanel()) { <button type="button" (click)="cancelServicePanel()" class="btn-outline">Cancel</button> }
                </div>
              </form>
              <div class="content-list">
                @for (p of servicePanels(); track p.id ?? p.title) {
                  <article class="content-card">
                    <img [src]="p.imageUrl" [alt]="p.title" class="h-28 w-full rounded-lg object-cover"/>
                    <p class="eyebrow mt-3">{{ p.eyebrow }}</p>
                    <h4 class="font-display text-lg font-bold text-kblue-900">{{ p.title }}</h4>
                    <p class="mt-1 line-clamp-2 text-sm text-ink/60">{{ p.text }}</p>
                    <div class="mt-4 flex flex-wrap gap-2">
                      <button (click)="editServicePanel(p)" class="admin-action bg-kteal-50 text-kteal-700 ring-1 ring-kteal-100"><svg lucideSave class="h-4 w-4"></svg>Edit</button>
                      <button (click)="deleteServicePanel(p)" class="icon-action bg-red-50 text-red-600"><svg lucideTrash2 class="h-4 w-4"></svg></button>
                    </div>
                  </article>
                }
              </div>
            </section>

            <section class="grid gap-5 xl:grid-cols-2">
              <form [formGroup]="servicePromiseForm" (ngSubmit)="saveServicePromise()" class="content-form">
                <h3 class="content-title">{{ editingServicePromise() ? 'Edit service promise' : 'Add service promise' }}</h3>
                <input formControlName="icon" placeholder="Icon key" class="adm-in"/>
                <input formControlName="label" placeholder="Label *" class="adm-in"/>
                <textarea formControlName="text" rows="3" placeholder="Text" class="adm-in"></textarea>
                <input formControlName="sortOrder" type="number" placeholder="Sort order" class="adm-in"/>
                <label class="admin-toggle"><input type="checkbox" formControlName="active"/> Active</label>
                <div class="flex flex-wrap gap-2">
                  <button type="submit" [disabled]="servicePromiseForm.invalid" class="btn-primary disabled:opacity-50"><svg lucideSave class="mr-2 h-4 w-4"></svg>Save promise</button>
                  @if (editingServicePromise()) { <button type="button" (click)="cancelServicePromise()" class="btn-outline">Cancel</button> }
                </div>
                <div class="mt-3 grid gap-3 sm:grid-cols-2">
                  @for (p of servicePromises(); track p.id ?? p.label) {
                    <article class="rounded-lg bg-kteal-50/60 p-3">
                      <p class="font-bold text-kblue-900">{{ p.label }}</p>
                      <p class="mt-1 line-clamp-2 text-xs text-ink/60">{{ p.text }}</p>
                      <div class="mt-3 flex gap-2"><button type="button" (click)="editServicePromise(p)" class="admin-action bg-white text-kteal-700 ring-1 ring-kteal-100"><svg lucideSave class="h-4 w-4"></svg>Edit</button><button type="button" (click)="deleteServicePromise(p)" class="icon-action bg-red-50 text-red-600"><svg lucideTrash2 class="h-4 w-4"></svg></button></div>
                    </article>
                  }
                </div>
              </form>

              <form [formGroup]="careerPerkForm" (ngSubmit)="saveCareerPerk()" class="content-form">
                <h3 class="content-title">{{ editingCareerPerk() ? 'Edit career perk' : 'Add career perk' }}</h3>
                <input formControlName="icon" placeholder="Icon key" class="adm-in"/>
                <input formControlName="label" placeholder="Label *" class="adm-in"/>
                <textarea formControlName="text" rows="3" placeholder="Text" class="adm-in"></textarea>
                <input formControlName="sortOrder" type="number" placeholder="Sort order" class="adm-in"/>
                <label class="admin-toggle"><input type="checkbox" formControlName="active"/> Active</label>
                <div class="flex flex-wrap gap-2">
                  <button type="submit" [disabled]="careerPerkForm.invalid" class="btn-primary disabled:opacity-50"><svg lucideSave class="mr-2 h-4 w-4"></svg>Save perk</button>
                  @if (editingCareerPerk()) { <button type="button" (click)="cancelCareerPerk()" class="btn-outline">Cancel</button> }
                </div>
                <div class="mt-3 grid gap-3 sm:grid-cols-2">
                  @for (p of careerPerks(); track p.id ?? p.label) {
                    <article class="rounded-lg bg-kblue-50/70 p-3">
                      <p class="font-bold text-kblue-900">{{ p.label }}</p>
                      <p class="mt-1 line-clamp-2 text-xs text-ink/60">{{ p.text }}</p>
                      <div class="mt-3 flex gap-2"><button type="button" (click)="editCareerPerk(p)" class="admin-action bg-white text-kteal-700 ring-1 ring-kteal-100"><svg lucideSave class="h-4 w-4"></svg>Edit</button><button type="button" (click)="deleteCareerPerk(p)" class="icon-action bg-red-50 text-red-600"><svg lucideTrash2 class="h-4 w-4"></svg></button></div>
                    </article>
                  }
                </div>
              </form>
            </section>
          </section>
        }

        @if (tab() === 'cache') {
          <section class="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
            <article class="card !p-6">
              <p class="eyebrow">Caffeine cache</p>
              <h2 class="mt-1 font-display text-2xl font-bold text-kblue-900">Public site performance</h2>
              <p class="mt-2 text-sm leading-6 text-ink/60">Public content endpoints are cached. Admin saves and deletes clear the cache automatically; this control clears it manually.</p>
              <button (click)="clearCache()" class="btn-primary mt-5"><svg lucideRefreshCw class="mr-2 h-4 w-4"></svg>Clear site cache</button>
            </article>
            <article class="card !p-6">
              @if (cacheInfo(); as c) {
                <div class="grid gap-4 sm:grid-cols-3">
                  <div class="admin-metric !p-4">
                    <p class="text-sm text-ink/60">Entries</p>
                    <p class="mt-2 font-display text-3xl font-bold text-kblue-900">{{ c.entries }}</p>
                  </div>
                  <div class="admin-metric !p-4">
                    <p class="text-sm text-ink/60">Keys</p>
                    <p class="mt-2 font-display text-3xl font-bold text-kblue-900">{{ c.keys.length }}</p>
                  </div>
                  <div class="admin-metric !p-4">
                    <p class="text-sm text-ink/60">Stats</p>
                    <p class="mt-2 break-words text-xs font-semibold text-kblue-900">{{ c.stats }}</p>
                  </div>
                </div>
                <div class="mt-5">
                  <h3 class="font-display text-lg font-bold text-kblue-900">Cached keys</h3>
                  <div class="mt-3 flex flex-wrap gap-2">
                    @for (key of c.keys; track key) {
                      <span class="rounded-full bg-kteal-50 px-3 py-1 text-xs font-bold text-kteal-700">{{ key }}</span>
                    }
                    @if (!c.keys.length) { <span class="text-sm text-ink/50">Cache is empty.</span> }
                  </div>
                </div>
              } @else {
                <p class="text-sm text-ink/50">Cache details are loading.</p>
              }
            </article>
          </section>
        }

        @if (tab() === 'settings') {
          <form [formGroup]="settingsForm" (ngSubmit)="saveSiteSettings()" class="card grid max-w-2xl gap-4 !p-6">
            <label class="text-sm font-semibold">WhatsApp number
              <input formControlName="whatsapp_number" class="adm-in mt-1 w-full"/></label>
            <label class="text-sm font-semibold">Phone number
              <input formControlName="phone_number" class="adm-in mt-1 w-full"/></label>
            <label class="text-sm font-semibold">Contact email
              <input formControlName="contact_email" type="email" class="adm-in mt-1 w-full"/></label>
            <label class="text-sm font-semibold">Head office
              <input formControlName="head_office" class="adm-in mt-1 w-full"/></label>
            <label class="text-sm font-semibold">Lead types (comma separated)
              <input formControlName="lead_types" class="adm-in mt-1 w-full"/></label>
            <div class="grid gap-4 sm:grid-cols-2">
              <label class="text-sm font-semibold">Happy riders stat
                <input formControlName="stat_happy_riders" class="adm-in mt-1 w-full"/></label>
              <label class="text-sm font-semibold">Years of trust stat
                <input formControlName="stat_years_trust" class="adm-in mt-1 w-full"/></label>
            </div>
            <button type="submit" [disabled]="settingsForm.invalid || busy()" class="btn-primary w-fit disabled:opacity-50"><svg lucideSave class="mr-2 h-4 w-4"></svg>Save settings</button>
          </form>
        }
      </main>
    </div>
  }

  @if (confirmState(); as c) {
    <div class="adm-confirm-overlay" (click)="resolveConfirm(false)" role="presentation">
      <div class="adm-confirm" role="alertdialog" aria-modal="true" (click)="$event.stopPropagation()">
        <span class="adm-confirm-icon"><svg lucideTrash2 class="h-6 w-6"></svg></span>
        <h3 class="mt-4 font-display text-xl font-bold text-white">Delete item?</h3>
        <p class="mt-2 text-sm leading-6 text-white/70">{{ c.message }}</p>
        <p class="adm-confirm-note mt-3 text-xs">This removes the record from the live site and cannot be undone.</p>
        <div class="mt-6 flex justify-end gap-3">
          <button type="button" (click)="resolveConfirm(false)" class="adm-confirm-cancel">Keep item</button>
          <button type="button" (click)="resolveConfirm(true)" class="adm-confirm-delete"><svg lucideTrash2 class="h-4 w-4"></svg>Delete now</button>
        </div>
      </div>
    </div>
  }`,
  styles: [`
    .adm-in { border-radius: 0.5rem; border: 1px solid rgba(13,27,30,0.12); background: rgba(255,255,255,0.96); color: #14110b; font-weight: 500; padding: 0.78rem 1rem; transition: border-color .2s, box-shadow .2s; outline: none; }
    .adm-in:focus { border-color: #1e70ad; box-shadow: 0 0 0 4px rgba(30,112,173,0.16); }
    .adm-in::placeholder { color: rgba(13,27,30,0.42); font-weight: 500; }
    /* ---- Delete confirmation modal (dark-luxury) ---- */
    .adm-confirm-overlay {
      position: fixed; inset: 0; z-index: 80;
      display: flex; align-items: center; justify-content: center;
      padding: 1.25rem;
      background:
        radial-gradient(760px 420px at 50% 16%, rgba(30,112,173,0.16), transparent 64%),
        rgba(7,6,4,0.88);
      animation: admFade .18s ease-out;
    }
    .adm-confirm {
      width: 100%; max-width: 25rem;
      border-radius: 1.1rem;
      padding: 1.6rem;
      text-align: left;
      background: linear-gradient(160deg, #14110b, #1f1d1a 58%, #070604);
      border: 1px solid rgba(30,112,173,0.28);
      box-shadow: 0 40px 110px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06);
      animation: admPop .22s cubic-bezier(.2,.7,.3,1);
    }
    .adm-confirm-icon {
      display: inline-flex; align-items: center; justify-content: center;
      height: 3rem; width: 3rem; border-radius: 0.9rem;
      color: #fff; background: linear-gradient(135deg, #e5484d, #b4232a);
      box-shadow: 0 12px 28px rgba(180,35,42,0.4);
    }
    .adm-confirm-note {
      border-radius: .75rem;
      border: 1px solid rgba(30,112,173,.18);
      background: rgba(30,112,173,.08);
      padding: .75rem .85rem;
      color: rgba(244,241,234,.64);
    }
    .adm-confirm-cancel {
      min-height: 2.7rem; padding: 0 1.1rem; border-radius: 999px;
      font-weight: 600; color: #f4efe3;
      border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.06);
      transition: background .18s, transform .12s;
    }
    .adm-confirm-cancel:hover { background: rgba(255,255,255,0.12); }
    .adm-confirm-cancel:active { transform: scale(0.96); }
    .adm-confirm-delete {
      display: inline-flex; align-items: center; gap: .5rem;
      min-height: 2.7rem; padding: 0 1.25rem; border-radius: 999px;
      font-weight: 700; color: #fff;
      background: linear-gradient(135deg, #e5484d, #b4232a);
      box-shadow: 0 14px 30px rgba(180,35,42,0.38);
      transition: filter .18s, transform .12s;
    }
    .adm-confirm-delete:hover { filter: brightness(1.08); }
    .adm-confirm-delete:active { transform: scale(0.96); }
    @keyframes admFade { from { opacity: 0; } to { opacity: 1; } }
    @keyframes admPop { from { opacity: 0; transform: translateY(10px) scale(0.97); } to { opacity: 1; transform: none; } }
    /* search variant: leave room for the magnifier icon (own padding beats the
       .adm-in shorthand, so the placeholder never sits under the icon) */
    .adm-search { padding-left: 2.85rem; }
    /* Mobile tab chips — theme-consistent logo active state, clean scroll row */
    .adm-tabscroll { scrollbar-width: none; scroll-snap-type: x proximity; }
    .adm-tabscroll::-webkit-scrollbar { display: none; }
    .adm-tabscroll > button { scroll-snap-align: start; }
    .adm-chip { border: 1px solid rgba(6,161,84,0.18); background: rgba(31,29,26,0.92); color: #f4f1ea; }
    .adm-chip-active {
      background: linear-gradient(135deg, #1e70ad, #06a154);
      color: #05161c;
      box-shadow: 0 10px 24px rgba(30,112,173,0.24);
    }
    /* Phone polish for the confirm modal: stack full-width buttons, snug padding */
    @media (max-width: 480px) {
      .adm-confirm { padding: 1.3rem; border-radius: 1rem; }
      .adm-confirm > div { flex-direction: column-reverse; }
      .adm-confirm-cancel, .adm-confirm-delete { width: 100%; justify-content: center; min-height: 3rem; }
    }
    .admin-nav { display: flex; width: 100%; align-items: center; gap: .75rem; border-radius: .5rem; padding: .78rem 1rem; text-align: left; font-weight: 700; color: rgba(244,241,234,.72); transition: .2s; }
    .admin-nav:hover { background: rgba(30,112,173,.13); color: #f4f1ea; }
    .admin-nav-active { background: linear-gradient(135deg, #1e70ad, #06a154); color: #05161c; box-shadow: 0 12px 28px rgba(30,112,173,.18); }
    .admin-metric { position: relative; overflow: hidden; border-radius: 1rem; border: 1px solid rgba(30,112,173,.36); background: rgba(244,241,234,.94); padding: 1.5rem; box-shadow: 0 20px 55px rgba(0,0,0,.18); transition: transform .25s, box-shadow .25s; }
    .admin-metric::before { content: ""; position: absolute; inset-inline: 0; top: 0; height: 4px; background: linear-gradient(90deg, #1e70ad, #06a154, #1e70ad); }
    .admin-metric:hover { transform: translateY(-3px); box-shadow: 0 28px 65px rgba(0,0,0,.24); }
    .admin-metric-icon { display: flex; height: 2.75rem; width: 2.75rem; align-items: center; justify-content: center; border-radius: .5rem; margin-bottom: 1rem; }
    .lead-card { border-radius: .5rem; border: 1px solid rgba(30,112,173,.30); background: rgba(244,241,234,.94); padding: 1.25rem; box-shadow: 0 18px 55px rgba(0,0,0,.16); }
    .contact-line { display: inline-flex; min-width: 0; align-items: center; gap: .55rem; overflow: hidden; border-radius: .5rem; background: rgba(6,161,84,.16); padding: .75rem .9rem; font-weight: 700; color: #06281a; text-overflow: ellipsis; white-space: nowrap; }
    .admin-action { display: inline-flex; min-height: 2.75rem; align-items: center; justify-content: center; gap: .5rem; border-radius: 999px; padding: .72rem 1rem; font-weight: 800; transition: transform .2s, box-shadow .2s; }
    .admin-action:hover { transform: translateY(-1px); box-shadow: 0 12px 24px rgba(7,6,4,.14); }
    .icon-action { display: inline-flex; height: 2.5rem; width: 2.5rem; align-items: center; justify-content: center; border-radius: 999px; box-shadow: 0 10px 22px rgba(7,6,4,.12); }
    /* The admin cards are dark, but the data text used light-theme inks that
       vanished on the dark surface. Restore readable contrast for descriptions
       and accent icons inside cards (light-bg chip buttons are left untouched). */
    .card [class*="text-ink"] { color: rgba(241,237,227,0.74) !important; }
    .card[class*="text-ink"] { color: rgba(241,237,227,0.66) !important; }
    .card svg[class*="text-kteal-700"],
    .card svg[class*="text-kteal-600"] { color: #5fd6dd !important; }
    .content-block { display: grid; gap: 1.25rem; }
    @media (min-width: 1280px) { .content-block { grid-template-columns: .82fr 1.18fr; } }
    .content-form { display: grid; gap: .85rem; align-self: start; border-radius: 1rem; border: 1px solid rgba(6,161,84,.30); background: rgba(244,241,234,.94); padding: 1.5rem; box-shadow: 0 20px 55px rgba(0,0,0,.16); }
    .content-title { font-family: "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif; font-size: 1.125rem; font-weight: 800; color: #05161c; }
    .content-list { display: grid; gap: 1rem; }
    @media (min-width: 768px) { .content-list { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
    .content-card { border-radius: 1rem; border: 1px solid rgba(6,161,84,.26); background: rgba(244,241,234,.92); padding: 1rem; box-shadow: 0 18px 45px rgba(0,0,0,.14); }
    .admin-toggle { display: inline-flex; min-height: 2.8rem; align-items: center; gap: .6rem; border-radius: .5rem; border: 1px solid rgba(6,161,84,.22); background: rgba(6,161,84,.16); padding: .7rem .9rem; font-size: .875rem; font-weight: 800; color: #06281a; }
    @media (max-width: 640px) {
      .adm-in { min-height: 3.1rem; border-radius: .78rem; }
      .admin-metric,
      .lead-card,
      .content-form,
      .content-card {
        border-radius: .95rem;
        padding: 1rem;
        box-shadow: 0 16px 44px rgba(0,0,0,.18);
      }
      .admin-action {
        flex: 1 1 100%;
        min-height: 3rem;
      }
      .contact-line {
        min-height: 3rem;
        width: 100%;
      }
    }
  `]
})
export class AdminComponent implements OnInit {
  admin = inject(AdminApiService);
  private api = inject(ApiService);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);
  private siteSettings = inject(SettingsService);

  tabs: { id: Tab; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'leads', label: 'Leads' },
    { id: 'applications', label: 'Applications' },
    { id: 'showrooms', label: 'Showrooms' },
    { id: 'jobs', label: 'Jobs' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'services', label: 'Services' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'faqs', label: 'FAQs' },
    { id: 'content', label: 'Site Content' },
    { id: 'cache', label: 'Cache' },
    { id: 'settings', label: 'Settings' }
  ];

  tab = signal<Tab>('dashboard');
  busy = signal(false);
  loading = signal(false);
  private inflight = 0;
  confirmState = signal<{ message: string } | null>(null);
  private confirmResolver?: (ok: boolean) => void;
  leadSearch = signal('');
  applicationSearch = signal('');
  leadFilter = signal('All');

  reports = signal<Reports | null>(null);
  leads = signal<Lead[]>([]);
  applications = signal<JobApplication[]>([]);
  showrooms = signal<Showroom[]>([]);
  jobs = signal<JobOpening[]>([]);
  galleryImages = signal<GalleryImage[]>([]);
  serviceItems = signal<ServiceItem[]>([]);
  testimonialsList = signal<Testimonial[]>([]);
  faqsList = signal<Faq[]>([]);
  pageHeroes = signal<PageHero[]>([]);
  brandItems = signal<BrandItem[]>([]);
  productCategories = signal<ProductCategory[]>([]);
  homeOffers = signal<HomeOffer[]>([]);
  homeHighlights = signal<HomeHighlight[]>([]);
  homeVideos = signal<HomeVideo[]>([]);
  servicePanels = signal<ServicePanel[]>([]);
  servicePromises = signal<ServicePromise[]>([]);
  careerPerks = signal<CareerPerk[]>([]);
  aboutMilestones = signal<AboutMilestone[]>([]);
  aboutBrandsList = signal<AboutBrand[]>([]);
  cacheInfo = signal<CacheInfo | null>(null);

  // edit mode — holds the id of the record being edited (null = creating new)
  editingStore = signal<number | null>(null);
  editingJob = signal<number | null>(null);
  editingGallery = signal<number | null>(null);
  editingService = signal<number | null>(null);
  editingTestimonial = signal<number | null>(null);
  editingFaq = signal<number | null>(null);
  editingPageHero = signal<number | null>(null);
  editingBrand = signal<number | null>(null);
  editingProductCategory = signal<number | null>(null);
  editingHomeOffer = signal<number | null>(null);
  editingHomeHighlight = signal<number | null>(null);
  editingHomeVideo = signal<number | null>(null);
  editingServicePanel = signal<number | null>(null);
  editingServicePromise = signal<number | null>(null);
  editingCareerPerk = signal<number | null>(null);
  editingMilestone = signal<number | null>(null);
  editingAboutBrand = signal<number | null>(null);
  // Preserve the original creation timestamp across edits — the backend resets it
  // to now() whenever an update arrives with a null createdAt, so we round-trip it.
  private editingGalleryCreatedAt?: string;
  private editingTestimonialCreatedAt?: string;

  loginForm = this.fb.nonNullable.group({ username: ['admin', nonBlank], password: ['', nonBlank] });
  storeForm = this.fb.nonNullable.group({
    name: ['', nonBlank], phone: ['', nonBlank], address: ['', nonBlank],
    lat: [0, nonBlank], lng: [0, nonBlank], imageUrl: ['']
  });
  jobForm = this.fb.nonNullable.group({
    title: ['', nonBlank], department: ['', nonBlank],
    location: ['', nonBlank], description: ['']
  });
  galleryForm = this.fb.nonNullable.group({ url: ['', nonBlank], caption: [''] });
  serviceForm = this.fb.nonNullable.group({ title: ['', nonBlank], category: ['', nonBlank], description: [''] });
  testimonialForm = this.fb.nonNullable.group({ name: ['', nonBlank], role: [''], quote: ['', nonBlank], rating: [5] });
  faqForm = this.fb.nonNullable.group({ question: ['', nonBlank], answer: ['', nonBlank], sortOrder: [0] });
  pageHeroForm = this.fb.nonNullable.group({
    page: ['', nonBlank], eyebrow: [''], title: ['', nonBlank], sub: [''],
    imageUrl: [''], videoUrl: [''], chips: ['']
  });
  brandForm = this.fb.nonNullable.group({ name: ['', nonBlank], sortOrder: [0], active: [true] });
  milestoneForm = this.fb.nonNullable.group({ yearLabel: [''], title: ['', nonBlank], body: [''], sortOrder: [0], active: [true] });
  aboutBrandForm = this.fb.nonNullable.group({ name: ['', nonBlank], logoUrl: [''], sortOrder: [0], active: [true] });
  productCategoryForm = this.fb.nonNullable.group({
    name: ['', nonBlank], tag: [''], accent: ['#06a154'], icon: ['bike'], imageUrl: [''],
    description: [''], specs: [''], sortOrder: [0], active: [true]
  });
  homeOfferForm = this.fb.nonNullable.group({
    title: ['', nonBlank], tag: [''], icon: ['sparkles'], text: [''], imageUrl: [''],
    link: ['/products'], sortOrder: [0], active: [true]
  });
  homeHighlightForm = this.fb.nonNullable.group({ icon: ['bike'], value: ['', nonBlank], label: ['', nonBlank], sortOrder: [0], active: [true] });
  homeVideoForm = this.fb.nonNullable.group({ youtubeId: ['', nonBlank], title: ['', nonBlank], tag: [''], caption: [''], sortOrder: [0], active: [true] });
  servicePanelForm = this.fb.nonNullable.group({
    eyebrow: [''], title: ['', nonBlank], text: [''], imageUrl: [''], icon: ['wrench'],
    ctaLabel: ['Contact service'], ctaLink: ['/contact'], theme: ['teal'], sortOrder: [0], active: [true]
  });
  servicePromiseForm = this.fb.nonNullable.group({ icon: ['shield'], label: ['', nonBlank], text: [''], sortOrder: [0], active: [true] });
  careerPerkForm = this.fb.nonNullable.group({ icon: ['star'], label: ['', nonBlank], text: [''], sortOrder: [0], active: [true] });
  settingsForm = this.fb.nonNullable.group({
    whatsapp_number: ['', nonBlank], phone_number: ['', nonBlank],
    contact_email: ['', Validators.email], head_office: [''],
    lead_types: [''], stat_happy_riders: [''], stat_years_trust: ['']
  });

  ngOnInit() { if (this.admin.loggedIn()) this.afterLogin(); }

  login() {
    this.busy.set(true);
    const { username, password } = this.loginForm.getRawValue();
    this.admin.login(username, password).subscribe({
      next: r => { this.admin.confirmLogin(); this.reports.set(r); this.busy.set(false); this.afterLogin(); this.toast.success('Welcome back.'); },
      error: () => { this.admin.logout(); this.busy.set(false); this.toast.error('Invalid credentials.'); }
    });
  }

  /**
   * Single funnel for every create / update / delete. Guards against double-submit
   * (busy re-entry), always resets busy via finalize, runs onSuccess on success and
   * shows a uniform error toast on failure — so no mutation can silently fail or
   * fire twice. onSuccess keeps each handler's own success toast + list refresh.
   */
  private mutate(request: Observable<unknown>, onSuccess: () => void, errorMsg: string) {
    if (this.busy()) return;
    this.busy.set(true);
    request.pipe(finalize(() => this.busy.set(false))).subscribe({
      next: () => onSuccess(),
      error: () => this.toast.error(errorMsg)
    });
  }

  /** Sign out AND clear loaded admin data (lead/application PII) from memory. */
  signOut() {
    this.admin.logout();
    this.reports.set(null);
    this.leads.set([]);
    this.applications.set([]);
  }

  private afterLogin() {
    this.loadSettingsForm();
    this.loadReports();
    this.loadLeads();
    this.loadApplications();
  }

  private loadSettingsForm() {
    this.admin.settings().subscribe({
      next: s => this.settingsForm.patchValue({
        whatsapp_number: s['whatsapp_number'] || this.siteSettings.whatsapp(),
        phone_number: s['phone_number'] || this.siteSettings.phone(),
        contact_email: s['contact_email'] || this.siteSettings.email(),
        head_office: s['head_office'] || this.siteSettings.headOffice(),
        lead_types: s['lead_types'] || this.siteSettings.leadTypes().join(', '),
        stat_happy_riders: s['stat_happy_riders'] || this.siteSettings.happyRiders(),
        stat_years_trust: s['stat_years_trust'] || this.siteSettings.yearsTrust()
      }),
      error: () => {}
    });
  }

  setTab(t: Tab) { this.tab.set(t); this.loadTabData(t); }

  refreshActive() {
    if (this.tab() === 'dashboard') {
      this.loadReports();
      this.loadLeads();
      this.loadApplications();
      return;
    }
    this.loadTabData(this.tab());
  }

  /**
   * Run a GET that feeds a signal, while keeping loading() true for as long as ANY
   * fetch is in flight (ref-counted, so parallel loads don't flip it off early).
   * Surfaces non-401 failures with a toast instead of silently showing an empty
   * list — a 401 is left to the auth interceptor, which logs out. The empty-state
   * messages in the template are gated on !loading() so they don't flash mid-load.
   */
  private loadInto<T>(request: Observable<T>, apply: (value: T) => void) {
    this.inflight++;
    this.loading.set(true);
    request.pipe(finalize(() => { if (--this.inflight <= 0) { this.inflight = 0; this.loading.set(false); } })).subscribe({
      next: value => apply(value),
      error: (e) => { if (e?.status !== 401) this.toast.error('Could not load data. Check your connection and retry.'); }
    });
  }

  private loadReports() { this.loadInto(this.admin.reports(), r => this.reports.set(r)); }
  private loadLeads() { this.loadInto(this.admin.leads(), v => this.leads.set([...v].reverse())); }
  private loadApplications() { this.loadInto(this.admin.applications(), v => this.applications.set([...v].reverse())); }

  private loadTabData(t: Tab) {
    if (t === 'dashboard') { this.loadReports(); this.loadLeads(); this.loadApplications(); }
    if (t === 'leads') this.loadLeads();
    if (t === 'applications') this.loadApplications();
    if (t === 'showrooms') this.loadInto(this.api.showrooms(), v => this.showrooms.set(v));
    if (t === 'jobs') this.loadInto(this.api.jobs(), v => this.jobs.set(v));
    if (t === 'gallery') this.loadInto(this.api.gallery(), v => this.galleryImages.set(v));
    if (t === 'services') this.loadInto(this.api.services(), v => this.serviceItems.set(v));
    if (t === 'testimonials') this.loadInto(this.api.testimonials(), v => this.testimonialsList.set(v));
    if (t === 'faqs') this.loadInto(this.api.faqs(), v => this.faqsList.set(v));
    if (t === 'content') this.loadContent();
    if (t === 'cache') this.loadCache();
    if (t === 'settings') this.loadSettingsForm();
  }

  tabTitle() {
    return this.tabs.find(t => t.id === this.tab())?.label || 'Dashboard';
  }

  leadFilterOptions() {
    return ['All', ...Array.from(new Set(this.leads().map(l => l.type).filter(Boolean)))];
  }

  filteredLeads() {
    const q = this.leadSearch().trim().toLowerCase();
    const type = this.leadFilter();
    return this.leads().filter(l => {
      const haystack = `${l.name} ${l.phone} ${l.email || ''} ${l.type} ${l.message || ''}`.toLowerCase();
      return (type === 'All' || l.type === type) && (!q || haystack.includes(q));
    });
  }

  filteredApplications() {
    const q = this.applicationSearch().trim().toLowerCase();
    return this.applications().filter(a => {
      const haystack = `${a.name} ${a.phone} ${a.email} ${a.jobId} ${a.note || ''}`.toLowerCase();
      return !q || haystack.includes(q);
    });
  }

  recentLeads() { return this.leads().slice(0, 5); }

  leadTypeKeys(r: Reports) { return Object.keys(r.leadsByType || {}); }
  barWidth(r: Reports, k: string) {
    const values = Object.values(r.leadsByType || {}).map(v => Number(v));
    const max = Math.max(0, ...values);
    return max ? (Number(r.leadsByType[k]) / max) * 100 : 0;
  }

  initials(name = '') {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    return (parts[0]?.[0] || 'K') + (parts[1]?.[0] || '');
  }

  callLink(phone = '') { return `tel:${phone}`; }

  whatsAppPhoneLink(phone = '', message = 'Hi Kallingal') {
    let digits = phone.replace(/\D/g, '');
    if (digits.length === 10) digits = `91${digits}`;
    return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
  }

  whatsAppLeadLink(l: Lead) {
    return this.whatsAppPhoneLink(l.phone, `Hi ${l.name}, this is Kallingal Group responding to your ${l.type} enquiry.`);
  }

  whatsAppApplicationLink(a: JobApplication) {
    return this.whatsAppPhoneLink(a.phone, `Hi ${a.name}, this is Kallingal HR regarding your job application.`);
  }

  emailLeadLink(l: Lead) {
    return `mailto:${l.email}?subject=${encodeURIComponent(`Kallingal ${l.type} enquiry`)}`;
  }

  emailApplicationLink(a: JobApplication) {
    return `mailto:${a.email}?subject=${encodeURIComponent('Kallingal job application')}`;
  }

  downloadCv(a: JobApplication) {
    if (!a.id) return;
    this.admin.downloadCv(a.id).subscribe({
      next: blob => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = a.resumeFilename || `cv-${a.id}`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
      },
      error: () => this.toast.error('Could not download CV.')
    });
  }

  // ---------- showrooms ----------
  editStore(s: Showroom) {
    this.editingStore.set(s.id ?? null);
    this.storeForm.setValue({ name: s.name, phone: s.phone, address: s.address, lat: s.lat, lng: s.lng, imageUrl: s.imageUrl || '' });
    this.scrollToForm();
  }
  cancelStore() { this.editingStore.set(null); this.storeForm.reset({ lat: 0, lng: 0 }); }
  saveStore() {
    const id = this.editingStore();
    const payload = { ...this.storeForm.getRawValue(), ...(id != null ? { id } : {}) } as Showroom;
    this.mutate(this.admin.saveShowroom(payload),
      () => { this.toast.success(id != null ? 'Showroom updated.' : 'Showroom added.'); this.cancelStore(); this.loadTabData('showrooms'); this.loadReports(); },
      'Could not save showroom.');
  }
  async deleteStore(s: Showroom) {
    if (!await this.ask(`Delete ${s.name}?`)) return;
    this.mutate(this.admin.deleteShowroom(s.id!),
      () => { this.toast.success('Deleted.'); if (this.editingStore() === s.id) this.cancelStore(); this.loadTabData('showrooms'); this.loadReports(); },
      'Could not delete showroom.');
  }

  // ---------- jobs ----------
  editJob(j: JobOpening) {
    this.editingJob.set(j.id ?? null);
    this.jobForm.setValue({ title: j.title, department: j.department, location: j.location, description: j.description || '' });
    this.scrollToForm();
  }
  cancelJob() { this.editingJob.set(null); this.jobForm.reset(); }
  saveJob() {
    const id = this.editingJob();
    const payload = { ...this.jobForm.getRawValue(), active: true, ...(id != null ? { id } : {}) } as JobOpening;
    this.mutate(this.admin.saveJob(payload),
      () => { this.toast.success(id != null ? 'Job updated.' : 'Job posted.'); this.cancelJob(); this.loadTabData('jobs'); this.loadReports(); },
      'Could not save job.');
  }
  async deleteJob(j: JobOpening) {
    if (!await this.ask(`Close ${j.title}?`)) return;
    this.mutate(this.admin.deleteJob(j.id!),
      () => { this.toast.success('Job closed.'); if (this.editingJob() === j.id) this.cancelJob(); this.loadTabData('jobs'); this.loadReports(); },
      'Could not delete job.');
  }

  // ---------- gallery ----------
  editImage(g: GalleryImage) {
    this.editingGallery.set(g.id ?? null);
    this.editingGalleryCreatedAt = g.createdAt;
    this.galleryForm.setValue({ url: g.url, caption: g.caption || '' });
    this.scrollToForm();
  }
  cancelImage() { this.editingGallery.set(null); this.editingGalleryCreatedAt = undefined; this.galleryForm.reset(); }
  saveImage() {
    const id = this.editingGallery();
    const payload = { ...this.galleryForm.getRawValue(), ...(id != null ? { id } : {}), ...(this.editingGalleryCreatedAt ? { createdAt: this.editingGalleryCreatedAt } : {}) } as GalleryImage;
    this.mutate(this.admin.saveGallery(payload),
      () => { this.toast.success(id != null ? 'Image updated.' : 'Image added.'); this.cancelImage(); this.loadTabData('gallery'); this.loadReports(); },
      'Could not save image.');
  }
  async deleteImage(g: GalleryImage) {
    if (!await this.ask('Remove this image?')) return;
    this.mutate(this.admin.deleteGallery(g.id!),
      () => { this.toast.success('Image removed.'); if (this.editingGallery() === g.id) this.cancelImage(); this.loadTabData('gallery'); this.loadReports(); },
      'Could not delete image.');
  }

  // ---------- services ----------
  editSvc(s: ServiceItem) {
    this.editingService.set(s.id ?? null);
    this.serviceForm.setValue({ title: s.title, category: s.category, description: s.description || '' });
    this.scrollToForm();
  }
  cancelSvc() { this.editingService.set(null); this.serviceForm.reset(); }
  saveSvc() {
    const id = this.editingService();
    const payload = { ...this.serviceForm.getRawValue(), ...(id != null ? { id } : {}) } as ServiceItem;
    this.mutate(this.admin.saveService(payload),
      () => { this.toast.success(id != null ? 'Service updated.' : 'Service added.'); this.cancelSvc(); this.loadTabData('services'); },
      'Could not save service.');
  }
  async deleteSvc(s: ServiceItem) {
    if (!await this.ask('Delete this service?')) return;
    this.mutate(this.admin.deleteService(s.id!),
      () => { this.toast.success('Service removed.'); if (this.editingService() === s.id) this.cancelSvc(); this.loadTabData('services'); },
      'Could not delete service.');
  }

  // ---------- testimonials ----------
  editTestimonial(t: Testimonial) {
    this.editingTestimonial.set(t.id ?? null);
    this.editingTestimonialCreatedAt = t.createdAt;
    this.testimonialForm.setValue({ name: t.name, role: t.role || '', quote: t.quote, rating: t.rating ?? 5 });
    this.scrollToForm();
  }
  cancelTestimonial() { this.editingTestimonial.set(null); this.editingTestimonialCreatedAt = undefined; this.testimonialForm.reset({ rating: 5 }); }
  saveTestimonial() {
    const id = this.editingTestimonial();
    const payload = { ...this.testimonialForm.getRawValue(), ...(id != null ? { id } : {}), ...(this.editingTestimonialCreatedAt ? { createdAt: this.editingTestimonialCreatedAt } : {}) } as Testimonial;
    this.mutate(this.admin.saveTestimonial(payload),
      () => { this.toast.success(id != null ? 'Testimonial updated.' : 'Testimonial added.'); this.cancelTestimonial(); this.loadTabData('testimonials'); },
      'Could not save testimonial.');
  }
  async deleteTestimonial(t: Testimonial) {
    if (!await this.ask(`Delete testimonial from ${t.name}?`)) return;
    this.mutate(this.admin.deleteTestimonial(t.id!),
      () => { this.toast.success('Testimonial removed.'); if (this.editingTestimonial() === t.id) this.cancelTestimonial(); this.loadTabData('testimonials'); },
      'Could not delete testimonial.');
  }

  // ---------- faqs ----------
  editFaq(f: Faq) {
    this.editingFaq.set(f.id ?? null);
    this.faqForm.setValue({ question: f.question, answer: f.answer, sortOrder: f.sortOrder ?? 0 });
    this.scrollToForm();
  }
  cancelFaq() { this.editingFaq.set(null); this.faqForm.reset({ sortOrder: 0 }); }
  saveFaq() {
    const id = this.editingFaq();
    const payload = { ...this.faqForm.getRawValue(), ...(id != null ? { id } : {}) } as Faq;
    this.mutate(this.admin.saveFaq(payload),
      () => { this.toast.success(id != null ? 'FAQ updated.' : 'FAQ added.'); this.cancelFaq(); this.loadTabData('faqs'); },
      'Could not save FAQ.');
  }
  async deleteFaq(f: Faq) {
    if (!await this.ask('Delete this FAQ?')) return;
    this.mutate(this.admin.deleteFaq(f.id!),
      () => { this.toast.success('FAQ removed.'); if (this.editingFaq() === f.id) this.cancelFaq(); this.loadTabData('faqs'); },
      'Could not delete FAQ.');
  }

  // ---------- backend site content ----------
  private loadContent() {
    this.loadInto(this.admin.pageHeroes(), v => this.pageHeroes.set(v));
    this.loadInto(this.admin.brands(), v => this.brandItems.set(v));
    this.loadInto(this.admin.productCategories(), v => this.productCategories.set(v));
    this.loadInto(this.admin.homeOffers(), v => this.homeOffers.set(v));
    this.loadInto(this.admin.homeHighlights(), v => this.homeHighlights.set(v));
    this.loadInto(this.admin.homeVideos(), v => this.homeVideos.set(v));
    this.loadInto(this.admin.servicePanels(), v => this.servicePanels.set(v));
    this.loadInto(this.admin.servicePromises(), v => this.servicePromises.set(v));
    this.loadInto(this.admin.careerPerks(), v => this.careerPerks.set(v));
    this.loadInto(this.admin.aboutMilestones(), v => this.aboutMilestones.set(v));
    this.loadInto(this.admin.aboutBrands(), v => this.aboutBrandsList.set(v));
  }

  private afterContentSave(message: string) {
    this.toast.success(message);
    this.loadContent();
    this.loadCache();
  }

  editPageHero(v: PageHero) {
    this.editingPageHero.set(v.id ?? null);
    this.pageHeroForm.setValue({
      page: v.page || '', eyebrow: v.eyebrow || '', title: v.title || '', sub: v.sub || '',
      imageUrl: v.imageUrl || '', videoUrl: v.videoUrl || '', chips: v.chips || ''
    });
    this.scrollToForm();
  }
  cancelPageHero() { this.editingPageHero.set(null); this.pageHeroForm.reset(); }
  savePageHero() {
    const id = this.editingPageHero();
    const payload = { ...this.pageHeroForm.getRawValue(), ...(id != null ? { id } : {}) } as PageHero;
    this.mutate(this.admin.savePageHero(payload),
      () => { this.cancelPageHero(); this.afterContentSave(id != null ? 'Hero updated.' : 'Hero saved.'); },
      'Could not save hero.');
  }
  async deletePageHero(v: PageHero) {
    if (v.id == null || !await this.ask(`Delete hero for ${v.page}?`)) return;
    this.mutate(this.admin.deletePageHero(v.id),
      () => { if (this.editingPageHero() === v.id) this.cancelPageHero(); this.afterContentSave('Hero deleted.'); },
      'Could not delete hero.');
  }

  editBrand(v: BrandItem) {
    this.editingBrand.set(v.id ?? null);
    this.brandForm.setValue({ name: v.name || '', sortOrder: v.sortOrder ?? 0, active: v.active !== false });
    this.scrollToForm();
  }
  cancelBrand() { this.editingBrand.set(null); this.brandForm.reset({ sortOrder: 0, active: true }); }
  saveBrand() {
    const id = this.editingBrand();
    const payload = { ...this.brandForm.getRawValue(), ...(id != null ? { id } : {}) } as BrandItem;
    this.mutate(this.admin.saveBrand(payload),
      () => { this.cancelBrand(); this.afterContentSave(id != null ? 'Brand updated.' : 'Brand saved.'); },
      'Could not save brand.');
  }
  async deleteBrand(v: BrandItem) {
    if (v.id == null || !await this.ask(`Delete ${v.name}?`)) return;
    this.mutate(this.admin.deleteBrand(v.id),
      () => { if (this.editingBrand() === v.id) this.cancelBrand(); this.afterContentSave('Brand deleted.'); },
      'Could not delete brand.');
  }

  editMilestone(v: AboutMilestone) {
    this.editingMilestone.set(v.id ?? null);
    this.milestoneForm.setValue({ yearLabel: v.yearLabel || '', title: v.title || '', body: v.body || '', sortOrder: v.sortOrder ?? 0, active: v.active !== false });
    this.scrollToForm();
  }
  cancelMilestone() { this.editingMilestone.set(null); this.milestoneForm.reset({ sortOrder: 0, active: true }); }
  saveMilestone() {
    const id = this.editingMilestone();
    const payload = { ...this.milestoneForm.getRawValue(), ...(id != null ? { id } : {}) } as AboutMilestone;
    this.mutate(this.admin.saveAboutMilestone(payload),
      () => { this.cancelMilestone(); this.afterContentSave(id != null ? 'Milestone updated.' : 'Milestone saved.'); },
      'Could not save milestone.');
  }
  async deleteMilestone(v: AboutMilestone) {
    if (v.id == null || !await this.ask(`Delete "${v.title}"?`)) return;
    this.mutate(this.admin.deleteAboutMilestone(v.id),
      () => { if (this.editingMilestone() === v.id) this.cancelMilestone(); this.afterContentSave('Milestone deleted.'); },
      'Could not delete milestone.');
  }

  editAboutBrand(v: AboutBrand) {
    this.editingAboutBrand.set(v.id ?? null);
    this.aboutBrandForm.setValue({ name: v.name || '', logoUrl: v.logoUrl || '', sortOrder: v.sortOrder ?? 0, active: v.active !== false });
    this.scrollToForm();
  }
  cancelAboutBrand() { this.editingAboutBrand.set(null); this.aboutBrandForm.reset({ sortOrder: 0, active: true }); }
  saveAboutBrand() {
    const id = this.editingAboutBrand();
    const payload = { ...this.aboutBrandForm.getRawValue(), ...(id != null ? { id } : {}) } as AboutBrand;
    this.mutate(this.admin.saveAboutBrand(payload),
      () => { this.cancelAboutBrand(); this.afterContentSave(id != null ? 'Brand updated.' : 'Brand saved.'); },
      'Could not save brand.');
  }
  async deleteAboutBrand(v: AboutBrand) {
    if (v.id == null || !await this.ask(`Delete ${v.name}?`)) return;
    this.mutate(this.admin.deleteAboutBrand(v.id),
      () => { if (this.editingAboutBrand() === v.id) this.cancelAboutBrand(); this.afterContentSave('Brand deleted.'); },
      'Could not delete brand.');
  }

  editProductCategory(v: ProductCategory) {
    this.editingProductCategory.set(v.id ?? null);
    this.productCategoryForm.setValue({
      name: v.name || '', tag: v.tag || '', accent: v.accent || '#06a154', icon: v.icon || 'bike',
      imageUrl: v.imageUrl || '', description: v.description || '', specs: v.specs || '',
      sortOrder: v.sortOrder ?? 0, active: v.active !== false
    });
    this.scrollToForm();
  }
  cancelProductCategory() { this.editingProductCategory.set(null); this.productCategoryForm.reset({ accent: '#06a154', icon: 'bike', sortOrder: 0, active: true }); }
  saveProductCategory() {
    const id = this.editingProductCategory();
    const payload = { ...this.productCategoryForm.getRawValue(), ...(id != null ? { id } : {}) } as ProductCategory;
    this.mutate(this.admin.saveProductCategory(payload),
      () => { this.cancelProductCategory(); this.afterContentSave(id != null ? 'Product category updated.' : 'Product category saved.'); },
      'Could not save product category.');
  }
  async deleteProductCategory(v: ProductCategory) {
    if (v.id == null || !await this.ask(`Delete ${v.name}?`)) return;
    this.mutate(this.admin.deleteProductCategory(v.id),
      () => { if (this.editingProductCategory() === v.id) this.cancelProductCategory(); this.afterContentSave('Product category deleted.'); },
      'Could not delete product category.');
  }

  editHomeOffer(v: HomeOffer) {
    this.editingHomeOffer.set(v.id ?? null);
    this.homeOfferForm.setValue({
      title: v.title || '', tag: v.tag || '', icon: v.icon || 'sparkles', text: v.text || '',
      imageUrl: v.imageUrl || '', link: v.link || '/products', sortOrder: v.sortOrder ?? 0, active: v.active !== false
    });
    this.scrollToForm();
  }
  cancelHomeOffer() { this.editingHomeOffer.set(null); this.homeOfferForm.reset({ icon: 'sparkles', link: '/products', sortOrder: 0, active: true }); }
  saveHomeOffer() {
    const id = this.editingHomeOffer();
    const payload = { ...this.homeOfferForm.getRawValue(), ...(id != null ? { id } : {}) } as HomeOffer;
    this.mutate(this.admin.saveHomeOffer(payload),
      () => { this.cancelHomeOffer(); this.afterContentSave(id != null ? 'Home offer updated.' : 'Home offer saved.'); },
      'Could not save home offer.');
  }
  async deleteHomeOffer(v: HomeOffer) {
    if (v.id == null || !await this.ask(`Delete ${v.title}?`)) return;
    this.mutate(this.admin.deleteHomeOffer(v.id),
      () => { if (this.editingHomeOffer() === v.id) this.cancelHomeOffer(); this.afterContentSave('Home offer deleted.'); },
      'Could not delete home offer.');
  }

  editHomeHighlight(v: HomeHighlight) {
    this.editingHomeHighlight.set(v.id ?? null);
    this.homeHighlightForm.setValue({ icon: v.icon || 'bike', value: v.value || '', label: v.label || '', sortOrder: v.sortOrder ?? 0, active: v.active !== false });
    this.scrollToForm();
  }
  cancelHomeHighlight() { this.editingHomeHighlight.set(null); this.homeHighlightForm.reset({ icon: 'bike', sortOrder: 0, active: true }); }
  saveHomeHighlight() {
    const id = this.editingHomeHighlight();
    const payload = { ...this.homeHighlightForm.getRawValue(), ...(id != null ? { id } : {}) } as HomeHighlight;
    this.mutate(this.admin.saveHomeHighlight(payload),
      () => { this.cancelHomeHighlight(); this.afterContentSave(id != null ? 'Home highlight updated.' : 'Home highlight saved.'); },
      'Could not save home highlight.');
  }
  async deleteHomeHighlight(v: HomeHighlight) {
    if (v.id == null || !await this.ask(`Delete ${v.label}?`)) return;
    this.mutate(this.admin.deleteHomeHighlight(v.id),
      () => { if (this.editingHomeHighlight() === v.id) this.cancelHomeHighlight(); this.afterContentSave('Home highlight deleted.'); },
      'Could not delete home highlight.');
  }

  editHomeVideo(v: HomeVideo) {
    this.editingHomeVideo.set(v.id ?? null);
    this.homeVideoForm.setValue({
      youtubeId: v.youtubeId || '', title: v.title || '', tag: v.tag || '',
      caption: v.caption || '', sortOrder: v.sortOrder ?? 0, active: v.active !== false
    });
    this.scrollToForm();
  }
  cancelHomeVideo() { this.editingHomeVideo.set(null); this.homeVideoForm.reset({ sortOrder: 0, active: true }); }
  saveHomeVideo() {
    const id = this.editingHomeVideo();
    const payload = { ...this.homeVideoForm.getRawValue(), ...(id != null ? { id } : {}) } as HomeVideo;
    this.mutate(this.admin.saveHomeVideo(payload),
      () => { this.cancelHomeVideo(); this.afterContentSave(id != null ? 'Home video updated.' : 'Home video saved.'); },
      'Could not save home video.');
  }
  async deleteHomeVideo(v: HomeVideo) {
    if (v.id == null || !await this.ask(`Delete ${v.title}?`)) return;
    this.mutate(this.admin.deleteHomeVideo(v.id),
      () => { if (this.editingHomeVideo() === v.id) this.cancelHomeVideo(); this.afterContentSave('Home video deleted.'); },
      'Could not delete home video.');
  }

  editServicePanel(v: ServicePanel) {
    this.editingServicePanel.set(v.id ?? null);
    this.servicePanelForm.setValue({
      eyebrow: v.eyebrow || '', title: v.title || '', text: v.text || '', imageUrl: v.imageUrl || '',
      icon: v.icon || 'wrench', ctaLabel: v.ctaLabel || 'Contact service', ctaLink: v.ctaLink || '/contact',
      theme: v.theme || 'teal', sortOrder: v.sortOrder ?? 0, active: v.active !== false
    });
    this.scrollToForm();
  }
  cancelServicePanel() {
    this.editingServicePanel.set(null);
    this.servicePanelForm.reset({ icon: 'wrench', ctaLabel: 'Contact service', ctaLink: '/contact', theme: 'teal', sortOrder: 0, active: true });
  }
  saveServicePanel() {
    const id = this.editingServicePanel();
    const payload = { ...this.servicePanelForm.getRawValue(), ...(id != null ? { id } : {}) } as ServicePanel;
    this.mutate(this.admin.saveServicePanel(payload),
      () => { this.cancelServicePanel(); this.afterContentSave(id != null ? 'Service panel updated.' : 'Service panel saved.'); },
      'Could not save service panel.');
  }
  async deleteServicePanel(v: ServicePanel) {
    if (v.id == null || !await this.ask(`Delete ${v.title}?`)) return;
    this.mutate(this.admin.deleteServicePanel(v.id),
      () => { if (this.editingServicePanel() === v.id) this.cancelServicePanel(); this.afterContentSave('Service panel deleted.'); },
      'Could not delete service panel.');
  }

  editServicePromise(v: ServicePromise) {
    this.editingServicePromise.set(v.id ?? null);
    this.servicePromiseForm.setValue({ icon: v.icon || 'shield', label: v.label || '', text: v.text || '', sortOrder: v.sortOrder ?? 0, active: v.active !== false });
    this.scrollToForm();
  }
  cancelServicePromise() { this.editingServicePromise.set(null); this.servicePromiseForm.reset({ icon: 'shield', sortOrder: 0, active: true }); }
  saveServicePromise() {
    const id = this.editingServicePromise();
    const payload = { ...this.servicePromiseForm.getRawValue(), ...(id != null ? { id } : {}) } as ServicePromise;
    this.mutate(this.admin.saveServicePromise(payload),
      () => { this.cancelServicePromise(); this.afterContentSave(id != null ? 'Service promise updated.' : 'Service promise saved.'); },
      'Could not save service promise.');
  }
  async deleteServicePromise(v: ServicePromise) {
    if (v.id == null || !await this.ask(`Delete ${v.label}?`)) return;
    this.mutate(this.admin.deleteServicePromise(v.id),
      () => { if (this.editingServicePromise() === v.id) this.cancelServicePromise(); this.afterContentSave('Service promise deleted.'); },
      'Could not delete service promise.');
  }

  editCareerPerk(v: CareerPerk) {
    this.editingCareerPerk.set(v.id ?? null);
    this.careerPerkForm.setValue({ icon: v.icon || 'star', label: v.label || '', text: v.text || '', sortOrder: v.sortOrder ?? 0, active: v.active !== false });
    this.scrollToForm();
  }
  cancelCareerPerk() { this.editingCareerPerk.set(null); this.careerPerkForm.reset({ icon: 'star', sortOrder: 0, active: true }); }
  saveCareerPerk() {
    const id = this.editingCareerPerk();
    const payload = { ...this.careerPerkForm.getRawValue(), ...(id != null ? { id } : {}) } as CareerPerk;
    this.mutate(this.admin.saveCareerPerk(payload),
      () => { this.cancelCareerPerk(); this.afterContentSave(id != null ? 'Career perk updated.' : 'Career perk saved.'); },
      'Could not save career perk.');
  }
  async deleteCareerPerk(v: CareerPerk) {
    if (v.id == null || !await this.ask(`Delete ${v.label}?`)) return;
    this.mutate(this.admin.deleteCareerPerk(v.id),
      () => { if (this.editingCareerPerk() === v.id) this.cancelCareerPerk(); this.afterContentSave('Career perk deleted.'); },
      'Could not delete career perk.');
  }

  private loadCache() {
    this.loadInto(this.admin.cacheInfo(), v => this.cacheInfo.set(v));
  }

  clearCache() {
    this.admin.clearCache().subscribe({
      next: () => { this.toast.success('Site cache cleared.'); this.loadCache(); },
      error: () => this.toast.error('Could not clear cache.')
    });
  }

  private scrollToForm() {
    if (typeof window === 'undefined') return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /** Styled in-app confirmation. Resolves true when the user confirms. */
  ask(message: string): Promise<boolean> {
    this.confirmState.set({ message });
    return new Promise<boolean>(resolve => { this.confirmResolver = resolve; });
  }
  resolveConfirm(ok: boolean) {
    this.confirmState.set(null);
    const resolve = this.confirmResolver;
    this.confirmResolver = undefined;
    resolve?.(ok);
  }
  @HostListener('document:keydown.escape')
  onEscape() { if (this.confirmState()) this.resolveConfirm(false); }
  saveSiteSettings() {
    if (this.settingsForm.invalid) {
      this.settingsForm.markAllAsTouched();
      this.toast.error('Enter a valid WhatsApp number, phone and email before saving.');
      return;
    }
    this.mutate(this.admin.saveSettings(this.settingsForm.getRawValue()),
      () => { this.toast.success('Settings saved. Site updated.'); this.siteSettings.load(); this.loadCache(); },
      'Could not save settings.');
  }
}
