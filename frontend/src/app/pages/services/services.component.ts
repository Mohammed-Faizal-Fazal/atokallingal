import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideArrowRight, LucideWrench, LucideShieldCheck, LucideClock, LucideBadgeCheck, LucideHeadphones } from '@lucide/angular';
import { ApiService, PageHero, ServiceItem, ServicePanel, ServicePromise } from '../../shared/api.service';
import { PageHeroComponent } from '../../shared/page-hero.component';
import { RevealDirective } from '../../shared/reveal.directive';
import { FaqComponent } from '../../shared/faq.component';
import { StatsBandComponent } from '../../shared/stats-band.component';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [RouterLink, PageHeroComponent, RevealDirective, FaqComponent, StatsBandComponent, LucideArrowRight, LucideWrench, LucideShieldCheck, LucideClock, LucideBadgeCheck, LucideHeadphones],
  template: `
  <app-page-hero [eyebrow]="hero()?.eyebrow || ''" [title]="hero()?.title || ''"
    [sub]="hero()?.sub || ''" [image]="hero()?.imageUrl || ''" [chips]="heroChips()"/>

  <!-- editorial service features -->
  <section class="page-band py-16 sm:py-24">
    <div class="section-shell relative z-10">
      <div appReveal class="max-w-2xl">
        <p class="eyebrow">What we do</p>
        <h2 class="svc-h2 mt-3 font-display font-black uppercase leading-[0.88]">Care beyond<br/><span class="text-gradient">the sale.</span></h2>
      </div>

      <div class="svc-features mt-14 sm:mt-20">
        @for (panel of panels(); track panel.title; let i = $index) {
          <article appReveal class="svc-feature" [class.svc-feature-rev]="i % 2 === 1">
            <span class="svc-folio" aria-hidden="true">{{ pad(i + 1) }}</span>
            <div class="svc-shot">
              <span class="svc-accent"></span>
              <img [src]="panel.imageUrl" [alt]="panel.title" loading="lazy"/>
              <span class="svc-shot-grad"></span>
              <span class="svc-shot-num">{{ pad(i + 1) }}</span>
              <span class="svc-shoticon">
                @switch (panel.icon) {
                  @case ('shield') { <svg lucideShieldCheck class="h-5 w-5"></svg> }
                  @default { <svg lucideWrench class="h-5 w-5"></svg> }
                }
              </span>
              <span class="svc-shot-eyebrow">{{ panel.eyebrow }}</span>
              <h3 class="svc-shot-name font-display font-black uppercase">{{ panel.title }}</h3>
            </div>
            <div class="svc-text">
              <p class="svc-index">{{ pad(i + 1) }} <span>/ {{ pad(panels().length) }}</span></p>
              <p class="svc-eyebrow">{{ panel.eyebrow }}</p>
              <h3 class="svc-name font-display font-black uppercase">{{ panel.title }}</h3>
              <p class="svc-desc">{{ panel.text }}</p>
              <a [routerLink]="panel.ctaLink" class="btn-primary mt-7 w-fit">{{ panel.ctaLabel }} <svg lucideArrowRight class="ml-2 h-4 w-4"></svg></a>
            </div>
          </article>
        }
      </div>
    </div>
  </section>

  <!-- numbered promise row (no cards) -->
  @if (promises().length) {
    <section class="page-band pb-16 sm:pb-20">
      <div class="section-shell relative z-10">
        <p appReveal class="eyebrow">The promise</p>
        <div class="svc-promises mt-7 grid gap-x-10 gap-y-8 sm:grid-cols-3">
          @for (p of promises(); track p.label; let i = $index) {
            <div appReveal [revealDelay]="i * 0.08" class="svc-promise">
              <div class="svc-promise-top">
                <span class="svc-promise-num">{{ pad(i + 1) }}</span>
                <span class="svc-promise-icon">
                  @switch (p.icon) {
                    @case ('clock') { <svg lucideClock class="h-5 w-5"></svg> }
                    @case ('badge') { <svg lucideBadgeCheck class="h-5 w-5"></svg> }
                    @default { <svg lucideHeadphones class="h-5 w-5"></svg> }
                  }
                </span>
              </div>
              <h3 class="svc-promise-label font-display font-bold">{{ p.label }}</h3>
              <p class="svc-promise-text">{{ p.text }}</p>
            </div>
          }
        </div>
      </div>
    </section>
  }

  <app-stats-band/>

  @if (items().length) {
    <section class="page-band pb-20 pt-8 sm:pt-12">
      <div class="section-shell relative z-10">
        <div appReveal class="max-w-2xl">
          <p class="eyebrow">All services</p>
          <h2 class="svc-h2 mt-3 font-display font-black uppercase leading-[0.9]">Support for every <span class="text-gradient">stage.</span></h2>
        </div>
        <div class="svc-catalog mt-10">
          @for (s of items(); track s.id; let i = $index) {
            <article appReveal [revealDelay]="i * 0.05" class="svc-cat-row">
              <span class="svc-cat-num">{{ pad(i + 1) }}</span>
              <span class="svc-cat-cat">{{ s.category }}</span>
              <span class="svc-cat-body">
                <span class="svc-cat-title">{{ s.title }}</span>
                <span class="svc-cat-desc">{{ s.description }}</span>
              </span>
            </article>
          }
        </div>
      </div>
    </section>
  }

  <app-faq heading="Service" accent="questions."
    sub="From booking a slot to genuine parts and warranty - here is what customers ask us most before a visit."/>`,
  styles: [`
    .svc-h2 { font-size: clamp(2.4rem, 5.6vw, 4.4rem); color: #fbf7ec; letter-spacing: -0.01em; }

    /* feature spreads (shared editorial language with products) */
    .svc-feature {
      position: relative;
      display: grid;
      grid-template-columns: 0.94fr 1.06fr;
      align-items: center;
      gap: clamp(2rem, 5vw, 5rem);
      padding: clamp(2.5rem, 5vw, 4.6rem) 0;
      border-top: 1px solid rgba(6,161,84,0.18);
    }
    .svc-feature:last-child { border-bottom: 1px solid rgba(6,161,84,0.18); }
    .svc-feature-rev .svc-shot { order: 2; }
    .svc-folio {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 40%;
      font-family: "Sora", sans-serif;
      font-weight: 900;
      font-size: clamp(8rem, 20vw, 18rem);
      line-height: .8;
      color: rgba(244,241,234,0.035);
      pointer-events: none;
      z-index: 0;
    }
    .svc-feature-rev .svc-folio { left: auto; right: 40%; }
    .svc-shot {
      position: relative;
      z-index: 1;
      overflow: hidden;
      border-radius: 1.4rem;
      aspect-ratio: 4 / 3;
      border: 1px solid rgba(6,161,84,0.2);
      box-shadow: 0 40px 100px rgba(0,0,0,0.5);
    }
    .svc-shot img { position: absolute; inset: 0; height: 100%; width: 100%; object-fit: cover; filter: saturate(1.02) contrast(1.04); transition: transform .7s ease; }
    .svc-feature:hover .svc-shot img { transform: scale(1.05); }
    .svc-shot-grad { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(7,6,4,0.18), transparent 34%, rgba(7,6,4,0.78) 100%); }
    .svc-shot-num {
      position: absolute; left: 1.1rem; bottom: .7rem; z-index: 2;
      font-family: "Sora", sans-serif; font-weight: 900; font-size: 3.4rem; line-height: .8;
      color: rgba(255,255,255,0.92); text-shadow: 0 4px 20px rgba(0,0,0,0.55);
    }
    .svc-shot-eyebrow, .svc-shot-name { display: none; }
    .svc-accent { position: absolute; left: 0; top: 0; bottom: 0; width: 5px; z-index: 2; background: linear-gradient(180deg, #1e70ad, #06a154); }
    .svc-shoticon {
      position: absolute; right: 1.1rem; top: 1.1rem; z-index: 2;
      display: inline-flex; height: 3rem; width: 3rem; align-items: center; justify-content: center;
      border-radius: 1rem; border: 1px solid rgba(255,255,255,0.28); background: rgba(255,255,255,0.12);
      color: #fff;
    }
    .svc-text { position: relative; z-index: 1; }
    .svc-index { font-family: "Sora", sans-serif; font-size: .9rem; font-weight: 900; letter-spacing: .1em; color: #35c985; }
    .svc-index span { color: rgba(244,241,234,0.4); }
    .svc-eyebrow { margin-top: .85rem; font-size: .64rem; font-weight: 800; letter-spacing: .26em; text-transform: uppercase; color: rgba(6,161,84,0.95); }
    .svc-name { margin-top: .5rem; font-size: clamp(2rem, 4.4vw, 3.4rem); line-height: 0.98; letter-spacing: -0.01em; color: #fbf7ec; }
    .svc-desc { margin-top: 1.1rem; max-width: 32rem; font-size: 1rem; line-height: 1.85; color: rgba(244,241,234,0.72); }

    /* numbered promise row */
    .svc-promise { position: relative; padding-top: 1.25rem; border-top: 1px solid rgba(6,161,84,0.24); }
    .svc-promise-top { display: flex; align-items: center; justify-content: space-between; }
    .svc-promise-num { font-family: "Sora", sans-serif; font-size: 1.6rem; font-weight: 900; color: rgba(6,161,84,0.85); }
    .svc-promise-icon {
      display: inline-flex; height: 2.6rem; width: 2.6rem; align-items: center; justify-content: center;
      border-radius: .85rem; color: #05161c;
      background: linear-gradient(135deg, #35c985, #06a154 55%, #1e70ad);
      box-shadow: 0 12px 26px rgba(30,112,173,0.3);
    }
    .svc-promise-label { margin-top: 1.1rem; font-size: 1.2rem; color: #fbf7ec; }
    .svc-promise-text { margin-top: .55rem; font-size: .92rem; line-height: 1.7; color: rgba(244,241,234,0.68); }

    /* service index list */
    .svc-catalog { display: flex; flex-direction: column; }
    .svc-cat-row {
      display: grid;
      grid-template-columns: auto 9rem 1fr;
      align-items: baseline;
      gap: 1.5rem;
      padding: 1.6rem 0;
      border-top: 1px solid rgba(255,255,255,0.12);
      transition: padding-left .25s ease;
    }
    .svc-catalog .svc-cat-row:last-child { border-bottom: 1px solid rgba(255,255,255,0.12); }
    .svc-cat-row:hover { padding-left: .6rem; }
    .svc-cat-num { font-family: "Sora", sans-serif; font-size: .78rem; font-weight: 900; color: #35c985; }
    .svc-cat-cat { font-size: .66rem; font-weight: 800; letter-spacing: .18em; text-transform: uppercase; color: rgba(6,161,84,0.9); }
    .svc-cat-title { display: block; font-family: "Sora", sans-serif; font-size: 1.15rem; font-weight: 800; color: #fbf7ec; }
    .svc-cat-desc { display: block; margin-top: .4rem; font-size: .9rem; line-height: 1.65; color: rgba(244,241,234,0.66); }

    @media (max-width: 1023px) {
      .svc-feature { grid-template-columns: 1fr; gap: 1.75rem; padding: 3rem 0; }
      .svc-feature-rev .svc-shot { order: 0; }
      .svc-folio { display: none; }
      .svc-shot { aspect-ratio: 16 / 11; }
      .svc-h2 { font-size: clamp(2.4rem, 8vw, 3.4rem); }
    }
    /* ===== Bold immersive mobile: full-bleed image card + floating glass panel ===== */
    @media (max-width: 640px) {
      .svc-feature { display: block; padding: 0; border: 0; margin-bottom: 2rem; }
      .svc-feature:last-child { border: 0; }
      .svc-shot {
        aspect-ratio: 4 / 5;
        border-radius: 1.6rem;
        box-shadow: 0 34px 80px rgba(0,0,0,0.6);
      }
      .svc-shot-grad { background: linear-gradient(180deg, rgba(7,6,4,0.22) 0%, transparent 26%, rgba(7,6,4,0.55) 60%, rgba(7,6,4,0.95) 100%); }
      .svc-shot-num { display: none; }
      .svc-shot-eyebrow {
        display: block; position: absolute; inset-inline: 1.2rem; bottom: 3.7rem; z-index: 3;
        font-size: .64rem; font-weight: 800; letter-spacing: .22em; text-transform: uppercase; color: #6ee7b7;
        text-shadow: 0 2px 10px rgba(0,0,0,0.6);
      }
      .svc-shot-name {
        display: block; position: absolute; inset-inline: 1.2rem; bottom: 1.1rem; z-index: 3;
        font-size: clamp(2rem, 10vw, 2.8rem); line-height: .94; letter-spacing: -0.01em;
        color: #fff; text-shadow: 0 6px 28px rgba(0,0,0,0.65);
      }
      .svc-text {
        position: relative; z-index: 4;
        margin: -2rem 0.9rem 0;
        border-radius: 1.4rem;
        border: 1px solid rgba(6,161,84,0.26);
        background:
          radial-gradient(260px 130px at 100% 0%, rgba(30,112,173,0.13), transparent 62%),
          linear-gradient(160deg, rgba(22,19,12,0.98), rgba(7,6,4,0.97));
        padding: 1.4rem 1.25rem 1.5rem;
        box-shadow: 0 26px 64px rgba(0,0,0,0.55);
      }
      .svc-name, .svc-eyebrow { display: none; }
      .svc-index { font-size: .76rem; }
      .svc-desc { margin-top: .9rem; max-width: none; font-size: .95rem; line-height: 1.78; }
      .svc-feature .btn-primary { width: 100%; }
      .svc-promise { padding-top: 1rem; }
      .svc-promise-num { font-size: 1.4rem; }
      .svc-promise-label { font-size: 1.1rem; }
      .svc-cat-row { grid-template-columns: auto 1fr; gap: .55rem 1rem; padding: 1.4rem 0; }
      .svc-cat-cat { grid-column: 2; order: -1; }
      .svc-cat-title { font-size: 1.02rem; }
      .svc-cat-desc { font-size: .88rem; }
    }
  `]
})
export class ServicesComponent implements OnInit {
  private api = inject(ApiService);
  hero = signal<PageHero | null>(null);
  items = signal<ServiceItem[]>([]);
  panels = signal<ServicePanel[]>([]);
  promises = signal<ServicePromise[]>([]);

  ngOnInit() {
    this.api.pageHero('services').subscribe({ next: v => this.hero.set(v), error: () => this.hero.set(null) });
    this.api.servicePanels().subscribe({ next: v => this.panels.set(v || []), error: () => this.panels.set([]) });
    this.api.servicePromises().subscribe({ next: v => this.promises.set(v || []), error: () => this.promises.set([]) });
    this.api.services().subscribe({ next: v => this.items.set(v || []), error: () => this.items.set([]) });
  }

  heroChips() {
    return (this.hero()?.chips || '').split(',').map(v => v.trim()).filter(Boolean);
  }
  pad(n: number) { return n < 10 ? '0' + n : '' + n; }
}
