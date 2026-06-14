import { Component, AfterViewInit, OnDestroy, OnInit, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  LucideArrowRight,
  LucideBike,
  LucideCalendarCheck,
  LucideMapPin,
  LucidePlay,
  LucideShieldCheck,
  LucideSparkles,
  LucideZap,
  LucideStore,
  LucideWrench
} from '@lucide/angular';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Tilt3dDirective } from '../../shared/tilt3d.directive';
import { WhatsappIconComponent } from '../../shared/whatsapp-icon.component';
import { TestimonialsComponent } from '../../shared/testimonials.component';
import { FaqComponent } from '../../shared/faq.component';
import { FeatureGridComponent } from '../../shared/feature-grid.component';
import { ApiService, HomeHighlight, HomeOffer, PageHero, SiteStat } from '../../shared/api.service';

gsap.registerPlugin(ScrollTrigger);

type HighlightIcon = 'bike' | 'service' | 'shield';
type VideoItem = {
  id: string;
  title: string;
  tag: string;
  caption: string;
  thumb: string;
  url: SafeResourceUrl;
};

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    Tilt3dDirective,
    WhatsappIconComponent,
    TestimonialsComponent,
    FaqComponent,
    FeatureGridComponent,
    LucideArrowRight,
    LucideBike,
    LucideCalendarCheck,
    LucideMapPin,
    LucidePlay,
    LucideShieldCheck,
    LucideSparkles,
    LucideZap,
    LucideStore,
    LucideWrench
  ],
  template: `
  <section id="top" class="snap-target hero-stage relative isolate min-h-[100svh] overflow-hidden bg-transparent text-white">
    @if (homeHero()?.videoUrl) {
      <video #heroVideo class="hero-media absolute inset-0 -z-30 h-full w-full object-cover" autoplay muted loop playsinline
             preload="auto" [src]="homeHero()?.videoUrl || ''"
             (play)="heroPaused.set(false)" (pause)="heroPaused.set(true)" (error)="onVideoError()"></video>
    }
    <div class="absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgba(3,12,18,0.5)_0%,rgba(3,12,18,0.42)_45%,rgba(3,12,18,0.72)_100%)]"></div>
    <div class="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-[rgba(5,22,28,0.7)] to-transparent"></div>

    <div class="hero-3d section-shell flex min-h-[100svh] flex-col justify-end pb-20 pt-28 sm:pb-12">
      <div class="heroFade mb-5 flex flex-wrap items-center gap-3">
        <span class="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-bold uppercase text-white">
          <svg lucideSparkles class="h-4 w-4"></svg>
          {{ homeHero()?.eyebrow }}
        </span>
        @if (heroChips().length) {
          <span class="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-bold uppercase text-white">
            <svg lucideMapPin class="h-4 w-4"></svg>
            {{ heroChips()[0] }}
          </span>
        }
      </div>

      <h1 aria-label="Kallingal Group automotive network" class="hero-title select-none font-display font-black uppercase text-white">
        <span class="hero-word text-gradient block">{{ heroTitlePart(0) }}</span>
        <span class="hero-word text-gradient block bg-gradient-to-r from-kteal-200 via-kteal-100 to-white bg-clip-text text-transparent">{{ heroTitlePart(1) }}</span>
      </h1>

      <div class="mt-7 grid gap-6 lg:grid-cols-[1fr_0.82fr] lg:items-end">
        <p class="heroFade max-w-3xl text-base leading-8 text-white/80 sm:text-xl">
          {{ homeHero()?.sub }}
        </p>
        <div class="heroFade flex flex-col gap-3 sm:flex-row lg:justify-end">
          <a routerLink="/products" class="btn-primary">
            Explore vehicles <svg lucideArrowRight class="ml-2 h-4 w-4"></svg>
          </a>
          <a routerLink="/contact" fragment="enquiry" class="btn-outline !border-white/50 !bg-white/10 !text-white hover:!bg-white hover:!text-kblue-800">
            <svg lucideCalendarCheck class="mr-2 h-4 w-4"></svg>Book a test drive
          </a>
        </div>
      </div>

      <div class="heroFade mt-9 flex flex-wrap gap-2.5">
        @for (chip of heroChips(); track chip; let i = $index) {
          <span class="glass-chip">
            @switch (i) {
              @case (0) { <svg lucideStore class="h-4 w-4 text-kteal-200"></svg> }
              @case (1) { <svg lucideZap class="h-4 w-4 text-kgreen-300"></svg> }
              @case (2) { <svg lucideWrench class="h-4 w-4 text-kteal-200"></svg> }
              @default { <svg lucideShieldCheck class="h-4 w-4 text-kteal-200"></svg> }
            }
            {{ chip }}
          </span>
        }
      </div>

      @if (heroHighlights().length) {
        <div class="heroFade hero-dock mt-8 grid max-w-5xl gap-3 sm:grid-cols-3">
          @for (h of heroHighlights().slice(0, 3); track h.label) {
            <article class="group rounded-2xl border border-white/18 bg-white/[0.12] p-4 text-white shadow-[0_20px_70px_rgba(0,0,0,0.20)] transition hover:-translate-y-1 hover:border-kteal-200/50 hover:bg-white/[0.18]">
              <div class="flex items-center gap-3">
                <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-kblue-900 shadow-lg transition group-hover:scale-105">
                  @switch (h.icon) {
                    @case ('bike') { <svg lucideBike class="h-5 w-5"></svg> }
                    @case ('service') { <svg lucideWrench class="h-5 w-5"></svg> }
                    @case ('shield') { <svg lucideShieldCheck class="h-5 w-5"></svg> }
                    @default { <svg lucideSparkles class="h-5 w-5"></svg> }
                  }
                </span>
                <div class="min-w-0">
                  <p class="font-display text-2xl font-bold leading-none">{{ h.value }}</p>
                  <p class="mt-1 truncate text-xs font-bold uppercase tracking-wide text-white/66">{{ h.label }}</p>
                </div>
              </div>
            </article>
          }
        </div>
      }
    </div>

  </section>

  <section class="brand-strip relative overflow-hidden bg-transparent pb-3 pt-8 text-white">
    <div class="section-shell">
      <div class="brand-head mb-5 flex items-center justify-between gap-4">
        <p class="eyebrow">Brands we represent</p>
        <span class="brand-pulse" aria-hidden="true"></span>
      </div>
    </div>
    <div class="brand-track-wrap relative overflow-hidden">
      <div class="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-[rgba(5,22,28,0.82)] to-transparent"></div>
      <div class="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-[rgba(5,22,28,0.82)] to-transparent"></div>
      <div class="marquee flex w-max items-center gap-4 px-4 sm:gap-5 sm:px-6">
        @for (b of brandReel(); track $index) {
          <span class="brand-word font-display text-2xl font-bold uppercase tracking-tight sm:text-4xl">{{ b }}</span>
        }
      </div>
    </div>
  </section>

  <app-feature-grid/>

  <section id="about" class="home-story snap-full snap-center relative overflow-hidden bg-transparent py-16 text-white sm:py-24">
    <div class="section-shell w-full">
      <div class="story-grid">
        <div class="revealBlock story-copy">
          <p class="eyebrow">Built for ownership</p>
          <h2 class="mt-4 font-display text-[clamp(2.4rem,5.6vw,4.4rem)] font-bold leading-[1.02] tracking-[-0.01em] text-kblue-50">
            One group for the way Kerala <span class="text-gradient">buys, rides, services</span> and upgrades.
          </h2>
          <div class="story-spine mt-8">
            @for (s of stats(); track s.label; let i = $index) {
              <article class="story-stat">
                <span class="story-index">0{{ i + 1 }}</span>
                <div>
                  <p class="font-display text-3xl font-black text-kblue-50 sm:text-4xl"><span class="counter" [attr.data-target]="s.value">{{ s.value }}</span>{{ s.suffix }}</p>
                  <p class="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-kblue-50/58">{{ s.label }}</p>
                </div>
              </article>
            }
          </div>
        </div>

        <div class="revealBlock story-collage">
          <figure class="story-photo story-photo-main">
            <img src="assets/images/IMG_2785.webp" alt="Kallingal Tata authorized service bay"/>
          </figure>
          <figure class="story-photo story-photo-float">
            <img src="assets/images/IMG_2789.webp" alt="Kallingal Chetak electric showroom"/>
          </figure>
          <div class="story-plaque">
            <p class="eyebrow !text-kgreen-600">Retail + service</p>
            <h3 class="mt-2 font-display text-2xl font-black leading-tight text-kblue-900">A connected showroom network.</h3>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="experience" class="journey-stage snap-full snap-center overflow-hidden bg-transparent py-16 text-white sm:py-24">
    <div class="section-shell w-full">
      <div class="journey-layout">
        <div class="revealBlock journey-intro">
          <p class="eyebrow">Experience lanes</p>
          <h2 class="mt-3 font-display text-[clamp(2.4rem,5.6vw,4.4rem)] font-bold leading-tight tracking-[-0.01em]">Every customer path has a <span class="text-gradient">clear next step.</span></h2>
          <p class="mt-5 max-w-md text-sm leading-7 text-white/66">Pick a lane, see the next action, and move from enquiry to ownership without hunting around the site.</p>
          <a routerLink="/contact" fragment="enquiry" class="btn-primary mt-7 w-fit"><app-whatsapp-icon className="mr-2 h-5 w-5"/>Start enquiry</a>
        </div>

        <div class="journey-board">
          @for (o of offers().slice(0, 3); track o.title; let i = $index) {
            <article appTilt3d class="motion-tile journey-card group" [class.journey-card-featured]="i === 0">
              <div class="journey-media">
                <img [src]="o.imageUrl" [alt]="o.title"/>
                <span class="journey-no">0{{ i + 1 }}</span>
                <span class="icon-badge journey-icon h-11 w-11">
                  @switch (o.icon) {
                    @case ('bike') { <svg lucideBike class="h-5 w-5"></svg> }
                    @case ('service') { <svg lucideWrench class="h-5 w-5"></svg> }
                    @case ('shield') { <svg lucideShieldCheck class="h-5 w-5"></svg> }
                  }
                </span>
                <h3 class="journey-media-name font-display font-black uppercase">{{ o.title }}</h3>
              </div>
              <div class="journey-body">
                <p class="eyebrow">{{ o.tag }}</p>
                <h3 class="mt-2 font-display text-2xl font-black text-kblue-900">{{ o.title }}</h3>
                <p class="mt-3 text-sm leading-6 text-ink/70">{{ o.text }}</p>
                <a [routerLink]="o.link" class="kinetic-link mt-5">Open section <svg lucideArrowRight class="h-4 w-4"></svg></a>
              </div>
            </article>
          }
        </div>
      </div>
    </div>
  </section>

  <section id="films" #filmsSection class="film-stage snap-full snap-center relative overflow-hidden bg-transparent py-16 text-white sm:py-24">
    <div class="film-aurora pointer-events-none absolute -left-28 top-14 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(6,161,84,.16),transparent_68%)]"></div>
    <div class="film-aurora pointer-events-none absolute -right-20 bottom-12 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(30,112,173,.12),transparent_68%)]" style="animation-delay:-5s"></div>

    <div class="section-shell relative">
      <div class="grid gap-8 lg:grid-cols-[1fr_0.55fr] lg:items-end">
        <div class="revealBlock">
          <p class="eyebrow !text-kteal-200">Product films</p>
          <h2 class="film-title mt-3 font-display font-bold uppercase leading-[0.9]">Watch the network move.</h2>
        </div>
        <p class="revealBlock max-w-xl text-sm leading-7 text-white/70 lg:justify-self-end">
          Get a closer look at the Bajaj range, Chetak EV and our Tata service experience — straight from the Kallingal showroom floor.
        </p>
      </div>

      <div class="film-grid mt-10 grid gap-5 xl:grid-cols-[1fr_360px]">
        <article class="video-frame overflow-hidden rounded-lg border border-white/15 bg-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.35)]">
          <div class="relative aspect-video bg-black">
            @if (playing()) {
              <iframe [src]="featuredVideo().url" [title]="featuredVideo().title" class="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
              <div class="pointer-events-none absolute left-4 top-4 rounded-full border border-white/25 bg-black/40 px-3 py-1 text-xs font-bold uppercase text-white/90">
                Muted autoplay
              </div>
            } @else {
              <button type="button" (click)="playing.set(true)" class="video-poster absolute inset-0 block h-full w-full overflow-hidden text-left">
                @if (featuredVideo().thumb) {
                  <img [src]="featuredVideo().thumb" [alt]="featuredVideo().title" class="h-full w-full object-cover"/>
                }
                <span class="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.76),rgba(0,0,0,0.24)),linear-gradient(0deg,rgba(0,0,0,0.55),transparent)]"></span>
                <span class="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                  <span>
                    <span class="block text-xs font-bold uppercase text-kteal-200">{{ featuredVideo().tag }}</span>
                    <span class="mt-1 block font-display text-3xl font-bold text-white">{{ featuredVideo().title }}</span>
                  </span>
                  <span class="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white text-kblue-900 shadow-2xl">
                    <svg lucidePlay class="ml-1 h-7 w-7 fill-current"></svg>
                  </span>
                </span>
              </button>
            }
          </div>
          <div class="grid gap-5 p-5 sm:p-6 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p class="eyebrow !text-kteal-200">{{ featuredVideo().tag }}</p>
              <h3 class="mt-2 font-display text-3xl font-bold">{{ featuredVideo().title }}</h3>
              <p class="mt-2 max-w-2xl text-sm leading-7 text-white/70">{{ featuredVideo().caption }}</p>
            </div>
            <a routerLink="/products" class="btn-primary w-fit">
              View products <svg lucideArrowRight class="ml-2 h-4 w-4"></svg>
            </a>
          </div>
        </article>

        <div class="grid gap-3">
          @for (v of videos(); track v.id; let i = $index) {
            <button type="button" (click)="selectVideo(i)"
              class="video-choice group grid grid-cols-[88px_1fr_auto] items-center gap-3 rounded-lg border p-2 text-left transition"
              [class.video-choice-active]="activeVideo() === i"
              [attr.aria-pressed]="activeVideo() === i">
              <img [src]="v.thumb" [alt]="v.title" class="h-16 w-24 rounded-lg object-cover"/>
              <span class="min-w-0">
                <span class="block text-xs font-bold uppercase opacity-70">0{{ i + 1 }} | {{ v.tag }}</span>
                <span class="mt-1 block truncate font-display text-lg font-bold">{{ v.title }}</span>
              </span>
              <span class="flex h-10 w-10 items-center justify-center rounded-full bg-kteal-600 text-white transition group-hover:bg-kgreen-600">
                <svg lucidePlay class="h-4 w-4 fill-current"></svg>
              </span>
            </button>
          }
        </div>
      </div>
    </div>
  </section>

  <section id="network" class="network-stage snap-full snap-center relative overflow-hidden bg-transparent py-16 text-white sm:py-24">
    <div class="section-shell relative z-10">
      <div class="network-layout">
        <div class="revealBlock network-copy">
          <p class="eyebrow">Network signal</p>
          <h2 class="mt-3 font-display text-[clamp(2.4rem,5.6vw,4.4rem)] font-bold leading-[0.98] tracking-[-0.01em]">One operating network, <span class="text-gradient">many customer touchpoints.</span></h2>
          <p class="mt-5 max-w-lg text-sm leading-7 text-white/66">Sales, service, support and showroom activity stay connected so every visit, call and follow-up moves through one trusted network.</p>
        </div>

        <div class="revealBlock network-radar">
          <div class="network-ring network-ring-1"></div>
          <div class="network-ring network-ring-2"></div>
          <div class="network-core">
            <span>KG</span>
            <p>Connected<br/>network</p>
          </div>
          @for (h of heroHighlights().slice(0, 3); track h.label; let i = $index) {
            <article class="network-node" [class.network-node-b]="i === 1" [class.network-node-c]="i === 2">
              <span class="icon-badge h-11 w-11">
                @switch (h.icon) {
                  @case ('bike') { <svg lucideBike class="h-5 w-5"></svg> }
                  @case ('service') { <svg lucideWrench class="h-5 w-5"></svg> }
                  @case ('shield') { <svg lucideShieldCheck class="h-5 w-5"></svg> }
                }
              </span>
              <span>
                <strong>{{ h.value }}</strong>
                <em>{{ h.label }}</em>
              </span>
            </article>
          }
        </div>
      </div>
    </div>
  </section>

  <app-testimonials/>

  <app-faq/>

  <section id="connect" class="snap-full snap-center relative overflow-hidden bg-transparent py-16 text-white sm:py-24">
    <div class="section-shell relative grid gap-8 lg:grid-cols-[1fr_0.7fr] lg:items-center">
      <div class="revealBlock">
        <p class="eyebrow !text-kteal-200">Ready when you are</p>
        <h2 class="mt-3 font-display text-[clamp(2.4rem,5.6vw,4.4rem)] font-bold leading-tight tracking-[-0.01em]">Call, WhatsApp, or walk into the nearest showroom.</h2>
      </div>
      <div class="revealBlock flex flex-col gap-3 sm:flex-row lg:justify-end">
        <a routerLink="/contact" fragment="enquiry" class="btn-primary">
          <app-whatsapp-icon className="mr-2 h-5 w-5"/>Enquire now
        </a>
        <a routerLink="/showrooms" class="btn-outline !border-white/50 !bg-white/10 !text-white hover:!bg-white hover:!text-kblue-800">
          <svg lucideMapPin class="mr-2 h-4 w-4"></svg>Find showroom
        </a>
      </div>
    </div>
  </section>`,
  styles: [`
    .hero-stage {
      min-height: clamp(38rem, 88svh, 52rem);
    }
    .hero-3d {
      min-height: clamp(38rem, 88svh, 52rem);
    }
    .hero-title {
      font-size: clamp(2.5rem, 8.2vw, 7.4rem);
      letter-spacing: .012em;
      line-height: 1;
      max-width: min(100%, 12ch);
    }
    .hero-stage::before {
      content: "";
      position: absolute;
      inset: 5.4rem 1rem 1rem;
      z-index: -12;
      pointer-events: none;
      border-radius: 2rem;
      border: 1px solid rgba(30,112,173,.18);
      background:
        linear-gradient(90deg, rgba(6,161,84,.42), transparent 18%, transparent 82%, rgba(30,112,173,.28)) top / 100% 1px no-repeat,
        linear-gradient(180deg, rgba(6,161,84,.30), transparent 28%, transparent 70%, rgba(30,112,173,.24)) right / 1px 100% no-repeat;
      opacity: .78;
    }
    @keyframes kenburns {
      0%   { transform: scale(1.03) translate(0, 0); }
      50%  { transform: scale(1.065) translate(-.8%, -.6%); }
      100% { transform: scale(1.04) translate(.8%, .5%); }
    }
    /* The hero video is a dim, atmospheric backdrop — not a crisp foreground
       clip. Brightness is pulled well down (with a darkening overlay on top) so
       it reads as quiet background motion behind the headline, matching the
       cinematic, deep look of the rest of the site. */
    .hero-media {
      animation: kenburns 30s ease-in-out infinite alternate;
      opacity: 0.9;
      filter: brightness(0.46) saturate(1.04) contrast(1.05);
      image-rendering: -webkit-optimize-contrast;
      object-position: center 32%;
    }
    .hero-dock {
      perspective: 900px;
    }
    .hero-dock article {
      transform: translateZ(0);
    }
    .hero-dock article:hover {
      transform: translateY(-4px) rotateX(2deg);
    }
    .hero-3d::after {
      content: "";
      position: absolute;
      right: 1.5rem;
      bottom: 1.5rem;
      width: 8rem;
      height: 8rem;
      border-right: 1px solid rgba(6,161,84,.42);
      border-bottom: 1px solid rgba(6,161,84,.42);
      border-bottom-right-radius: 1.5rem;
      pointer-events: none;
      opacity: .82;
    }
    .home-story::after,
    .journey-stage::after,
    .film-stage::after,
    .network-stage::after {
      content: "";
      position: absolute;
      left: max(1rem, calc((100vw - 80rem) / 2));
      right: max(1rem, calc((100vw - 80rem) / 2));
      top: 0;
      height: 1px;
      pointer-events: none;
      background: linear-gradient(90deg, transparent, rgba(6,161,84,.44), rgba(30,112,173,.28), transparent);
      opacity: .82;
    }
    .home-story::before,
    .journey-stage::before,
    .network-stage::before {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      background:
        linear-gradient(180deg, rgba(2,10,12,.46), rgba(5,18,18,.30) 50%, rgba(2,10,12,.48)),
        radial-gradient(680px 340px at 12% 12%, rgba(6,161,84,.10), transparent 64%),
        radial-gradient(720px 420px at 88% 76%, rgba(30,112,173,.07), transparent 66%);
    }
    .story-grid {
      display: grid;
      align-items: center;
      gap: clamp(2rem, 5vw, 5rem);
      grid-template-columns: minmax(0, .92fr) minmax(0, 1.08fr);
    }
    .story-spine {
      position: relative;
      display: grid;
      gap: .9rem;
      max-width: 36rem;
    }
    .story-spine::before {
      content: "";
      position: absolute;
      left: 1.25rem;
      top: 1.6rem;
      bottom: 1.6rem;
      width: 2px;
      border-radius: 999px;
      background: linear-gradient(180deg, #06a154, rgba(30,112,173,.54), transparent);
    }
    .story-stat {
      position: relative;
      display: grid;
      grid-template-columns: 2.6rem minmax(0, 1fr);
      gap: 1rem;
      align-items: center;
      border: 1px solid rgba(6,161,84,.18);
      border-radius: 1.1rem;
      background: linear-gradient(135deg, rgba(244,241,234,.10), rgba(255,255,255,.045));
      padding: .9rem 1rem;
      box-shadow: inset 0 1px 0 rgba(255,255,255,.08);
    }
    .story-stat:nth-child(even) { margin-left: 2.4rem; }
    .story-index {
      display: inline-flex;
      height: 2.5rem;
      width: 2.5rem;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      background: #f4f1ea;
      color: #05161c;
      font-size: .72rem;
      font-weight: 950;
      box-shadow: 0 0 0 5px #072029, 0 14px 30px rgba(0,0,0,.22);
    }
    .story-collage {
      position: relative;
      min-height: 31rem;
    }
    .story-photo {
      position: absolute;
      overflow: hidden;
      border: 1px solid rgba(6,161,84,.24);
      background: #0a2730;
      box-shadow: 0 30px 90px rgba(0,0,0,.34);
    }
    .story-photo img {
      height: 100%;
      width: 100%;
      object-fit: cover;
      transition: transform .75s ease;
    }
    .story-photo:hover img { transform: scale(1.06); }
    .story-photo-main {
      inset: 0 6rem 5.2rem 0;
      border-radius: 2rem;
    }
    .story-photo-float {
      right: 0;
      bottom: 0;
      height: 16.2rem;
      width: min(54%, 24rem);
      border-radius: 1.4rem;
    }
    .story-plaque {
      position: absolute;
      left: 2rem;
      bottom: 1.4rem;
      width: min(20rem, 72%);
      border: 1px solid rgba(6,161,84,.28);
      border-radius: 1.2rem;
      background: #f4f1ea;
      padding: 1.15rem;
      color: #05161c;
      box-shadow: 0 24px 70px rgba(0,0,0,.26);
    }
    .journey-layout {
      display: grid;
      align-items: center;
      gap: clamp(2rem, 5vw, 4.5rem);
      grid-template-columns: .78fr 1.22fr;
    }
    .journey-board {
      position: relative;
      display: grid;
      grid-template-columns: repeat(12, minmax(0, 1fr));
      gap: 1rem;
      min-height: 34rem;
    }
    .journey-board::before {
      content: "";
      position: absolute;
      inset: 14% 6% 12% 7%;
      border: 1px solid rgba(6,161,84,.16);
      border-radius: 2rem;
      transform: rotate(-3deg);
      pointer-events: none;
    }
    .journey-card {
      position: relative;
      overflow: hidden;
      display: grid;
      grid-template-rows: 14rem 1fr;
      border: 1px solid rgba(6,161,84,.22);
      border-radius: 1.35rem;
      background: #f4f1ea;
      color: #05161c;
      box-shadow: 0 26px 76px rgba(0,0,0,.30);
    }
    .journey-card:nth-child(1) {
      grid-column: 1 / span 7;
      grid-row: 1 / span 2;
      min-height: 31rem;
    }
    .journey-card:nth-child(2) {
      grid-column: 7 / span 6;
      grid-row: 1;
      transform: translateY(2rem);
    }
    .journey-card:nth-child(3) {
      grid-column: 6 / span 7;
      grid-row: 2;
      transform: translateY(-1rem);
    }
    .journey-card-featured { grid-template-rows: 19rem 1fr; }
    .journey-media {
      position: relative;
      overflow: hidden;
      background: #05161c;
    }
    .journey-media img {
      height: 100%;
      width: 100%;
      object-fit: cover;
      transition: transform .75s ease, filter .75s ease;
    }
    .journey-card:hover .journey-media img {
      transform: scale(1.06);
      filter: saturate(1.08) contrast(1.04);
    }
    .journey-media::after {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(0,0,0,.04), rgba(0,0,0,.48));
    }
    .journey-no {
      position: absolute;
      left: 1rem;
      bottom: .85rem;
      z-index: 1;
      font-family: "Sora", sans-serif;
      font-size: clamp(2.2rem, 5vw, 4rem);
      font-weight: 900;
      line-height: 1;
      color: rgba(255,255,255,.86);
    }
    .journey-icon {
      position: absolute;
      right: 1rem;
      top: 1rem;
      z-index: 1;
    }
    .journey-body { padding: 1.35rem; }
    .journey-media-name { display: none; }
    .network-layout {
      display: grid;
      align-items: center;
      gap: clamp(2rem, 5vw, 5rem);
      grid-template-columns: .8fr 1.2fr;
    }
    .network-radar {
      position: relative;
      min-height: 36rem;
      border-radius: 2rem;
      overflow: hidden;
      background:
        radial-gradient(circle at center, rgba(6,161,84,.12), transparent 12%),
        radial-gradient(circle at center, rgba(6,161,84,.08), transparent 42%),
        linear-gradient(135deg, rgba(244,241,234,.07), rgba(255,255,255,.025));
      border: 1px solid rgba(6,161,84,.18);
      box-shadow: inset 0 1px 0 rgba(255,255,255,.08), 0 30px 90px rgba(0,0,0,.28);
    }
    .network-ring {
      position: absolute;
      inset: 14%;
      border: 1px solid rgba(6,161,84,.18);
      border-radius: 999px;
    }
    .network-ring-2 {
      inset: 28%;
      border-color: rgba(6,161,84,.26);
    }
    .network-core {
      position: absolute;
      left: 50%;
      top: 50%;
      display: grid;
      height: 9.8rem;
      width: 9.8rem;
      place-items: center;
      transform: translate(-50%, -50%);
      border-radius: 999px;
      background: #f4f1ea;
      color: #05161c;
      text-align: center;
      box-shadow: 0 24px 70px rgba(0,0,0,.34), 0 0 0 12px rgba(244,241,234,.08);
    }
    .network-core span {
      font-family: "Sora", sans-serif;
      font-size: 2.1rem;
      font-weight: 950;
      line-height: 1;
    }
    .network-core p {
      margin-top: -1rem;
      font-size: .68rem;
      font-weight: 900;
      line-height: 1.2;
      text-transform: uppercase;
      letter-spacing: .16em;
      color: rgba(7,6,4,.62);
    }
    .network-node {
      position: absolute;
      left: 9%;
      top: 14%;
      display: flex;
      width: min(18rem, 42%);
      align-items: center;
      gap: .85rem;
      border: 1px solid rgba(6,161,84,.22);
      border-radius: 1.2rem;
      background: #f4f1ea;
      padding: .9rem;
      color: #05161c;
      box-shadow: 0 22px 64px rgba(0,0,0,.28);
    }
    .network-node-b {
      left: auto;
      right: 7%;
      top: 44%;
    }
    .network-node-c {
      left: 18%;
      top: auto;
      bottom: 11%;
    }
    .network-node strong {
      display: block;
      font-family: "Sora", sans-serif;
      font-size: 1.55rem;
      line-height: 1;
    }
    .network-node em {
      display: block;
      margin-top: .25rem;
      font-style: normal;
      font-size: .72rem;
      font-weight: 900;
      line-height: 1.25;
      text-transform: uppercase;
      letter-spacing: .1em;
      color: rgba(7,6,4,.58);
    }
    .statement-title { font-size: clamp(2.7rem, 7.8vw, 7.5rem); }
    .film-title { font-size: clamp(3rem, 9vw, 8.5rem); }
    .brand-strip {
      isolation: isolate;
    }
    .brand-strip::before {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      background:
        radial-gradient(620px 180px at 8% 0%, rgba(6,161,84,.12), transparent 64%),
        linear-gradient(180deg, rgba(255,255,255,.035), transparent 72%);
    }
    .brand-head {
      border-top: 1px solid rgba(255,255,255,.10);
      padding-top: 1rem;
    }
    .brand-pulse {
      position: relative;
      display: inline-flex;
      height: .55rem;
      width: min(12rem, 34vw);
      overflow: hidden;
      border-radius: 999px;
      background: rgba(255,255,255,.08);
      box-shadow: inset 0 1px 0 rgba(255,255,255,.10);
    }
    .brand-pulse::after {
      content: "";
      position: absolute;
      inset: 0 auto 0 0;
      width: 42%;
      border-radius: inherit;
      background: linear-gradient(90deg, #06a154, #1e70ad);
    }
    .brand-track-wrap {
      padding-block: .65rem;
      border-block: 1px solid rgba(255,255,255,.08);
      background: linear-gradient(90deg, rgba(255,255,255,.04), rgba(255,255,255,.015));
    }
    .brand-word {
      display: inline-flex;
      align-items: center;
      min-height: 4.8rem;
      white-space: nowrap;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,.12);
      background:
        linear-gradient(135deg, rgba(255,255,255,.08), rgba(255,255,255,.02)),
        radial-gradient(220px 90px at 0% 0%, rgba(6,161,84,.16), transparent 70%);
      color: rgba(244,241,234,0.52);
      padding: .9rem 1.3rem;
      box-shadow: inset 0 1px 0 rgba(255,255,255,.10);
      transition: color .3s, transform .3s, text-shadow .3s, border-color .3s, background .3s;
    }
    .brand-word:hover {
      color: #1e70ad;
      transform: translateY(-2px);
      border-color: rgba(30,112,173,.32);
      text-shadow: 0 10px 34px rgba(6,161,84,.22);
    }
    .film-stage { isolation: isolate; }
    @keyframes auroraDrift {
      0%, 100% { transform: translate3d(0, 0, 0) scale(1); opacity: .52; }
      45% { transform: translate3d(20px, -16px, 0) scale(1.1); opacity: .78; }
      75% { transform: translate3d(-12px, 12px, 0) scale(.96); opacity: .46; }
    }
    .film-aurora { animation: auroraDrift 13s ease-in-out infinite; }
    .video-frame {
      position: relative;
      box-shadow: 0 36px 110px rgba(0,0,0,.38), 0 0 0 1px rgba(255,255,255,.06) inset;
      transform: translateZ(0);
    }
    .video-frame::before {
      content: "";
      position: absolute;
      inset: -1px;
      z-index: 0;
      border-radius: inherit;
      background: linear-gradient(135deg, rgba(6,161,84,.48), transparent 34%, rgba(30,112,173,.24) 68%, rgba(244,241,234,.22));
      opacity: .48;
      pointer-events: none;
    }
    .video-frame > * { position: relative; z-index: 1; }
    .video-frame iframe { display: block; background: #000; }
    .video-poster::after {
      content: "";
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 74% 32%, rgba(6,161,84,.20), transparent 28%);
      opacity: .74;
      transition: opacity .35s ease, transform .55s ease;
      pointer-events: none;
    }
    .video-poster:hover::after { opacity: 1; transform: scale(1.08); }
    .video-choice {
      border-color: rgba(255,255,255,.15);
      background: rgba(255,255,255,.10);
      color: #fff;
      box-shadow: 0 14px 34px rgba(0,0,0,.16), inset 0 1px 0 rgba(255,255,255,.08);
    }
    .video-choice:hover { transform: translateX(4px); border-color: rgba(6,161,84,.52); background: rgba(255,255,255,.15); }
    .video-choice-active { border-color: #06a154; background: #f4f1ea; color: #05161c; box-shadow: 0 22px 48px rgba(6,161,84,.18); }
    @media (max-width: 1023px) {
      .hero-3d {
        justify-content: center;
        min-height: 82svh;
        padding-top: 5.9rem;
        padding-bottom: 1.35rem;
      }
      .hero-title {
        max-width: 10ch;
        font-size: clamp(2.65rem, 10.8vw, 5.1rem);
        line-height: 1;
      }
      .story-grid,
      .journey-layout,
      .network-layout {
        grid-template-columns: 1fr;
      }
      .story-collage {
        min-height: 27rem;
      }
      .story-photo-main {
        inset: 0 0 6rem 0;
      }
      .story-photo-float {
        width: 56%;
        height: 13rem;
      }
      .story-plaque {
        left: 1rem;
        bottom: 1rem;
      }
      .journey-board {
        display: flex;
        min-height: 0;
        gap: 1rem;
        margin-inline: -1rem;
        overflow-x: auto;
        padding: .35rem 1rem 1.25rem;
        scroll-padding-inline: 1rem;
      }
      .journey-board::before { display: none; }
      .journey-card,
      .journey-card:nth-child(1),
      .journey-card:nth-child(2),
      .journey-card:nth-child(3) {
        grid-column: auto;
        grid-row: auto;
        min-height: 0;
        min-width: min(84vw, 25rem);
        transform: none;
      }
      .journey-card-featured {
        grid-template-rows: 13rem 1fr;
      }
      .network-radar {
        display: grid;
        gap: .9rem;
        min-height: 0;
        padding: 1rem;
      }
      .network-ring { display: none; }
      .network-core {
        position: relative;
        left: auto;
        top: auto;
        height: auto;
        width: auto;
        min-height: 6.5rem;
        transform: none;
        border-radius: 1.3rem;
      }
      .network-node,
      .network-node-b,
      .network-node-c {
        position: relative;
        inset: auto;
        width: 100%;
      }
    }
    @media (max-width: 640px) {
      /* On a portrait phone a 16:9 video is heavily cropped by object-cover.
         Drop the extra Ken-Burns zoom so it isn't blown up further, and frame
         it a touch higher so the showroom/subject stays in view. */
      .hero-media {
        animation: none;
        transform: scale(1.02);
        object-position: center 34%;
      }
      .hero-stage::after {
        content: "";
        position: absolute;
        inset: auto 0 0 0;
        height: 46%;
        pointer-events: none;
        background: linear-gradient(180deg, transparent, rgba(7,6,4,.46) 54%, rgba(5,22,28,.70));
      }
      .hero-3d {
        min-height: 78svh;
        justify-content: flex-end;
        padding-top: 5.6rem;
        padding-bottom: calc(3.25rem + env(safe-area-inset-bottom));
      }
      .hero-stage::before { inset: 5.25rem .75rem 3.8rem; border-radius: 1.35rem; opacity: .38; }
      .hero-3d::after { display: none; }
      .hero-title {
        max-width: 10ch;
        font-size: clamp(2.18rem, 10.8vw, 3.55rem);
        line-height: 1;
        text-shadow: 0 18px 60px rgba(6,161,84,.20);
      }
      /* Full-width, premium CTAs that read as the clear next step on a phone */
      .hero-3d .heroFade.flex.flex-col { gap: .7rem; width: 100%; }
      .hero-stage .btn-primary,
      .hero-stage .btn-outline {
        width: 100%;
        min-height: 3.4rem;
        font-size: 1.02rem;
        letter-spacing: .01em;
      }
      .hero-stage .btn-primary {
        box-shadow: 0 18px 40px rgba(6,161,84,.36), inset 0 1px 0 rgba(255,255,255,.22);
      }
      .heroFade.mb-5 {
        margin-bottom: .8rem;
        gap: .45rem;
      }
      .heroFade.mb-5 span {
        max-width: 100%;
        padding: .48rem .72rem;
        font-size: .62rem;
      }
      .heroFade.mt-9 {
        display: flex;
        flex-wrap: wrap;
        gap: .5rem;
        margin-top: 1.15rem;
      }
      .heroFade.mt-9 .glass-chip {
        padding: .5rem .72rem;
        font-size: .74rem;
      }
      /* Hide the hero highlight dock on phones — it crowds the hero and the
         same highlights appear in the feature grid and Network section. */
      .hero-dock { display: none; }
      .hero-stage .btn-primary,
      .hero-stage .btn-outline {
        min-height: 3.15rem;
      }
      .hero-stage .mt-7 {
        margin-top: 1rem;
        gap: .9rem;
      }
      .hero-stage .mt-7 p {
        max-width: 28rem;
        font-size: .95rem;
        line-height: 1.65;
      }
      .brand-strip {
        padding-top: 1.6rem;
      }
      .brand-head {
        align-items: flex-start;
      }
      .brand-pulse {
        width: 5.5rem;
      }
      .brand-track-wrap {
        padding-block: .5rem;
      }
      .brand-word {
        min-height: 3.85rem;
        padding: .75rem 1rem;
        font-size: 1.18rem;
      }
      .story-spine::before { left: 1.06rem; }
      .story-stat {
        grid-template-columns: 2.2rem minmax(0, 1fr);
        gap: .8rem;
        padding: .82rem;
      }
      .story-stat:nth-child(even) { margin-left: 1rem; }
      .story-index {
        height: 2.15rem;
        width: 2.15rem;
        box-shadow: 0 0 0 4px #072029, 0 12px 24px rgba(0,0,0,.22);
      }
      .story-collage {
        min-height: 23rem;
      }
      .story-photo-main {
        inset: 0 0 7.2rem 0;
        border-radius: 1.35rem;
      }
      .story-photo-float {
        right: .5rem;
        height: 10.5rem;
        width: 52%;
        border-radius: 1rem;
      }
      .story-plaque {
        width: 68%;
        padding: .95rem;
      }
      .journey-intro .btn-primary {
        width: 100%;
      }
      /* Immersive stack: full-bleed image card + solid caption panel (no carousel) */
      .journey-board {
        display: grid;
        grid-template-columns: 1fr;
        gap: 2.5rem;
        margin-inline: 0;
        overflow: visible;
        padding: 0;
      }
      .journey-card,
      .journey-card:nth-child(1),
      .journey-card:nth-child(2),
      .journey-card:nth-child(3),
      .journey-card-featured {
        display: block;
        min-width: 0;
        min-height: 0;
        border: 0;
        background: transparent;
        box-shadow: none;
        grid-template-rows: none;
      }
      .journey-media {
        height: auto;
        aspect-ratio: 4 / 5;
        border-radius: 1.6rem;
        box-shadow: 0 34px 80px rgba(0,0,0,0.6);
      }
      .journey-media::after { background: linear-gradient(180deg, rgba(7,6,4,0.22) 0%, transparent 26%, rgba(7,6,4,0.6) 60%, rgba(7,6,4,0.95) 100%); }
      .journey-no { left: 1.1rem; top: 1rem; bottom: auto; font-size: 1.4rem; opacity: .9; }
      .journey-media-name {
        display: block;
        position: absolute;
        inset-inline: 1.2rem;
        bottom: 1.1rem;
        z-index: 2;
        font-size: clamp(2rem, 10vw, 2.8rem);
        line-height: .94;
        letter-spacing: -0.01em;
        color: #fff;
        text-shadow: 0 6px 28px rgba(0,0,0,0.65);
      }
      .journey-body {
        position: relative;
        z-index: 3;
        margin: -2rem 0.9rem 0;
        border-radius: 1.4rem;
        border: 1px solid rgba(6,161,84,0.26);
        background:
          radial-gradient(260px 130px at 100% 0%, rgba(30,112,173,0.13), transparent 62%),
          linear-gradient(160deg, rgba(22,19,12,0.98), rgba(7,6,4,0.97));
        padding: 1.3rem 1.2rem 1.4rem;
        box-shadow: 0 26px 64px rgba(0,0,0,0.55);
        color: #f1ede3;
      }
      .journey-body h3 { display: none; }
      .journey-body p { color: rgba(244,241,234,0.72) !important; }
      .journey-body .kinetic-link { color: #63d99b; }
      /* Immersive network panel: dark core + logo-railed nodes */
      .network-radar {
        border-radius: 1.4rem;
        gap: .8rem;
        padding: 1rem;
        background:
          radial-gradient(420px 220px at 50% -10%, rgba(6,161,84,.16), transparent 64%),
          linear-gradient(160deg, rgba(20,17,11,0.6), rgba(7,6,4,0.45));
        box-shadow: inset 0 1px 0 rgba(255,255,255,.06), 0 30px 70px rgba(0,0,0,.5);
      }
      .network-core {
        min-height: 0;
        padding: 1.2rem;
        gap: .15rem;
        background: linear-gradient(135deg, #63d99b, #06a154 56%, #1e70ad);
        color: #05161c;
        box-shadow: 0 18px 44px rgba(6,161,84,.30);
      }
      .network-core span { font-size: 1.85rem; }
      .network-core p { color: rgba(7,6,4,.7); }
      .network-node {
        position: relative;
        overflow: hidden;
        padding: .9rem 1rem .9rem 1.15rem;
        border-radius: 1.05rem;
        border-color: rgba(6,161,84,.22);
        background: linear-gradient(160deg, rgba(31,29,26,0.96), rgba(7,6,4,0.92));
        box-shadow: 0 16px 38px rgba(0,0,0,.45);
      }
      .network-node::before {
        content: "";
        position: absolute;
        left: 0; top: 0; bottom: 0;
        width: 3px;
        background: linear-gradient(180deg, #63d99b, #06a154);
      }
      .network-node strong { color: #fbf7ec; font-size: 1.7rem; }
      .network-node em { color: rgba(6,161,84,.8); }
      .film-grid {
        grid-template-columns: 1fr;
      }
      .video-choice {
        grid-template-columns: 76px 1fr 2.25rem;
        border-radius: 1.05rem;
        padding: .55rem;
        box-shadow: 0 16px 36px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.07);
      }
      .video-choice img {
        height: 3.6rem;
        width: 4.75rem;
        border-radius: .85rem;
      }
    }
    @media (max-width: 420px) {
      .hero-title { font-size: clamp(1.95rem, 10.2vw, 2.9rem); }
      .hero-stage .btn-primary,
      .hero-stage .btn-outline {
        width: 100%;
      }
    }
  `]
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  private sanitizer = inject(DomSanitizer);
  private api = inject(ApiService);
  @ViewChild('heroVideo') heroVideo?: ElementRef<HTMLVideoElement>;
  @ViewChild('filmsSection') filmsSection?: ElementRef<HTMLElement>;
  private videoTimer = 0;
  private heroVideoBound = false;
  private tryPlayHero: () => void = () => {};
  private heroVisIO?: IntersectionObserver;
  private filmsIO?: IntersectionObserver;
  private marqueeIO?: IntersectionObserver;
  private heroInView = true;
  private tilesAnimated = false;
  private readonly videoUnlockEvents = ['click', 'keydown', 'touchstart', 'pointerup'];
  private videoKick?: () => void;
  heroPaused = signal(true);
  activeVideo = signal(0);
  playing = signal(false);
  homeHero = signal<PageHero | null>(null);

  brandReel = signal<string[]>([]);
  heroHighlights = signal<HomeHighlight[]>([]);
  stats = signal<SiteStat[]>([]);
  videos = signal<VideoItem[]>([]);
  offers = signal<HomeOffer[]>([]);

  featuredVideo() {
    return this.videos()[this.activeVideo()] ?? this.emptyVideo();
  }

  selectVideo(index: number) {
    this.activeVideo.set(index);
    this.playing.set(true);
  }

  private video(id: string, title: string, tag: string, caption: string): VideoItem {
    return {
      id,
      title,
      tag,
      caption,
      thumb: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
      url: this.videoUrl(id)
    };
  }

  private videoUrl(id: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=1&playsinline=1&rel=0&modestbranding=1`
    );
  }

  private emptyVideo(): VideoItem {
    return {
      id: '',
      title: '',
      tag: '',
      caption: '',
      thumb: '',
      url: this.sanitizer.bypassSecurityTrustResourceUrl('about:blank')
    };
  }

  heroTitlePart(index: number) {
    return (this.homeHero()?.title || '').split('|')[index] || '';
  }

  heroChips() {
    return this.splitCsv(this.homeHero()?.chips);
  }

  private splitCsv(value?: string | null) {
    return (value || '').split(',').map(v => v.trim()).filter(Boolean);
  }

  ngOnInit(): void {
    this.api.stats().subscribe({ next: v => this.stats.set(v || []), error: () => this.stats.set([]) });
    this.api.pageHero('home').subscribe({
      next: v => {
        this.homeHero.set(v);
        // The hero <video> renders only now (it's behind an @if on this data).
        // Defer one macrotask so Angular paints the element, then bind autoplay.
        if (v?.videoUrl) setTimeout(() => this.setupHeroVideo());
      },
      error: () => this.homeHero.set(null)
    });
    this.api.brands().subscribe({
      next: v => {
        const names = (v || []).map(b => b.name);
        this.brandReel.set([...names, ...names]);
      },
      error: () => this.brandReel.set([])
    });
    this.api.homeHighlights().subscribe({ next: v => this.heroHighlights.set(v || []), error: () => this.heroHighlights.set([]) });
    this.api.homeOffers().subscribe({
      next: v => { this.offers.set(v || []); setTimeout(() => this.animateTiles(), 80); },
      error: () => this.offers.set([])
    });
    this.api.homeVideos().subscribe({
      next: v => this.videos.set((v || []).map(item => this.video(item.youtubeId, item.title, item.tag, item.caption))),
      error: () => this.videos.set([])
    });
  }

  ngAfterViewInit(): void {
    // The hero <video> may already be in the DOM (cached/fast hero data) — bind
    // now if so. If the hero data is still loading, its @if hasn't rendered the
    // element yet, so this is a no-op; setupHeroVideo() is called again the
    // moment the element appears (from the pageHero API subscription). The bind
    // is idempotent, so whichever path wins, it runs exactly once.
    this.setupHeroVideo();

    if (typeof IntersectionObserver !== 'undefined') {
      if (this.filmsSection?.nativeElement) {
        this.filmsIO = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) this.playing.set(true);
          else this.playing.set(false);
        }, { rootMargin: '-18% 0px -18% 0px', threshold: 0.28 });
        this.filmsIO.observe(this.filmsSection.nativeElement);
      }

      // Auto-scrolling image strips are GPU-heavy. Only run them while they're on
      // (or near) screen — paused otherwise — so they never burn frames or fight
      // the scroll when you're elsewhere on the page.
      const marquees = Array.from(document.querySelectorAll<HTMLElement>('.marquee, .marquee-rev'));
      if (marquees.length) {
        this.marqueeIO = new IntersectionObserver(entries => {
          entries.forEach(e => {
            (e.target as HTMLElement).style.animationPlayState = e.isIntersecting ? 'running' : 'paused';
          });
        }, { rootMargin: '200px 0px' });
        marquees.forEach(m => { m.style.animationPlayState = 'paused'; this.marqueeIO!.observe(m); });
      }
    }

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.counter').forEach(el => el.textContent = (el as HTMLElement).dataset['target'] || '0');
      return;
    }

    // Clean, modern reveal — one crisp language: move a little, fade in, fire once.
    gsap.from('.hero-word', { y: 40, autoAlpha: 0, duration: 0.85, ease: 'expo.out', stagger: 0.1, delay: 0.15 });
    gsap.from('.heroFade', { y: 24, autoAlpha: 0, duration: 0.78, ease: 'power3.out', stagger: 0.1, delay: 0.65 });
    this.animateTiles();
    gsap.utils.toArray<HTMLElement>('.revealBlock').forEach((el) => {
      gsap.from(el, {
        y: 28,
        autoAlpha: 0,
        duration: 0.55,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 86%' }
      });
    });

    document.querySelectorAll<HTMLElement>('.counter').forEach(el => {
      const target = Number(el.dataset['target']);
      gsap.fromTo(el, { innerText: 0 }, {
        immediateRender: false,
        innerText: target,
        duration: 1.1,
        ease: 'power1.out',
        snap: { innerText: 1 },
        onUpdate: function () { el.textContent = Math.floor(Number(el.textContent)).toLocaleString('en-IN'); },
        scrollTrigger: { trigger: el, start: 'top 88%' }
      });
    });
  }

  /**
   * Wire up reliable, muted hero-video autoplay. Called both from ngAfterViewInit
   * and from the pageHero API subscription, because the <video> lives inside an
   * @if that only renders once the hero data loads — which usually resolves AFTER
   * ngAfterViewInit. The heroVideoBound guard makes it idempotent so the listeners
   * and retry interval are attached exactly once, the instant the element exists.
   */
  private setupHeroVideo(): void {
    const v = this.heroVideo?.nativeElement;
    if (!v || this.heroVideoBound) return;
    this.heroVideoBound = true;

    // Browsers only allow muted autoplay when the muted *property* (not just the
    // attribute) is set — which Angular's template binding skips.
    v.muted = true;
    v.defaultMuted = true;
    v.playsInline = true;
    v.setAttribute('muted', '');
    v.setAttribute('playsinline', '');

    // On phones a full-screen autoplay video decodes every frame and composites a
    // large layer while you scroll — a real source of stutter — and it burns
    // mobile data. Show the poster (the hero image) instead: never fetch or play.
    if (window.matchMedia('(max-width: 767px)').matches) {
      v.preload = 'none';
      v.removeAttribute('autoplay');
      try { v.pause(); } catch {}
      return;
    }

    // Play only while the hero is on screen; pause when you scroll away.
    const attempt = () => {
      if (!this.heroInView || !v.paused) return;
      v.muted = true;
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    };
    this.tryPlayHero = attempt;
    this.videoKick = attempt;

    if (typeof IntersectionObserver !== 'undefined') {
      this.heroVisIO = new IntersectionObserver(([e]) => {
        this.heroInView = e.isIntersecting;
        if (e.isIntersecting) attempt();
        else if (!v.paused) v.pause();
      }, { threshold: 0.25 });
      const heroSec = document.getElementById('top');
      if (heroSec) this.heroVisIO.observe(heroSec);
    }

    // Retry burst — THE key fix. The opaque preloader overlay covers the hero for
    // ~2.5s, during which Chrome transiently rejects muted autoplay. A one-shot
    // play() therefore fails and never recovers (looked like "only plays after a
    // while"). We keep nudging play() every 350ms until it actually sticks (or we
    // give up after ~9s), which sails past the preloader window.
    let tries = 0;
    this.videoTimer = window.setInterval(() => {
      attempt();
      if ((!v.paused && v.currentTime > 0) || ++tries > 25) {
        clearInterval(this.videoTimer);
        this.videoTimer = 0;
      }
    }, 350);

    ['loadedmetadata', 'loadeddata', 'canplay', 'canplaythrough'].forEach(ev => v.addEventListener(ev, attempt));
    window.addEventListener('preloader:done', attempt);
    // Real activation gestures (click/key/touch) unlock strict autoplay blockers
    // as a final fallback — scroll/wheel do NOT.
    this.videoUnlockEvents.forEach(ev => window.addEventListener(ev, attempt, { passive: true }));

    // Kick once right away in case the preloader is already gone / data is ready.
    attempt();
  }

  onVideoError() {
    const v = this.heroVideo?.nativeElement;
    // Surfaces the real reason (e.g. 404 / decode) in the console for diagnosis.
    console.warn('[hero video] failed to load', v?.error, 'src:', v?.currentSrc || v?.src);
  }

  /**
   * Fly-in for the experience tiles. The tiles render from async API data, so
   * this is called both after view init (usually a no-op — data not in yet) and
   * once the offers arrive. Guarded so it only runs when the tiles exist and
   * never double-animates — which also silences GSAP's "target not found".
   */
  private animateTiles() {
    if (this.tilesAnimated) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const tiles = gsap.utils.toArray<HTMLElement>('.motion-tile');
    if (!tiles.length) return;
    this.tilesAnimated = true;
    gsap.from(tiles, {
      y: 26, autoAlpha: 0, stagger: 0.07, duration: 0.55, ease: 'power3.out',
      scrollTrigger: { trigger: tiles[0], start: 'top 86%' }
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.videoTimer);
    this.heroVisIO?.disconnect();
    this.filmsIO?.disconnect();
    this.marqueeIO?.disconnect();
    if (this.videoKick) this.videoUnlockEvents.forEach(ev => window.removeEventListener(ev, this.videoKick!));
    ScrollTrigger.getAll().forEach(t => t.kill());
  }
}
