import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  LucideMapPin, LucidePhone, LucideQuote, LucideSparkles, LucideBuilding2
} from '@lucide/angular';
import { ApiService, AboutMilestone, AboutBrand, PageHero } from '../../shared/api.service';
import { SettingsService } from '../../shared/settings.service';
import { PageHeroComponent } from '../../shared/page-hero.component';
import { RevealDirective } from '../../shared/reveal.directive';
import { StatsBandComponent } from '../../shared/stats-band.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    RouterLink, PageHeroComponent, RevealDirective, StatsBandComponent,
    LucideMapPin, LucidePhone, LucideQuote, LucideSparkles, LucideBuilding2
  ],
  template: `
  <app-page-hero [eyebrow]="hero()?.eyebrow || 'About us'" [title]="hero()?.title || 'Kallingal|Group'"
    [sub]="hero()?.sub || ''" [image]="hero()?.imageUrl || 'assets/images/showroom-9.webp'" [chips]="heroChips()"/>

  <!-- ABOUT US / intro -->
  <section class="page-band py-16 sm:py-24">
  <div class="section-shell relative z-10">
    <div class="ab-intro">
      <div appReveal class="ab-intro-head">
        <p class="eyebrow">About us</p>
        <h2 class="ab-h2 mt-3 font-display font-black uppercase leading-[0.9]">Kallingal<br/><span class="text-gradient">Group of Companies</span></h2>
      </div>
      <div appReveal [revealDelay]="0.08" class="ab-intro-body">
        @for (p of intro; track $index) { <p class="ab-para">{{ p }}</p> }
        <div class="ab-pills">
          <span class="ab-pill"><svg lucideBuilding2 class="h-3.5 w-3.5"></svg>19+ showrooms</span>
          <span class="ab-pill"><svg lucideSparkles class="h-3.5 w-3.5"></svg>Since 1985</span>
          <span class="ab-pill"><svg lucideMapPin class="h-3.5 w-3.5"></svg>Trivandrum</span>
        </div>
      </div>
    </div>
  </div>
  </section>

  <!-- OUR STORY -->
  <section class="page-band py-16 sm:py-24">
  <div class="section-shell relative z-10">
    <div appReveal class="max-w-2xl">
      <p class="eyebrow">Our story</p>
      <h2 class="ab-h2 mt-3 font-display font-black uppercase leading-[0.9]">A legacy built on<br/><span class="text-gradient">trust.</span></h2>
    </div>
    <div class="ab-story mt-10">
      <div class="ab-story-mark" aria-hidden="true"><svg lucideQuote class="h-10 w-10"></svg></div>
      <div class="ab-story-cols">
        @for (p of story; track $index) {
          <p appReveal [revealDelay]="$index * 0.05" class="ab-para ab-story-para">{{ p }}</p>
        }
      </div>
    </div>
  </div>
  </section>

  <!-- DISCOVER OUR LEGACY (timeline) -->
  <section class="page-band py-16 sm:py-24">
  <div class="section-shell relative z-10">
    <div appReveal class="flex items-end justify-between gap-4 border-b border-white/15 pb-6">
      <div>
        <p class="eyebrow">Milestones</p>
        <h2 class="ab-h2 mt-2 font-display font-black uppercase leading-[0.9]">Discover our <span class="text-gradient">legacy.</span></h2>
      </div>
      <span class="ab-count">{{ pad(milestones().length) }}<span>Steps</span></span>
    </div>

    @if (milestones().length) {
      <ol class="ab-timeline mt-12">
        @for (m of milestones(); track m.id ?? $index; let i = $index) {
          <li appReveal [revealDelay]="i * 0.05" class="ab-mile">
            <span class="ab-mile-dot"></span>
            <div class="ab-mile-card">
              <div class="ab-mile-top">
                <span class="ab-mile-num">{{ pad(i + 1) }}</span>
                @if (m.yearLabel) { <span class="ab-mile-year">{{ m.yearLabel }}</span> }
              </div>
              <h3 class="ab-mile-title font-display font-bold">{{ m.title }}</h3>
              <p class="ab-mile-body">{{ m.body }}</p>
            </div>
          </li>
        }
      </ol>
    } @else {
      <p class="mt-10 text-white/55">Our journey is being written. Check back soon.</p>
    }
  </div>
  </section>

  <!-- BRANDS -->
  <section class="page-band py-16 sm:py-24">
  <div class="section-shell relative z-10">
    <div appReveal class="mx-auto max-w-2xl text-center">
      <p class="eyebrow">Trusted partners</p>
      <h2 class="ab-h2 mt-3 font-display font-black uppercase leading-[0.9]">We offer products &amp;<br/><span class="text-gradient">services of</span></h2>
      <p class="mt-4 text-white/64">The brands behind every sale, service and spare across the Kallingal network.</p>
    </div>
    @if (brands().length) {
      <div class="ab-brands mt-12">
        @for (b of brands(); track b.id ?? b.name; let i = $index) {
          <span appReveal [revealDelay]="(i % 8) * 0.03" class="ab-brand">{{ b.name }}</span>
        }
      </div>
    } @else {
      <p class="mt-10 text-center text-white/55">Our partner brands are being added. Check back soon.</p>
    }
  </div>
  </section>

  <!-- MAP / where to find us -->
  <section class="page-band py-16 sm:py-24">
  <div class="section-shell relative z-10">
    <div class="ab-map-wrap">
      <div appReveal class="ab-map-copy">
        <p class="eyebrow">Where to find us</p>
        <h2 class="ab-h2 mt-3 font-display font-black uppercase leading-[0.9]">Across<br/><span class="text-gradient">Trivandrum.</span></h2>
        <p class="mt-5 max-w-md leading-8 text-white/72">{{ settings.headOffice() || 'A network of 19 showrooms and service centres spanning the Thiruvananthapuram district - sales, service, spares and insurance, always close by.' }}</p>
        <div class="mt-7 flex flex-wrap gap-3">
          <a routerLink="/showrooms" class="btn-primary"><svg lucideMapPin class="mr-2 h-4 w-4"></svg>See all showrooms</a>
          @if (settings.phone()) {
            <a [href]="'tel:' + settings.phone()" class="ab-ghost-btn"><svg lucidePhone class="mr-2 h-4 w-4"></svg>Call us</a>
          }
        </div>
      </div>
      <div appReveal [revealDelay]="0.12" class="ab-map">
        <iframe src="https://maps.google.com/maps?q=8.5241,76.9366&z=11&output=embed"
          class="ab-map-frame" loading="lazy" title="Kallingal Group - Trivandrum"></iframe>
      </div>
    </div>
  </div>
  </section>

  <app-stats-band/>`,
  styles: [`
    .ab-h2 { font-size: clamp(2.2rem, 5.4vw, 4.2rem); color: #fbf7ec; letter-spacing: -0.01em; }
    .ab-para { font-size: 1.02rem; line-height: 1.9; color: rgba(244,241,234,0.74); }
    .ab-para + .ab-para { margin-top: 1.1rem; }

    /* intro: heading left, body right */
    .ab-intro { display: grid; gap: 2.5rem; align-items: start; }
    @media (min-width: 1024px) { .ab-intro { grid-template-columns: 0.85fr 1.15fr; gap: 4rem; } }
    .ab-intro-head { position: sticky; top: 7rem; }
    .ab-pills { margin-top: 1.6rem; display: flex; flex-wrap: wrap; gap: .6rem; }
    .ab-pill {
      display: inline-flex; align-items: center; gap: .4rem;
      border-radius: 999px; border: 1px solid rgba(6,161,84,0.4);
      background: rgba(6,161,84,0.1); padding: .4rem .85rem;
      font-size: .72rem; font-weight: 700; letter-spacing: .04em; color: #6ee7b7;
    }

    /* story */
    .ab-story { position: relative; }
    .ab-story-mark {
      position: absolute; top: -1.4rem; left: -0.4rem; color: rgba(30,112,173,0.34);
      pointer-events: none;
    }
    .ab-story-cols { position: relative; z-index: 1; }
    @media (min-width: 1024px) { .ab-story-cols { columns: 2; column-gap: 3.5rem; } .ab-story-para { break-inside: avoid; } }
    .ab-story-para { margin-bottom: 1.3rem; }

    .ab-count {
      font-family: "Sora", sans-serif; font-size: clamp(2.2rem, 4.4vw, 3.4rem); font-weight: 900; line-height: .8;
      color: rgba(6,161,84,0.9); display: flex; flex-direction: column; align-items: flex-end;
    }
    .ab-count span { font-size: .56rem; letter-spacing: .26em; text-transform: uppercase; color: rgba(244,241,234,0.5); margin-top: .4rem; }

    /* timeline — single gradient spine, glowing dots, glass cards */
    .ab-timeline { position: relative; list-style: none; margin: 0; padding: 0 0 0 2.2rem; }
    .ab-timeline::before {
      content: ""; position: absolute; left: 0.5rem; top: .4rem; bottom: .4rem; width: 2px;
      background: linear-gradient(180deg, #06a154, #1e70ad 60%, rgba(30,112,173,0.1));
    }
    .ab-mile { position: relative; padding-bottom: 2rem; }
    .ab-mile:last-child { padding-bottom: 0; }
    .ab-mile-dot {
      position: absolute; left: calc(-2.2rem + 0.5rem - 6px); top: .5rem;
      height: 14px; width: 14px; border-radius: 999px;
      background: linear-gradient(135deg, #35c985, #1e70ad);
      box-shadow: 0 0 0 4px rgba(6,161,84,0.16), 0 6px 16px rgba(30,112,173,0.4);
    }
    .ab-mile-card {
      border: 1px solid rgba(6,161,84,0.22); border-radius: 1.1rem;
      background: linear-gradient(160deg, rgba(20,24,22,0.86), rgba(7,6,4,0.82));
      padding: 1.3rem 1.4rem; box-shadow: 0 20px 50px rgba(0,0,0,0.34);
      transition: transform .25s ease, border-color .25s ease;
    }
    .ab-mile-card:hover { transform: translateY(-3px); border-color: rgba(30,112,173,0.5); }
    .ab-mile-top { display: flex; align-items: center; gap: .8rem; }
    .ab-mile-num { font-family: "Sora", sans-serif; font-size: .82rem; font-weight: 900; color: rgba(244,241,234,0.32); }
    .ab-mile-year {
      border-radius: 999px; border: 1px solid rgba(30,112,173,0.5); background: rgba(30,112,173,0.16);
      padding: .2rem .7rem; font-size: .66rem; font-weight: 800; letter-spacing: .08em;
      text-transform: uppercase; color: #7cc4f0;
    }
    .ab-mile-title { margin-top: .7rem; font-size: 1.3rem; color: #fbf7ec; }
    .ab-mile-body { margin-top: .5rem; font-size: .94rem; line-height: 1.75; color: rgba(244,241,234,0.66); }

    /* brands — typographic grid */
    .ab-brands {
      display: grid; gap: 1px; background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.08); border-radius: 1.1rem; overflow: hidden;
      grid-template-columns: repeat(2, 1fr);
    }
    @media (min-width: 640px) { .ab-brands { grid-template-columns: repeat(3, 1fr); } }
    @media (min-width: 1024px) { .ab-brands { grid-template-columns: repeat(4, 1fr); } }
    .ab-brand {
      display: flex; align-items: center; justify-content: center; text-align: center;
      min-height: 5.2rem; padding: 1rem .8rem;
      background: rgba(10,12,11,0.7);
      font-family: "Sora", sans-serif; font-size: .98rem; font-weight: 800; letter-spacing: .02em;
      color: rgba(244,241,234,0.78); text-transform: uppercase;
      transition: color .25s ease, background .25s ease;
    }
    .ab-brand:hover { color: #fff; background: rgba(6,161,84,0.14); }

    /* map */
    .ab-map-wrap { display: grid; gap: 2.5rem; align-items: center; }
    @media (min-width: 1024px) { .ab-map-wrap { grid-template-columns: 0.9fr 1.1fr; gap: 3.5rem; } }
    .ab-ghost-btn {
      display: inline-flex; align-items: center; justify-content: center; min-height: 3rem;
      border-radius: 999px; border: 1px solid rgba(255,255,255,0.2); padding: .7rem 1.4rem;
      font-family: var(--font-display, inherit); font-weight: 600; color: #f6f2e8;
      transition: border-color .2s ease, background .2s ease;
    }
    .ab-ghost-btn:hover { border-color: #1e70ad; background: rgba(30,112,173,0.12); }
    .ab-map {
      border: 1px solid rgba(6,161,84,0.22); border-radius: 1.3rem; padding: .5rem;
      background: rgba(255,255,255,0.04); box-shadow: 0 30px 80px rgba(0,0,0,0.45);
    }
    .ab-map-frame { display: block; width: 100%; height: 24rem; border: 0; border-radius: 1rem; filter: grayscale(.2) contrast(1.05); }

    @media (max-width: 640px) {
      .ab-h2 { font-size: clamp(1.9rem, 8.5vw, 2.5rem); }
      .ab-intro-head { position: static; }
      .ab-para { font-size: .98rem; line-height: 1.82; }
      .ab-mile-title { font-size: 1.15rem; }
      .ab-map-frame { height: 18rem; }
      .ab-brand { min-height: 4.4rem; font-size: .86rem; }
    }
  `]
})
export class AboutComponent implements OnInit {
  private api = inject(ApiService);
  settings = inject(SettingsService);
  hero = signal<PageHero | null>(null);
  milestones = signal<AboutMilestone[]>([]);
  brands = signal<AboutBrand[]>([]);

