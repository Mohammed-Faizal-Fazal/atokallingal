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
          <div appReveal [revealDelay]="(i % 8) * 0.03" class="ab-brand" [title]="b.name">
            @if (logoSrc(b) && !logoFailed.has(b.name)) {
              <img [src]="logoSrc(b)" [alt]="b.name + ' logo'" class="ab-brand-logo"
                   loading="lazy" decoding="async" (error)="onLogoError(b.name)"/>
            }
            <span class="ab-brand-name">{{ b.name }}</span>
          </div>
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
        <div class="ab-map-stage">
          <svg class="ab-map-svg" viewBox="0 0 640 480" preserveAspectRatio="xMidYMid slice" role="img"
               aria-label="Stylised map of Kallingal's showroom network across the Trivandrum district">
            <defs>
              <radialGradient id="abGlow" cx="46%" cy="40%" r="72%">
                <stop offset="0%" stop-color="rgba(6,161,84,0.20)"/>
                <stop offset="55%" stop-color="rgba(30,112,173,0.10)"/>
                <stop offset="100%" stop-color="rgba(7,6,4,0)"/>
              </radialGradient>
              <linearGradient id="abRoute" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#35c985"/>
                <stop offset="100%" stop-color="#1e70ad"/>
              </linearGradient>
              <pattern id="abGrid" width="38" height="38" patternUnits="userSpaceOnUse">
                <path d="M38 0H0V38" fill="none" stroke="rgba(255,255,255,0.045)" stroke-width="1"/>
              </pattern>
            </defs>

            <rect width="640" height="480" fill="#0a0f0d"/>
            <rect width="640" height="480" fill="url(#abGrid)"/>
            <rect width="640" height="480" fill="url(#abGlow)"/>

            <!-- suggested coastline to the south-west -->
            <path d="M-20 372 C 110 344, 190 430, 360 478 L -20 520 Z" fill="rgba(30,112,173,0.10)"/>
            <path d="M-20 372 C 110 344, 190 430, 360 478" fill="none" stroke="rgba(124,196,240,0.35)"
                  stroke-width="2" stroke-dasharray="2 8" stroke-linecap="round"/>

            <!-- network routes radiating from the central hub -->
            <g class="ab-routes" stroke="url(#abRoute)" stroke-width="1.6" fill="none" stroke-linecap="round">
              <path d="M330 250 L175 110"/>
              <path d="M330 250 L475 125"/>
              <path d="M330 250 L560 245"/>
              <path d="M330 250 L495 360"/>
              <path d="M330 250 L250 385"/>
              <path d="M330 250 L150 305"/>
              <path d="M330 250 L95 205"/>
            </g>

            <!-- showroom pins -->
            <g class="ab-pins">
              <circle class="ab-halo" cx="330" cy="250" r="11"/>
              <circle class="ab-core ab-core-hub" cx="330" cy="250" r="7"/>
              <circle class="ab-halo" cx="475" cy="125" r="8"/>
              <circle class="ab-core" cx="475" cy="125" r="4.5"/>
              <circle class="ab-halo" cx="175" cy="110" r="8"/>
              <circle class="ab-core" cx="175" cy="110" r="4.5"/>
              <circle class="ab-halo" cx="495" cy="360" r="8"/>
              <circle class="ab-core" cx="495" cy="360" r="4.5"/>
              <circle class="ab-halo" cx="150" cy="305" r="8"/>
              <circle class="ab-core" cx="150" cy="305" r="4.5"/>
              <circle class="ab-core ab-core-sm" cx="250" cy="385" r="3.5"/>
              <circle class="ab-core ab-core-sm" cx="560" cy="245" r="3.5"/>
              <circle class="ab-core ab-core-sm" cx="95" cy="205" r="3.5"/>
            </g>

            <!-- town labels -->
            <g class="ab-map-labels">
              <text x="330" y="231" text-anchor="middle">Thiruvananthapuram</text>
              <text x="475" y="108" text-anchor="middle">Nedumangad</text>
              <text x="175" y="93" text-anchor="middle">Attingal</text>
              <text x="495" y="343" text-anchor="middle">Neyyattinkara</text>
              <text x="150" y="288" text-anchor="middle">Kazhakkoottam</text>
              <text x="250" y="406" text-anchor="middle">Balaramapuram</text>
            </g>
          </svg>
          <span class="ab-map-badge"><span class="ab-map-badge-dot"></span>19 showrooms across Trivandrum</span>
        </div>
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

    /* brands — logo + name tiles on warm-white so colour marks read clearly */
    .ab-brands {
      display: grid; gap: .9rem;
      grid-template-columns: repeat(3, 1fr);
    }
    @media (min-width: 640px) { .ab-brands { grid-template-columns: repeat(4, 1fr); } }
    @media (min-width: 1024px) { .ab-brands { grid-template-columns: repeat(5, 1fr); gap: 1rem; } }
    .ab-brand {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      gap: .5rem; text-align: center;
      min-height: 6rem; padding: 1rem .75rem;
      border-radius: .9rem;
      background: linear-gradient(180deg, #ffffff, #f1ede4);
      border: 1px solid rgba(255,255,255,0.10);
      box-shadow: 0 12px 30px rgba(0,0,0,0.26);
      transition: transform .25s ease, box-shadow .25s ease;
    }
    .ab-brand:hover { transform: translateY(-3px); box-shadow: 0 20px 44px rgba(0,0,0,0.4); }
    .ab-brand-logo { max-height: 2.3rem; max-width: 78%; width: auto; height: auto; object-fit: contain; }
    .ab-brand-name {
      font-family: "Sora", sans-serif; font-size: .78rem; font-weight: 800; letter-spacing: .02em;
      color: #15324a; text-transform: uppercase; line-height: 1.1;
    }

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
    .ab-map-stage {
      position: relative; border-radius: 1rem; overflow: hidden;
      aspect-ratio: 4 / 3; min-height: 18rem; background: #0a0f0d;
    }
    .ab-map-svg { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
    .ab-map-labels text {
      font-family: "Sora", sans-serif; font-size: 13px; font-weight: 700;
      letter-spacing: .04em; text-transform: uppercase; fill: rgba(244,241,234,0.82);
      paint-order: stroke; stroke: rgba(7,6,4,0.85); stroke-width: 3px; stroke-linejoin: round;
    }
    .ab-core { fill: #fbf7ec; }
    .ab-core-hub { fill: #35c985; filter: drop-shadow(0 0 8px rgba(53,201,133,0.85)); }
    .ab-core-sm { fill: rgba(244,241,234,0.6); }
    .ab-halo {
      fill: rgba(53,201,133,0.5); transform-box: fill-box; transform-origin: center;
      animation: abPinPulse 3s ease-out infinite;
    }
    .ab-halo:nth-of-type(3) { animation-delay: .5s; }
    .ab-halo:nth-of-type(5) { animation-delay: 1s; }
    .ab-halo:nth-of-type(7) { animation-delay: 1.5s; }
    .ab-halo:nth-of-type(9) { animation-delay: 2s; }
    @keyframes abPinPulse {
      0% { transform: scale(.55); opacity: .7; }
      70% { transform: scale(2.4); opacity: 0; }
      100% { opacity: 0; }
    }
    .ab-routes path { opacity: .5; stroke-dasharray: 6 6; animation: abRouteFlow 14s linear infinite; }
    @keyframes abRouteFlow { to { stroke-dashoffset: -240; } }
    .ab-map-badge {
      position: absolute; left: .9rem; bottom: .9rem;
      display: inline-flex; align-items: center; gap: .5rem;
      border-radius: 999px; border: 1px solid rgba(6,161,84,0.4);
      background: rgba(7,6,4,0.62); backdrop-filter: blur(6px);
      padding: .42rem .8rem; font-size: .68rem; font-weight: 800;
      letter-spacing: .05em; text-transform: uppercase; color: #d8f3e4;
    }
    .ab-map-badge-dot {
      height: .5rem; width: .5rem; border-radius: 999px;
      background: #35c985; box-shadow: 0 0 10px rgba(53,201,133,0.9);
    }
    @media (prefers-reduced-motion: reduce) {
      .ab-halo, .ab-routes path { animation: none; }
      .ab-halo { opacity: .35; }
    }

    @media (max-width: 640px) {
      .ab-h2 { font-size: clamp(1.9rem, 8.5vw, 2.5rem); }
      .ab-intro-head { position: static; }
      .ab-para { font-size: .98rem; line-height: 1.82; }
      .ab-mile-title { font-size: 1.15rem; }
      .ab-map-stage { min-height: 15rem; }
      .ab-map-labels { display: none; }
      .ab-map-badge { font-size: .62rem; left: .65rem; bottom: .65rem; }
      .ab-brands { gap: .5rem; }
      .ab-brand { min-height: 4.6rem; padding: .55rem .35rem; gap: .35rem; border-radius: .7rem; }
      .ab-brand-logo { max-height: 1.5rem; max-width: 85%; }
      .ab-brand-name { font-size: .6rem; letter-spacing: .01em; }
    }
  `]
})
export class AboutComponent implements OnInit {
  private api = inject(ApiService);
  settings = inject(SettingsService);
  hero = signal<PageHero | null>(null);
  milestones = signal<AboutMilestone[]>([]);
  brands = signal<AboutBrand[]>([]);

  /** Brand names whose logo image failed to load — those fall back to a wordmark tile. */
  logoFailed = new Set<string>();

  // Verified partner-brand domains -> served as logo marks from Google's favicon
  // CDN (no API key). Only brands whose mark was confirmed to resolve are listed;
  // anything not here (or that fails at runtime) falls back to a wordmark tile.
  private readonly brandDomains: Record<string, string> = {
    'tata': 'tatamotors.com', 'chetak': 'chetak.com', 'bajaj': 'bajajauto.com',
    'motul': 'motul.com', 'skf': 'skf.com', 'hella': 'hella.com',
    'motherson': 'motherson.com', 'wurth': 'wurth.com', 'ucal': 'ucalfuel.com',
    'hl-mando': 'hlmando.com', 'anand': 'anandgroupindia.com', 'acey': 'acey.in',
    'loctite': 'loctiteproducts.com', 'isk': 'iskbearings.com', 'rmp-bearings': 'rmpbearings.com',
    'aerostar-helmets': 'aerostarhelmets.com', 'napino': 'napino.com', 'did': 'didweb.com',
    'ifb': 'ifbindustries.com', 'arb-bearings': 'arb-bearings.com', 'sankar-np': 'sankarnp.com',
    'pix': 'pixtrans.com',
  };

  /** Admin-set logoUrl wins; else the brand's CDN logo mark; else '' (wordmark tile). */
  logoSrc(b: AboutBrand): string {
    const custom = (b.logoUrl || '').trim();
    if (custom) return custom;
    const domain = this.brandDomains[this.slug(b.name)];
    return domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : '';
  }
  onLogoError(name: string) { this.logoFailed.add(name); }
  private slug(s: string) {
    return (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

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
