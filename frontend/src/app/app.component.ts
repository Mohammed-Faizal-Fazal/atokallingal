import { Component, AfterViewInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd, NavigationStart } from '@angular/router';
import { filter } from 'rxjs';
import { PreloaderComponent } from './core/preloader.component';
import { NavbarComponent } from './core/navbar.component';
import { FooterComponent } from './core/footer.component';
import { WhatsappFabComponent } from './core/whatsapp-fab.component';
import { ToastsComponent } from './core/toasts.component';
import { SeoService } from './shared/seo.service';
import { SettingsService } from './shared/settings.service';

type RGB = [number, number, number];

// Soft premium colour journey, sampled across scroll progress (0 to 1).
// Logo green and blue stay present, with cream used to warm the dark UI.
const STOPS: { a: RGB; b: RGB; c: RGB }[] = [
  { a: [31, 157, 120], b: [21, 58, 70], c: [198, 155, 66] },
  { a: [16, 96, 78], b: [37, 99, 214], c: [237, 207, 134] },
  { a: [37, 99, 214], b: [14, 55, 48], c: [92, 86, 76] },
  { a: [31, 157, 120], b: [31, 29, 26], c: [244, 241, 234] }
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PreloaderComponent, NavbarComponent, FooterComponent, WhatsappFabComponent, ToastsComponent],
  template: `
    <video #bgVideo class="bg-video" aria-hidden="true" muted loop playsinline
           poster="assets/images/kallingal-bg-poster.webp" src="assets/video/kallingal-background-lite.mp4"></video>
    <div class="scroll-bg" #scrollBg></div>
    <div class="cursor-aura" aria-hidden="true"></div>
    <div class="scroll-progress" aria-hidden="true"><span></span></div>
    <div class="route-wipe" aria-hidden="true"></div>
    <app-preloader />
    <app-navbar />
    <app-toasts />
    <main><router-outlet /></main>
    <app-footer />
    <app-whatsapp-fab />
  ` 
})
export class AppComponent implements AfterViewInit {
  @ViewChild('scrollBg') scrollBg!: ElementRef<HTMLDivElement>;
  @ViewChild('bgVideo') bgVideo?: ElementRef<HTMLVideoElement>;
  private ticking = false;
  private lastBgP = -1;
  private lastScrollP = -1;
  private scrollingNow = false;
  private scrollIdleTimer = 0;
  private focusIO?: IntersectionObserver;
  private parallaxEls: HTMLElement[] = [];
  private magneticBound = new WeakSet<HTMLElement>();
  private splitDone = new WeakSet<HTMLElement>();
  private splitIO?: IntersectionObserver;
  private routeTimer = 0;
  private get reducedMotion() { return matchMedia('(prefers-reduced-motion: reduce)').matches; }

  constructor(
    private zone: NgZone,
    private router: Router,
    seo: SeoService,
    settings: SettingsService
  ) {
    seo.init();
    settings.load();
  }

  ngAfterViewInit(): void {
    this.setupBgVideo();
    // Run scroll work outside Angular so it never triggers change detection.
    this.zone.runOutsideAngular(() => {
      window.addEventListener('scroll', () => { this.flagScrolling(); this.queue(); }, { passive: true });
      window.addEventListener('resize', () => this.queue(), { passive: true });
      window.addEventListener('pointermove', (event) => this.paintPointer(event), { passive: true });
      this.paint();
    });
    this.router.events
      .pipe(filter(e => e instanceof NavigationStart))
      .subscribe(e => this.beginRouteTransition((e as NavigationStart).url));

    // Recompute after each navigation (page heights differ).
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => setTimeout(() => {
        this.endRouteTransition();
        this.updateRouteChrome();
        this.setupTravel();
        this.zone.runOutsideAngular(() => { this.bindMotion(); this.paint(); });
      }, 90));