  // Seeded editorial copy (not admin-managed by design). Sourced from the brand brief.
  intro: string[] = [
    'Kallingal Group of Companies is a leading automotive and service network in Thiruvananthapuram, operating 19+ showrooms and service centres across the district. We are the authorised dealer for Bajaj Auto, offering two-wheelers, three-wheelers and dedicated service support.',
    'We also operate the Authorised Tata Service Centre in Nedumangadu, delivering expert vehicle care with certified technicians and genuine parts. Our spare-parts division, KBS Distribution, ensures a reliable supply of genuine automotive spares across Kerala.',
    'In partnership with National Insurance Company, we provide customers with trusted insurance solutions for complete vehicle protection. Guided by trust, service quality and customer satisfaction, Kallingal Group continues to grow as one of the most dependable names in the region.'
  ];
  story: string[] = [
    'Kallingal is known for its resounding success year after year across Trivandrum - a success built on trust, hard work and an unshakeable commitment to customers. Founded by Kallingal A.M. Basheer, what began as a modest service centre has grown into one of the region’s most respected names in the automobile industry.',
    'Our journey took a major step forward in 1992, when we became an Authorised Service Centre (ASC) for Bajaj. From that moment, Kallingal started building its legacy with dedication, quality service and customer-first values - today we proudly celebrate our silver jubilee, marking decades of excellence and growth.',
    'Over the years, Kallingal expanded steadily, transforming from a single outlet into a strong network of 19 showrooms across the entire Trivandrum district. Each branch reflects our commitment to delivering reliable service, genuine products and a seamless customer experience.',
    'From humble beginnings to becoming a trusted automotive powerhouse, the Kallingal story is one of perseverance, passion and progress - a journey shaped by the vision of Kallingal A.M. Basheer and one that continues to inspire us every day.'
  ];

  ngOnInit() {
    this.api.pageHero('about').subscribe({ next: v => this.hero.set(v), error: () => this.hero.set(null) });
    this.api.aboutMilestones().subscribe({ next: v => this.milestones.set(v || []), error: () => this.milestones.set([]) });
    this.api.aboutBrands().subscribe({ next: v => this.brands.set(v || []), error: () => this.brands.set([]) });
  }

  heroChips() {
    return (this.hero()?.chips || 'Our story,Legacy timeline,Brands we carry,Where to find us').split(',').map(v => v.trim()).filter(Boolean);
  }
  pad(n: number) { return n < 10 ? '0' + n : '' + n; }
}
