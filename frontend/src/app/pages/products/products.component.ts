import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideArrowRight, LucideArrowUpRight, LucideBike, LucideStore, LucideZap } from '@lucide/angular';
import { ApiService, PageHero, ProductCategory } from '../../shared/api.service';
import { PageHeroComponent } from '../../shared/page-hero.component';
import { RevealDirective } from '../../shared/reveal.directive';
import { TestimonialsComponent } from '../../shared/testimonials.component';
import { StatsBandComponent } from '../../shared/stats-band.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [RouterLink, PageHeroComponent, RevealDirective, TestimonialsComponent, StatsBandComponent, LucideArrowRight, LucideArrowUpRight, LucideBike, LucideStore, LucideZap],
  template: `
  <app-page-hero [eyebrow]="hero()?.eyebrow || ''" [title]="hero()?.title || ''"
    [sub]="hero()?.sub || ''" [image]="hero()?.imageUrl || ''" [chips]="heroChips()"/>

  <section class="page-band product-range py-16 sm:py-24">
    <div class="section-shell relative z-10">
      <!-- editorial section masthead -->
      <div appReveal class="prod-masthead">
        <p class="eyebrow">The range</p>
        <h2 class="prod-h2 mt-3 font-display font-black uppercase leading-[0.88]">
          Three lineups,<br/><span class="text-gradient">one showroom.</span>
        </h2>
        <p class="prod-intro mt-5 max-w-2xl text-base leading-8">
          From daily commuters to commercial workhorses to the all-electric Chetak — find what fits your road, then book a test ride in minutes.
        </p>
      </div>

      <div class="prod-features mt-16 sm:mt-24">
        @for (c of categories(); track c.name; let i = $index) {
          <article appReveal [revealDelay]="0.05" class="prod-feature" [class.prod-feature-rev]="i % 2 === 1">
            <span class="prod-folio" aria-hidden="true">{{ pad(i + 1) }}</span>

            <div class="prod-shot">
              <span class="prod-accent" [style.background]="c.accent"></span>
              <img [src]="c.imageUrl" [alt]="c.name" loading="lazy"/>
              <span class="prod-shot-grad"></span>
              <span class="prod-shot-num">{{ pad(i + 1) }}</span>
              <span class="prod-tag"><span class="prod-dot" [style.background]="c.accent"></span>{{ c.tag }}</span>
              <span class="prod-shoticon">
                @switch (c.icon) {
                  @case ('bike') { <svg lucideBike class="h-5 w-5"></svg> }
                  @case ('store') { <svg lucideStore class="h-5 w-5"></svg> }
                  @case ('zap') { <svg lucideZap class="h-5 w-5"></svg> }
                  @default { <svg lucideBike class="h-5 w-5"></svg> }
                }
              </span>
              <h3 class="prod-shot-name font-display font-black uppercase">{{ c.name }}</h3>
            </div>

            <div class="prod-text">
              <p class="prod-index" [style.color]="c.accent">{{ pad(i + 1) }} <span>/ {{ pad(categories().length) }}</span></p>
              <h3 class="prod-name font-display font-black uppercase">{{ c.name }}</h3>
              <p class="prod-desc">{{ c.description }}</p>

              @if (specList(c.specs).length) {
                <div class="prod-specs">
                  <p class="prod-specs-head">Highlights</p>
                  @for (s of specList(c.specs); track s; let si = $index) {
                    <div class="prod-spec-row">
                      <span class="prod-spec-num">{{ pad(si + 1) }}</span>
                      <span class="prod-spec-label">{{ s }}</span>
                      <span class="prod-spec-line"></span>
                    </div>
                  }
                </div>
              }

              <div class="prod-cta">
                <a routerLink="/contact" fragment="enquiry" class="btn-primary">Book a test drive <svg lucideArrowRight class="ml-2 h-4 w-4"></svg></a>
                <a routerLink="/showrooms" class="prod-link">Find a showroom <svg lucideArrowUpRight class="h-4 w-4"></svg></a>
              </div>
            </div>
          </article>
        }
      </div>
    </div>
  </section>

  <app-stats-band/>

  <app-testimonials heading="Riders who" accent="chose Kallingal" sub="Thousands across Trivandrum ride home every month. Here is what a few of them had to say."/>`,
  styles: [`
    .prod-h2 { font-size: clamp(2.4rem, 5.6vw, 4.4rem); color: #fbf7ec; letter-spacing: -0.01em; }
    .prod-intro { color: rgba(244,241,234,0.7); }

    /* Editorial feature spread — alternating, hairline-separated, no cards */
    .prod-feature {
      position: relative;
      display: grid;
      grid-template-columns: 1.06fr 0.94fr;
      align-items: center;
      gap: clamp(2rem, 5vw, 5rem);
      padding: clamp(2.5rem, 5vw, 4.6rem) 0;
      border-top: 1px solid rgba(6,161,84,0.18);
    }
    .prod-feature:last-child { border-bottom: 1px solid rgba(6,161,84,0.18); }
    .prod-feature-rev .prod-shot { order: 2; }

    /* giant folio number bleeding behind the text column */
    .prod-folio {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 38%;
      font-family: "Sora", sans-serif;
      font-weight: 900;
      font-size: clamp(8rem, 20vw, 18rem);
      line-height: .8;
      color: rgba(244,241,234,0.035);
      pointer-events: none;
      z-index: 0;
    }
    .prod-feature-rev .prod-folio { right: auto; left: 38%; }

    .prod-shot {
      position: relative;
      z-index: 1;
      overflow: hidden;
      border-radius: 1.4rem;
      aspect-ratio: 4 / 3;
      border: 1px solid rgba(6,161,84,0.2);
      box-shadow: 0 40px 100px rgba(0,0,0,0.5);
    }
    .prod-shot img {
      position: absolute;
      inset: 0;
      height: 100%;
      width: 100%;
      object-fit: cover;
      filter: saturate(1.04) contrast(1.04);
      transition: transform .7s ease;
    }
    .prod-feature:hover .prod-shot img { transform: scale(1.05); }
    .prod-shot-grad {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(7,6,4,0.18) 0%, transparent 34%, rgba(7,6,4,0.78) 100%);
    }
    .prod-shot-num {
      position: absolute;
      left: 1.1rem; bottom: .7rem;
      z-index: 2;
      font-family: "Sora", sans-serif;
      font-weight: 900;
      font-size: 3.4rem;
      line-height: .8;
      color: rgba(255,255,255,0.92);
      text-shadow: 0 4px 20px rgba(0,0,0,0.55);
    }
    .prod-shot-name { display: none; }
    .prod-accent {
      position: absolute;
      left: 0; top: 0; bottom: 0;
      width: 5px;
      z-index: 2;
    }
    .prod-tag {
      position: absolute;
      left: 1.1rem; top: 1.1rem;
      z-index: 2;
      display: inline-flex;
      align-items: center;
      gap: .5rem;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,0.28);
      background: rgba(7,6,4,0.5);
      padding: .42rem .85rem;
      font-size: .68rem;
      font-weight: 800;
      letter-spacing: .12em;
      text-transform: uppercase;
      color: #fff;
    }
    .prod-dot { height: .42rem; width: .42rem; border-radius: 999px; }
    .prod-shoticon {
      position: absolute;
      right: 1.1rem; top: 1.1rem;
      z-index: 2;
      display: inline-flex;
      height: 3rem; width: 3rem;
      align-items: center;
      justify-content: center;
      border-radius: 1rem;
      border: 1px solid rgba(255,255,255,0.28);
      background: rgba(255,255,255,0.12);
      color: #fff;
    }

    .prod-text { position: relative; z-index: 1; }
    .prod-index {
      font-family: "Sora", sans-serif;
      font-size: .9rem;
      font-weight: 900;
      letter-spacing: .1em;
    }
    .prod-index span { color: rgba(244,241,234,0.4); }
    .prod-name {
      margin-top: .6rem;
      font-size: clamp(2.1rem, 4.6vw, 3.6rem);
      line-height: 0.96;
      letter-spacing: -0.01em;
      color: #fbf7ec;
    }
    .prod-desc {
      margin-top: 1.1rem;
      max-width: 30rem;
      font-size: 1rem;
      line-height: 1.85;
      color: rgba(244,241,234,0.72);
    }
    .prod-specs { margin-top: 1.6rem; }
    .prod-specs-head {
      font-size: .62rem;
      font-weight: 800;
      letter-spacing: .26em;
      text-transform: uppercase;
      color: rgba(6,161,84,0.82);
      margin-bottom: .35rem;
    }
    .prod-spec-row {
      display: grid;
      grid-template-columns: auto auto 1fr;
      align-items: baseline;
      gap: .85rem;
      padding: .72rem 0;
      border-top: 1px solid rgba(255,255,255,0.12);
    }
    .prod-spec-num { font-family: "Sora", sans-serif; font-size: .7rem; font-weight: 900; color: #35c985; }
    .prod-spec-label {
      font-size: .9rem;
      font-weight: 700;
      letter-spacing: .01em;
      text-transform: uppercase;
      color: #f1ede3;
    }
    .prod-spec-line { align-self: center; height: 1px; background: linear-gradient(90deg, rgba(6,161,84,0.32), transparent); }

    .prod-cta {
      margin-top: 2rem;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 1.25rem;
    }
    .prod-link {
      display: inline-flex;
      align-items: center;
      gap: .5rem;
      font-family: "Sora", sans-serif;
      font-weight: 800;
      font-size: .82rem;
      letter-spacing: .04em;
      text-transform: uppercase;
      color: #35c985;
      transition: gap .2s ease, color .2s ease;
    }
    .prod-link:hover { gap: .9rem; color: #fff; }

    @media (max-width: 1023px) {
      .prod-feature {
        grid-template-columns: 1fr;
        gap: 1.75rem;
        padding: 3rem 0;
      }
      .prod-feature-rev .prod-shot { order: 0; }
      .prod-folio { display: none; }
      .prod-shot { aspect-ratio: 16 / 11; border-radius: 1.2rem; }
      .prod-h2 { font-size: clamp(2.4rem, 8vw, 3.4rem); }
    }
    /* ===== Bold immersive mobile: full-bleed image card + floating glass panel ===== */
    @media (max-width: 640px) {
      .product-range { padding-top: 2.25rem; padding-bottom: 2.35rem; }
      .prod-feature { display: block; padding: 0; border: 0; margin-bottom: 2rem; }
      .prod-feature:last-child { border: 0; }
      .prod-shot {
        aspect-ratio: 4 / 5;
        border-radius: 1.6rem;
        box-shadow: 0 34px 80px rgba(0,0,0,0.6);
      }
      .prod-shot-grad { background: linear-gradient(180deg, rgba(7,6,4,0.22) 0%, transparent 26%, rgba(7,6,4,0.55) 60%, rgba(7,6,4,0.95) 100%); }
      .prod-shot-num { display: none; }
      .prod-shot-name {
        display: block;
        position: absolute;
        inset-inline: 1.15rem;
        bottom: 1.1rem;
        z-index: 3;
        font-size: clamp(2.3rem, 12vw, 3.2rem);
        line-height: .92;
        letter-spacing: -0.01em;
        color: #fff;
        text-shadow: 0 6px 28px rgba(0,0,0,0.65);
      }
      .prod-tag { left: 1.15rem; top: 1.1rem; }
      /* floating glass info panel overlaps the image bottom */
      .prod-text {
        position: relative;
        z-index: 4;
        margin: -2rem 0.9rem 0;
        border-radius: 1.4rem;
        border: 1px solid rgba(6,161,84,0.26);
        background:
          radial-gradient(260px 130px at 100% 0%, rgba(30,112,173,0.13), transparent 62%),
          linear-gradient(160deg, rgba(22,19,12,0.98), rgba(7,6,4,0.97));
        padding: 1.4rem 1.25rem 1.5rem;
        box-shadow: 0 26px 64px rgba(0,0,0,0.55);
      }
      .prod-name { display: none; }
      .prod-index { font-size: .76rem; }
      .prod-desc { margin-top: .9rem; max-width: none; font-size: .95rem; line-height: 1.78; }
      .prod-specs { margin-top: 1.35rem; }
      .prod-spec-row { padding: .72rem 0; }
      .prod-spec-label { font-size: .84rem; }
      .prod-cta { margin-top: 1.5rem; flex-direction: column; align-items: stretch; gap: .8rem; }
      .prod-cta .btn-primary { width: 100%; }
      .prod-link { justify-content: center; padding: .45rem 0; }
      .prod-shoticon { height: 2.6rem; width: 2.6rem; }
    }
  `]
})
export class ProductsComponent implements OnInit {
  private api = inject(ApiService);
  hero = signal<PageHero | null>(null);
  categories = signal<ProductCategory[]>([]);

  ngOnInit() {
    this.api.pageHero('products').subscribe({ next: v => this.hero.set(v), error: () => this.hero.set(null) });
    this.api.productCategories().subscribe({ next: v => this.categories.set(v || []), error: () => this.categories.set([]) });
  }

  heroChips() { return this.splitCsv(this.hero()?.chips); }
  specList(specs?: string) { return this.splitCsv(specs); }
  pad(n: number) { return n < 10 ? '0' + n : '' + n; }

  private splitCsv(value?: string | null) {
    return (value || '').split(',').map(v => v.trim()).filter(Boolean);
  }
}