    this.updateRouteChrome();
    this.zone.runOutsideAngular(() => {
      setTimeout(() => { this.setupTravel(); this.bindMotion(); this.paint(); }, 60);
      this.setupRipple();
    });
  }

  /**
   * Site-wide background video. Muted always. On desktop it plays (a continuous,
   * fixed backdrop behind every page). On phones — and under reduced-motion — it
   * is left paused so the poster frame shows instead: a fixed, always-decoding
   * full-screen video is a scroll-smoothness risk on mobile that the poster avoids.
   */
  private setupBgVideo() {
    const v = this.bgVideo?.nativeElement;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    // Phones / reduced-motion: poster only — never fetch or play the video (a
    // fixed, always-decoding full-screen video is a scroll-smoothness risk).
    if (!window.matchMedia('(min-width: 768px)').matches || this.reducedMotion) {
      v.preload = 'none';
      return;
    }
    // Retry-burst autoplay. A single fire-and-forget play() at boot is rejected
    // by Chrome because the opaque preloader overlay still occludes the page, and
    // the rejection is silently swallowed — which left this fixed background
    // frozen on its poster image (kallingal-bg-poster.webp) for the whole session
    // while the hero video played, reading as "an image behind the video". Keep
    // nudging play() (~350ms, ~9s cap) and re-attempt the instant the preloader
    // lifts and on media-ready, so it actually starts behind every page.
    const attempt = () => {
      if (!v.paused) return;
      v.muted = true;
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    };
    let tries = 0;
    const id = window.setInterval(() => {
      attempt();
      if ((!v.paused && v.currentTime > 0) || ++tries > 25) window.clearInterval(id);
    }, 350);
    window.addEventListener('preloader:done', attempt, { once: true });
    ['loadeddata', 'canplay'].forEach(ev => v.addEventListener(ev, attempt));
    attempt();
  }

  /** (Re)wire the per-page motion: split headings, parallax targets, magnets. */
  private bindMotion() {
    this.bindSplitHeadings();
    this.bindParallax();
    this.bindMagnetic();
  }

  /**
   * Split-text headings — each section heading's words rise out from behind a
   * clip mask as it scrolls into view. Element children (e.g. the gradient
   * accent span) are kept intact as a single unit so the gradient isn't split.
   */
  private bindSplitHeadings() {
    if (this.reducedMotion || this.router.url.startsWith('/admin')) return;
    if (!this.splitIO && typeof IntersectionObserver !== 'undefined') {
      this.splitIO = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('split-in');
            this.splitIO!.unobserve(e.target);
          }
        });
      }, { rootMargin: '0px 0px 4% 0px', threshold: 0 });
    }
    document.querySelectorAll<HTMLElement>('main h2.font-display').forEach(h => {
      if (this.splitDone.has(h) || h.closest('app-page-hero') || h.classList.contains('no-split')) return;
      const frag = document.createDocumentFragment();
      let i = 0;
      const pushUnit = (inner: HTMLElement) => {
        inner.classList.add('sw-i');
        inner.style.setProperty('--i', String(Math.min(i++, 10)));
        const mask = document.createElement('span');
        mask.className = 'sw';
        mask.appendChild(inner);
        frag.appendChild(mask);
      };
      h.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          (node.textContent || '').split(/(\s+)/).forEach(token => {
            if (token === '') return;
            if (!token.trim()) { frag.appendChild(document.createTextNode(token)); return; }
            const inner = document.createElement('span');
            inner.textContent = token;
            pushUnit(inner);
          });
        } else if (node.nodeName === 'BR') {
          frag.appendChild(node.cloneNode(false));
        } else {
          pushUnit(node.cloneNode(true) as HTMLElement);
        }
      });
      if (!i) return;
      h.textContent = '';
      h.appendChild(frag);
      this.splitDone.add(h);
      if (this.splitIO) this.splitIO.observe(h);
      else h.classList.add('split-in');
      // Safety net: reveal even if the observer never fires (e.g. always-in-view).
      setTimeout(() => h.classList.add('split-in'), 2600);
    });
  }

  /** Collect the image-cards that drift on scroll (transform set live in paint). */
  private bindParallax() {
    // Per-frame image parallax was removed: drifting these photos forced a
    // synchronous reflow + re-composite of their filter/mix-blend grade on every
    // scroll frame, which made scrolling stutter. The static cinematic grade
    // stays; only the costly per-frame motion is gone.
    this.parallaxEls = [];
  }

  /**
   * Magnetic buttons — primary actions ease toward the cursor while hovered,
   * then spring back on leave. Fine-pointer only (skipped on touch).
   */
  private bindMagnetic() {
    if (this.reducedMotion || !matchMedia('(pointer: fine)').matches) return;
    document.querySelectorAll<HTMLElement>('.btn-primary, .btn-outline, .nav-cta').forEach(btn => {
      if (this.magneticBound.has(btn)) return;
      this.magneticBound.add(btn);
      const strength = 0.28;
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        const mx = (e as PointerEvent).clientX - (r.left + r.width / 2);
        const my = (e as PointerEvent).clientY - (r.top + r.height / 2);
        btn.style.transform = `translate(${(mx * strength).toFixed(1)}px, ${(my * strength).toFixed(1)}px)`;
      });
      btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
    });
  }

  /**
   * Site-wide click ripple — a soft light burst radiates from the pointer on
   * every primary action button (and the mobile call/email/WhatsApp dock).
   * One global listener, so every page gets the premium feedback for free.
   */
  private setupRipple() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const selector = '.btn-primary, .btn-outline, .nav-cta, .dock-action, .mobile-link, .nav-burger';
    document.addEventListener('pointerdown', (event) => {
      const pe = event as PointerEvent;
      const host = (pe.target as HTMLElement | null)?.closest<HTMLElement>(selector);
      if (!host) return;
      const rect = host.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 1.15;
      const ink = document.createElement('span');
      ink.className = 'ripple-ink';
      ink.style.width = ink.style.height = `${size}px`;
      ink.style.left = `${pe.clientX - rect.left - size / 2}px`;
      ink.style.top = `${pe.clientY - rect.top - size / 2}px`;
      host.appendChild(ink);
      ink.addEventListener('animationend', () => ink.remove());
      setTimeout(() => ink.remove(), 800);
    }, { passive: true });
  }

  /**
   * "Travel-in" — each section flies in from the distance and zooms close as it
   * enters the viewport. Driven by an IntersectionObserver toggling a CSS class.
   */
  private setupTravel() {
    if (typeof IntersectionObserver === 'undefined') return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    this.focusIO?.disconnect();

    // Admin stays static (it's a dashboard, not a marketing page).
    if (this.router.url.startsWith('/admin')) {
      document.querySelectorAll('.travel').forEach(s => s.classList.remove('travel', 'inview'));
      return;
    }

    // Reveal each section once so scrolling stays calm instead of popping.
    this.focusIO = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const section = e.target as HTMLElement;
        section.classList.add('inview');
        this.focusIO?.unobserve(section);
      });
      // Fire as the section is still entering from the bottom (positive bottom
      // margin + threshold 0), so the "coming to near" motion plays on entry and
      // is finished by the time it reaches a comfortable reading position — you
      // never scroll onto a blank section and wait for it to fade in.
    }, { rootMargin: '0px 0px 8% 0px', threshold: 0 });

    document.querySelectorAll<HTMLElement>('main section').forEach(s => {
      // The big home video hero shows instantly — it shouldn't fly in.
      if (s.classList.contains('hero-stage')) { s.classList.add('travel', 'inview'); return; }
      // Opt-out (.no-travel): sections with heavy auto-scrolling image marquees
      // skip the scale reveal — scaling a section full of large images forces an
      // expensive re-raster on arrival and stutters the scroll just as you reach it.
      if (s.classList.contains('no-travel')) return;
      // Sections whose blocks reveal themselves (appReveal) manage their own
      // per-block "coming to near" — don't also reveal the whole section, which
      // would double-animate and scale a big image section in one heavy pass.
      if (s.querySelector('[appReveal]')) return;
      s.classList.add('travel');
      this.focusIO!.observe(s);
    });
  }

  /**
   * Toggle body.is-scrolling so CSS can freeze heavy image marquees while the
   * user actively scrolls (two wide animated layers compositing during a vertical
   * scroll is what stutters phones), resuming ~160ms after motion stops. Runs
   * outside the Angular zone — it's a class toggle, no change detection.
   */
  private flagScrolling() {
    if (!this.scrollingNow) {
      this.scrollingNow = true;
      document.body.classList.add('is-scrolling');
    }
    clearTimeout(this.scrollIdleTimer);
    this.scrollIdleTimer = window.setTimeout(() => {
      this.scrollingNow = false;
      document.body.classList.remove('is-scrolling');
    }, 160);
  }

  private queue() {
    if (this.ticking) return;
    this.ticking = true;
    requestAnimationFrame(() => { this.paint(); this.ticking = false; });
  }

  private paint() {
    const el = this.scrollBg?.nativeElement;
    if (!el) return;
    const progressDoc = document.documentElement;
    const progressMax = progressDoc.scrollHeight - window.innerHeight;
    const progressP = progressMax > 0 ? Math.min(1, Math.max(0, window.scrollY / progressMax)) : 0;
    if (Math.abs(progressP - this.lastScrollP) > 0.002) {
      this.lastScrollP = progressP;
      progressDoc.style.setProperty('--scroll-progress', progressP.toFixed(4));
    }
    // On phones, repainting a fixed full-screen gradient layer during touch
    // scroll is a real stutter source — keep the static CSS gradient and skip
    // the scroll-reactive recolor entirely. (Desktop GPUs handle it fine.)
    if (window.innerWidth <= 767) return;
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;

    // Repaint the living background only when the scroll position has moved a
    // meaningful amount — rewriting three radial-gradients on every scroll frame
    // forces a full layer repaint and is a real source of scroll jank.
    if (Math.abs(p - this.lastBgP) > 0.012) {
      this.lastBgP = p;
      const a = sample(p, 'a'), b = sample(p, 'b'), c = sample(p, 'c');
      el.style.background =
        `radial-gradient(1120px 700px at 8% -8%, rgba(${a},0.11), transparent 60%),` +
        `radial-gradient(980px 720px at 100% 4%, rgba(${b},0.08), transparent 58%),` +
        `radial-gradient(920px 780px at 50% 116%, rgba(${c},0.08), transparent 62%)`;
    }
  }

  private paintPointer(event: PointerEvent) {
    if (event.pointerType === 'touch') return;
    document.documentElement.style.setProperty('--cursor-x', `${event.clientX}px`);
    document.documentElement.style.setProperty('--cursor-y', `${event.clientY}px`);
  }

  private updateRouteChrome() {
    document.body.classList.toggle('is-admin', this.router.url.startsWith('/admin'));
  }

  private beginRouteTransition(nextUrl: string) {
    if (this.reducedMotion || nextUrl.startsWith('/admin')) return;
    window.clearTimeout(this.routeTimer);
    document.body.classList.remove('route-settling');
    document.body.classList.add('route-moving');
  }

  private endRouteTransition() {
    if (this.reducedMotion || this.router.url.startsWith('/admin')) {
      document.body.classList.remove('route-moving', 'route-settling');
      return;
    }
    document.body.classList.remove('route-moving');
    document.body.classList.add('route-settling');
    window.clearTimeout(this.routeTimer);
    this.routeTimer = window.setTimeout(() => document.body.classList.remove('route-settling'), 460);
  }
}

function sample(p: number, key: 'a' | 'b' | 'c'): string {
  const seg = (STOPS.length - 1) * p;
  const i = Math.min(STOPS.length - 2, Math.floor(seg));
  const t = seg - i;
  const from = STOPS[i][key], to = STOPS[i + 1][key];
  const r = Math.round(from[0] + (to[0] - from[0]) * t);
  const g = Math.round(from[1] + (to[1] - from[1]) * t);
  const b = Math.round(from[2] + (to[2] - from[2]) * t);
  return `${r},${g},${b}`;
}
