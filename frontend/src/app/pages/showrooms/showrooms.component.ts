import { Component, inject, signal, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LucideMapPin, LucideNavigation, LucidePhone } from '@lucide/angular';
import { ApiService, PageHero, Showroom } from '../../shared/api.service';
import { PageHeroComponent } from '../../shared/page-hero.component';
import { RevealDirective } from '../../shared/reveal.directive';
import { StatsBandComponent } from '../../shared/stats-band.component';

@Component({
  selector: 'app-showrooms',
  standalone: true,
  imports: [PageHeroComponent, RevealDirective, StatsBandComponent, LucideMapPin, LucideNavigation, LucidePhone],
  template: `
  <app-page-hero [eyebrow]="hero()?.eyebrow || ''" [title]="hero()?.title || ''"
    [sub]="hero()?.sub || ''" [image]="hero()?.imageUrl || ''" [chips]="heroChips()"/>

  <section class="page-band showroom-console py-16 sm:py-24">
    <div class="section-shell relative z-10">
      <div appReveal class="sr-masthead flex items-end justify-between gap-5 border-b border-white/15 pb-6">
        <div>
          <p class="eyebrow">The network</p>
          <h2 class="sr-h2 mt-3 font-display font-black uppercase leading-[0.9]">
            Find your<br/><span class="text-gradient">nearest showroom.</span>
          </h2>
        </div>
        <span class="sr-count">{{ pad(showrooms().length) }}<span>Locations</span></span>
      </div>

      <div class="sr-layout mt-10 grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
        <div appReveal class="sr-directory">
          @for (s of showrooms(); track s.name; let i = $index) {
            <button (click)="select(s)" class="sr-row" [class.sr-row-active]="selected()?.name === s.name">
              <span class="sr-num">{{ pad(i + 1) }}</span>
              <span class="sr-content">
                <span class="sr-name">{{ s.name }}</span>
                <span class="sr-addr"><svg lucideMapPin class="h-3.5 w-3.5"></svg>{{ s.address }}</span>
                <span class="sr-actions">
                  <a [href]="'tel:' + s.phone" (click)="$event.stopPropagation()" class="sr-act"><svg lucidePhone class="h-3.5 w-3.5"></svg>Call</a>
                  <a [href]="'https://wa.me/' + s.phone.replace('+','')" target="_blank" rel="noopener" (click)="$event.stopPropagation()" class="sr-act sr-act-wa">WhatsApp</a>
                  <a [href]="'https://www.google.com/maps/dir/?api=1&destination=' + s.lat + ',' + s.lng" target="_blank" rel="noopener" (click)="$event.stopPropagation()" class="sr-act"><svg lucideNavigation class="h-3.5 w-3.5"></svg>Directions</a>
                </span>
              </span>
              <span class="sr-chev">&rarr;</span>
            </button>
          }
          @if (!showrooms().length) {
            <div class="sr-empty">No showrooms published from backend yet.</div>
          }
        </div>

        <div appReveal [revealDelay]="0.08" class="sr-map">
          @if (selected(); as s) {
            <div class="sr-mapcard">
              <p class="sr-mapcard-name">{{ s.name }}</p>
              <p class="sr-mapcard-addr">{{ s.address }}</p>
            </div>
          }
          @if (mapUrl(); as url) {
            <iframe [src]="url" class="sr-iframe" loading="lazy"
              referrerpolicy="no-referrer-when-downgrade" title="Showroom map"></iframe>
          }
        </div>
      </div>
    </div>
  </section>

  <app-stats-band/>`,
  styles: [`
    .sr-h2 { font-size: clamp(2.4rem, 5.6vw, 4.4rem); color: #fbf7ec; letter-spacing: -0.01em; }
    .sr-count {
      font-family: "Sora", sans-serif;
      font-size: clamp(2.6rem, 5vw, 4rem);
      font-weight: 900;
      line-height: .8;
      color: rgba(6,161,84,0.9);
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
    .sr-count span {
      font-size: .6rem;
      letter-spacing: .26em;
      text-transform: uppercase;
      color: rgba(244,241,234,0.5);
      margin-top: .4rem;
    }
    .sr-directory { display: flex; flex-direction: column; }
    /* Editorial directory rows — always dark with light text, so selecting one
       can never hide the text (this was the previous bug with light-bg cards). */
    .sr-row {
      position: relative;
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      gap: 1.1rem;
      width: 100%;
      text-align: left;
      padding: 1.5rem 0.5rem 1.5rem 1.25rem;
      border-top: 1px solid rgba(255,255,255,0.12);
      transition: background .25s ease, padding .25s ease;
    }
    .sr-directory .sr-row:last-of-type { border-bottom: 1px solid rgba(255,255,255,0.12); }
    .sr-row::before {
      content: "";
      position: absolute;
      left: 0; top: 0; bottom: 0;
      width: 3px;
      background: linear-gradient(180deg, #1e70ad, #06a154);
      transform: scaleY(0);
      transform-origin: top;
      transition: transform .3s ease;
    }
    .sr-row:hover { background: rgba(255,255,255,0.03); }
    .sr-row-active { background: rgba(30,112,173,0.08); }
    .sr-row-active::before { transform: scaleY(1); }
    .sr-num {
      font-family: "Sora", sans-serif;
      font-size: 1.05rem;
      font-weight: 900;
      color: rgba(244,241,234,0.35);
      transition: color .25s ease;
    }
    .sr-row-active .sr-num { color: #35c985; }
    .sr-name {
      display: block;
      font-family: "Sora", sans-serif;
      font-size: 1.15rem;
      font-weight: 800;
      letter-spacing: .005em;
      color: #fbf7ec;
    }
    .sr-addr {
      display: flex;
      align-items: flex-start;
      gap: .5rem;
      margin-top: .35rem;
      font-size: .82rem;
      line-height: 1.45;
      color: rgba(244,241,234,0.6);
    }
    .sr-addr svg { margin-top: .12rem; color: #06a154; flex-shrink: 0; }
    .sr-actions { display: flex; flex-wrap: wrap; gap: .5rem; margin-top: .9rem; }
    .sr-act {
      display: inline-flex;
      align-items: center;
      gap: .4rem;
      border-radius: 999px;
      border: 1px solid rgba(6,161,84,0.28);
      background: rgba(6,161,84,0.08);
      padding: .42rem .85rem;
      font-size: .72rem;
      font-weight: 700;
      color: #f1ede3;
      transition: background .2s ease, border-color .2s ease, color .2s ease;
    }
    .sr-act:hover { background: #35c985; border-color: #35c985; color: #05161c; }
    .sr-act-wa:hover { background: #25D366; border-color: #25D366; color: #fff; }
    .sr-chev {
      align-self: start;
      margin-top: .15rem;
      font-family: "Sora", sans-serif;
      font-weight: 900;
      color: rgba(6,161,84,0.45);
      transition: transform .25s ease, color .25s ease;
    }
    .sr-row:hover .sr-chev, .sr-row-active .sr-chev { transform: translateX(4px); color: #35c985; }
    .sr-empty {
      padding: 2rem;
      border: 1px dashed rgba(6,161,84,0.3);
      border-radius: 1rem;
      color: rgba(244,241,234,0.6);
      font-size: .9rem;
      font-weight: 600;
      text-align: center;
    }

    .sr-map {
      position: relative;
      overflow: hidden;
      border-radius: 1.4rem;
      border: 1px solid rgba(6,161,84,0.22);
      box-shadow: 0 40px 100px rgba(0,0,0,0.5);
    }
    .sr-mapcard {
      position: absolute;
      left: 1rem; top: 1rem;
      z-index: 10;
      max-width: calc(100% - 2rem);
      border-radius: 1rem;
      border: 1px solid rgba(6,161,84,0.3);
      background: linear-gradient(160deg, rgba(20,17,11,0.94), rgba(7,6,4,0.92));
      padding: .9rem 1.1rem;
      box-shadow: 0 18px 44px rgba(0,0,0,0.5);
    }
    .sr-mapcard-name { font-family: "Sora", sans-serif; font-size: 1rem; font-weight: 800; color: #fbf7ec; }
    .sr-mapcard-addr { margin-top: .25rem; font-size: .72rem; text-transform: uppercase; letter-spacing: .04em; color: rgba(6,161,84,0.78); }
    .sr-iframe {
      display: block;
      height: 30rem;
      width: 100%;
      border: 0;
      filter: saturate(.9) contrast(1.04) brightness(.96);
    }
    @media (min-width: 1024px) {
      .sr-map { position: sticky; top: 6.5rem; }
      .sr-iframe { height: 38rem; }
    }
    @media (max-width: 640px) {
      .showroom-console { padding-top: 3.5rem; }
      .sr-h2 { font-size: clamp(2rem, 9vw, 2.6rem); }
      .sr-masthead { flex-direction: column; align-items: flex-start; gap: 1rem; padding-bottom: 1.5rem; }
      .sr-count { flex-direction: row; align-items: baseline; gap: .5rem; font-size: 2rem; }
      .sr-count span { margin-top: 0; }
      .sr-row { padding: 1.35rem .25rem; gap: .85rem; grid-template-columns: auto 1fr; }
      .sr-chev { display: none; }
      .sr-name { font-size: 1.08rem; }
      .sr-addr { font-size: .8rem; }
      .sr-actions {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(6.2rem, 1fr));
        gap: .45rem;
      }
      .sr-act {
        justify-content: center;
        padding-inline: .65rem;
      }
      .sr-iframe { height: 18rem; }
    }
  `]
})
export class ShowroomsComponent implements OnInit {
  private api = inject(ApiService);
  private sanitizer = inject(DomSanitizer);

  hero = signal<PageHero | null>(null);
  showrooms = signal<Showroom[]>([]);
  selected = signal<Showroom | null>(null);
  mapUrl = signal<SafeResourceUrl | null>(null);

  ngOnInit() {
    this.api.pageHero('showrooms').subscribe({ next: v => this.hero.set(v), error: () => this.hero.set(null) });
    this.api.showrooms().subscribe({
      next: v => {
        this.showrooms.set(v || []);
        if (v?.length) this.select(v[0]);
        else { this.selected.set(null); this.mapUrl.set(null); }
      },
      error: () => { this.showrooms.set([]); this.selected.set(null); this.mapUrl.set(null); }
    });
  }

  heroChips() {
    return (this.hero()?.chips || '').split(',').map(v => v.trim()).filter(Boolean);
  }
  pad(n: number) { return n < 10 ? '0' + n : '' + n; }

  select(s: Showroom) {
    this.selected.set(s);
    const url = `https://maps.google.com/maps?q=${s.lat},${s.lng}&z=15&output=embed`;
    this.mapUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(url));
  }
}
