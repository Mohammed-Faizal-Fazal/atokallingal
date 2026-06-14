import { Component, inject, signal, OnInit, ViewChild } from '@angular/core';
import { LucideExpand } from '@lucide/angular';
import { ApiService, GalleryImage, PageHero } from '../../shared/api.service';
import { PageHeroComponent } from '../../shared/page-hero.component';
import { RevealDirective } from '../../shared/reveal.directive';
import { LightboxComponent } from '../../shared/lightbox.component';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [PageHeroComponent, RevealDirective, LightboxComponent, LucideExpand],
  template: `
  <app-page-hero [eyebrow]="hero()?.eyebrow || ''" [title]="hero()?.title || ''"
    [sub]="hero()?.sub || ''" [image]="hero()?.imageUrl || ''" [chips]="heroChips()"/>

  <section class="page-band py-16 sm:py-24">
  <div class="section-shell relative z-10">
    <div appReveal class="ga-masthead flex items-end justify-between gap-5 border-b border-white/15 pb-6">
      <div>
        <p class="eyebrow">Moments</p>
        <h2 class="ga-h2 mt-3 font-display font-black uppercase leading-[0.9]">Inside the<br/><span class="text-gradient">network.</span></h2>
      </div>
      <span class="ga-count">{{ pad(images().length) }}<span>Frames</span></span>
    </div>

    <div class="ga-grid mt-10">
      @for (img of images(); track img.url; let i = $index) {
        <figure appReveal [revealDelay]="(i % 3) * 0.06"
          class="ga-tile" (click)="lb.open(i)" (keydown.enter)="lb.open(i)" tabindex="0" role="button"
          [attr.aria-label]="'View ' + img.caption">
          <img [src]="img.url" [alt]="img.caption" loading="lazy"/>
          <span class="ga-tile-grad"></span>
          <span class="ga-tile-num">{{ pad(i + 1) }}</span>
          <span class="ga-tile-view"><svg lucideExpand class="h-4 w-4"></svg></span>
          @if (img.caption) { <figcaption class="ga-cap">{{ img.caption }}</figcaption> }
        </figure>
      }
    </div>

    @if (!images().length) {
      <div class="ga-empty">No gallery images published from backend yet.</div>
    }
  </div>
  </section>

  <app-lightbox #lb [images]="images()"/>`,
  styles: [`
    .ga-h2 { font-size: clamp(2.4rem, 5.6vw, 4.4rem); color: #fbf7ec; letter-spacing: -0.01em; }
    .ga-count {
      font-family: "Sora", sans-serif; font-size: clamp(2.4rem, 4.6vw, 3.6rem); font-weight: 900; line-height: .8;
      color: rgba(6,161,84,0.9); display: flex; flex-direction: column; align-items: flex-end;
    }
    .ga-count span { font-size: .58rem; letter-spacing: .26em; text-transform: uppercase; color: rgba(244,241,234,0.5); margin-top: .4rem; }

    /* editorial mosaic (masonry) */
    .ga-grid { columns: 3; column-gap: 1rem; }
    .ga-tile {
      position: relative;
      margin-bottom: 1rem;
      break-inside: avoid;
      overflow: hidden;
      border-radius: 1rem;
      border: 1px solid rgba(6,161,84,0.16);
      cursor: zoom-in;
      background: #072029;
      outline: none;
      box-shadow: 0 22px 58px rgba(0,0,0,0.28);
    }
    .ga-tile img { display: block; width: 100%; transition: transform .8s ease, filter .4s ease; filter: contrast(1.06) saturate(1.06) brightness(0.985); }
    .ga-tile:hover img, .ga-tile:focus-visible img { transform: scale(1.06); filter: saturate(1.06) brightness(1); }
    .ga-tile-grad {
      position: absolute; inset: 0; pointer-events: none;
      background: linear-gradient(180deg, rgba(7,6,4,0.32) 0%, transparent 28%, rgba(7,6,4,0.78) 100%);
      opacity: .9; transition: opacity .3s ease;
    }
    .ga-tile-num {
      position: absolute; left: .85rem; top: .7rem; z-index: 2;
      font-family: "Sora", sans-serif; font-size: .8rem; font-weight: 900;
      color: rgba(255,255,255,0.85); text-shadow: 0 2px 8px rgba(0,0,0,0.6);
    }
    .ga-tile-view {
      position: absolute; right: .8rem; top: .7rem; z-index: 2;
      display: inline-flex; height: 2.2rem; width: 2.2rem; align-items: center; justify-content: center;
      border-radius: .7rem; border: 1px solid rgba(255,255,255,0.3); background: rgba(7,6,4,0.45);
      color: #fff;
      opacity: 0; transform: scale(.85); transition: opacity .3s ease, transform .3s ease;
    }
    .ga-tile:hover .ga-tile-view, .ga-tile:focus-visible .ga-tile-view { opacity: 1; transform: scale(1); }
    .ga-cap {
      position: absolute; inset-inline: 0; bottom: 0; z-index: 2;
      padding: 1.4rem .95rem .9rem;
      font-size: .82rem; font-weight: 700; letter-spacing: .01em; color: #fbf7ec;
      transform: translateY(110%); transition: transform .35s ease;
    }
    .ga-tile:hover .ga-cap, .ga-tile:focus-visible .ga-cap { transform: translateY(0); }
    .ga-tile:hover { border-color: rgba(6,161,84,0.5); }

    .ga-empty {
      padding: 2.5rem; text-align: center; border: 1px dashed rgba(6,161,84,0.3); border-radius: 1.2rem;
      color: rgba(244,241,234,0.6); font-size: .9rem; font-weight: 600;
    }

    @media (max-width: 1023px) { .ga-grid { columns: 2; } }
    @media (max-width: 640px) {
      .ga-h2 { font-size: clamp(2rem, 9vw, 2.6rem); }
      .ga-count {
        flex-direction: row;
        align-items: baseline;
        gap: .5rem;
        font-size: 2rem;
      }
      .ga-count span { margin-top: 0; }
      .ga-masthead {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
        padding-bottom: 1.5rem;
      }
    }
    @media (max-width: 560px) {
      .ga-grid { columns: 1; column-gap: .85rem; }
      .ga-tile { margin-bottom: .85rem; }
      /* on phones, show the index + caption without needing hover */
      .ga-tile-view { opacity: 1; transform: scale(1); }
      .ga-cap { transform: translateY(0); padding-top: 2.6rem; font-size: .78rem; }
    }
  `]
})
export class GalleryComponent implements OnInit {
  private api = inject(ApiService);
  @ViewChild('lb') lightbox!: LightboxComponent;
  hero = signal<PageHero | null>(null);
  images = signal<GalleryImage[]>([]);
  ngOnInit() {
    this.api.pageHero('gallery').subscribe({ next: v => this.hero.set(v), error: () => this.hero.set(null) });
    this.api.gallery().subscribe({ next: v => this.images.set(v || []), error: () => this.images.set([]) });
  }

  heroChips() {
    return (this.hero()?.chips || '').split(',').map(v => v.trim()).filter(Boolean);
  }
  pad(n: number) { return n < 10 ? '0' + n : '' + n; }
}
