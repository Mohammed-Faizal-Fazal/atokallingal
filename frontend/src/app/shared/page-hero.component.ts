import { Component, Input, AfterViewInit } from '@angular/core';
import { LucideArrowDown, LucideSparkles } from '@lucide/angular';
import gsap from 'gsap';

/**
 * Editorial / magazine-style page header. Instead of a floating card, the hero
 * is laid out like a print spread: a masthead rule, an oversized title, a thin
 * logo-blue rule, an editorial lead, and a numbered "contents" index (the chips
 * reimagined as a magazine index with hairline dividers). Same inputs as before.
 */
@Component({
  selector: 'app-page-hero',
  standalone: true,
  imports: [LucideArrowDown, LucideSparkles],
  template: `
  <section class="page-hero relative isolate flex min-h-[82svh] flex-col overflow-hidden bg-transparent text-white">
    <img [src]="image" alt="" class="page-hero-img absolute inset-0 -z-30 h-full w-full object-cover" loading="eager"/>
    <div class="absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgba(7,6,4,0.76)_0%,rgba(7,6,4,0.46)_42%,rgba(7,6,4,0.80)_100%)]"></div>
    <div class="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_84%_16%,rgba(30,112,173,0.09),transparent_40%),radial-gradient(circle_at_8%_88%,rgba(6,161,84,0.15),transparent_40%),radial-gradient(circle_at_55%_105%,rgba(30,112,173,0.08),transparent_42%)]"></div>
    <div class="absolute inset-x-0 bottom-0 -z-10 h-28 bg-gradient-to-t from-[rgba(5,22,28,0.92)] to-transparent"></div>

    <!-- giant editorial folio watermark -->
    <span class="ph-watermark pointer-events-none absolute -z-10 select-none font-display font-black">0{{ chips.length || 1 }}</span>

    <!-- masthead -->
    <div class="ph-masthead section-shell relative z-10 pt-24 sm:pt-28">
      <div class="ph-fade flex items-center justify-between gap-4 border-b border-white/15 pb-4">
        <span class="inline-flex items-center gap-2 text-[0.66rem] font-bold uppercase tracking-[0.3em] text-white/60">
          <svg lucideSparkles class="h-3.5 w-3.5 text-kgreen-300"></svg>Kallingal / Trivandrum
        </span>
        <span class="text-[0.66rem] font-black uppercase tracking-[0.32em] text-kgreen-300">{{ eyebrow }}</span>
      </div>
    </div>

    <!-- editorial body -->
    <div class="ph-body section-shell relative z-10 flex flex-1 flex-col justify-center py-10 sm:py-14">
      <h1 class="ph-title font-display font-black uppercase leading-[0.86] tracking-tight">
        @for (line of titleLines(); track $index; let i = $index) {
          <span class="ph-line-wrap"><span class="ph-line" [class.ph-line-accent]="titleLines().length > 1 && i === titleLines().length - 1">{{ line }}</span></span>
        }
      </h1>

      <div class="ph-rule ph-fade"></div>

      <div class="mt-8 grid gap-x-12 gap-y-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
        @if (sub) {
          <p class="ph-fade ph-lead">{{ sub }}</p>
        }
        @if (chips.length) {
          <div class="ph-fade ph-index">
            <p class="ph-index-head">In this section</p>
            @for (chip of chips; track chip; let i = $index) {
              <div class="ph-index-row">
                <span class="ph-index-num">0{{ i + 1 }}</span>
                <span class="ph-index-label">{{ chip }}</span>
                <span class="ph-index-line"></span>
              </div>
            }
          </div>
        }
      </div>
    </div>

    <!-- footer scroll line -->
    <div class="ph-footer section-shell relative z-10 pb-9 sm:pb-10">
      <div class="ph-fade flex items-center justify-between gap-4 border-t border-white/15 pt-4 text-[0.66rem] font-bold uppercase tracking-[0.28em] text-white/55">
        <span class="inline-flex items-center gap-2"><svg lucideArrowDown class="h-3.5 w-3.5 text-kgreen-300"></svg>Scroll to explore</span>
        <span>{{ chips.length || 0 }} highlights</span>
      </div>
    </div>
  </section>`,
  styles: [`
    .page-hero {
      min-height: clamp(33rem, 82svh, 50rem);
    }
    .page-hero-img {
      animation: heroImageDrift 28s ease-in-out infinite alternate;
      filter: saturate(1.03) contrast(1.06) brightness(.80) grayscale(.08);
      transform-origin: center;
    }
    @keyframes heroImageDrift {
      from { transform: scale(1.04) translate3d(0, 0, 0); }
      to { transform: scale(1.08) translate3d(-1.1%, .8%, 0); }
    }
    /* Desktop-only cinematic light-leak: a soft green/blue wash over the hero
       image via screen blend, so highlights pick up brand colour. Static (the
       image drifts beneath it) and gated off phones — blend layers cost
       scroll-frame performance on mobile, which earlier work removed. */
    @media (min-width: 768px) {
      .page-hero::after {
        content: "";
        position: absolute;
        inset: 0;
        z-index: -15;
        pointer-events: none;
        background:
          radial-gradient(120% 82% at 10% 0%, rgba(6,161,84,0.20), transparent 52%),
          radial-gradient(115% 80% at 92% 6%, rgba(30,112,173,0.17), transparent 50%),
          linear-gradient(180deg, transparent 42%, rgba(30,112,173,0.06));
        mix-blend-mode: screen;
      }
    }
    /* Giant faint folio number, bled off the right edge — pure magazine */
    .ph-watermark {
      right: -3vw;
      top: 50%;
      transform: translateY(-50%);
      font-size: clamp(20rem, 52vw, 56rem);
      line-height: .8;
      color: rgba(244,241,234,0.035);
    }
    /* Oversized editorial title */
    .ph-body { min-height: 0; }
    .ph-title { font-size: clamp(3.1rem, 9.4vw, 7.8rem); }
    .ph-line-wrap { display: block; overflow: hidden; padding-bottom: .06em; }
    .ph-line { display: block; color: #fbf7ec; }
    .ph-line-accent {
      background: linear-gradient(100deg, #fbf7ec, #06a154 34%, #1e70ad 66%, #1e70ad 96%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    .ph-rule {
      margin-top: 2rem;
      height: 2px;
      width: min(22rem, 60%);
      background: linear-gradient(90deg, #06a154, #1e70ad 58%, transparent);
      transform-origin: left;
    }
    .ph-lead {
      max-width: 34rem;
      font-size: 1.06rem;
      line-height: 1.85;
      color: rgba(244,241,234,0.82);
    }
    /* Numbered "contents" index — hairline rows, no cards */
    .ph-index { align-self: end; }
    .ph-index-head {
      margin-bottom: .9rem;
      font-size: .64rem;
      font-weight: 800;
      letter-spacing: .26em;
      text-transform: uppercase;
      color: rgba(99,217,155,0.82);
    }
    .ph-index-row {
      display: grid;
      grid-template-columns: auto auto 1fr;
      align-items: baseline;
      gap: .9rem;
      padding: .8rem 0;
      border-top: 1px solid rgba(255,255,255,0.14);
    }
    .ph-index-row:last-child { border-bottom: 1px solid rgba(255,255,255,0.14); }
    .ph-index-num {
      font-family: "Sora", sans-serif;
      font-size: .72rem;
      font-weight: 900;
      color: #1e70ad;
    }
    .ph-index-label {
      font-family: var(--font-display, inherit);
      font-size: 1rem;
      font-weight: 800;
      letter-spacing: .01em;
      text-transform: uppercase;
      color: #fbf7ec;
    }
    .ph-index-line {
      align-self: center;
      height: 1px;
      background: linear-gradient(90deg, rgba(6,161,84,0.45), transparent);
    }

    @media (max-width: 1023px) {
      .page-hero { min-height: 78svh; }
      .page-hero .ph-body { justify-content: flex-start; padding-top: 2.15rem; padding-bottom: 2.15rem; }
      .ph-title { font-size: clamp(2.3rem, 8.6vw, 4.3rem); letter-spacing: -0.01em; }
      .ph-lead { font-size: 1rem; line-height: 1.8; }
    }
    @media (max-width: 640px) {
      .page-hero { min-height: 72svh; }
      .page-hero-img { filter: saturate(1.04) contrast(1.05) brightness(.74) grayscale(.08); }
      .ph-masthead { padding-top: 5.9rem; }
      .page-hero .ph-body { padding-top: 1.35rem; padding-bottom: 1.35rem; }
      .ph-title { font-size: clamp(1.85rem, 8.6vw, 2.95rem); line-height: .94; letter-spacing: -0.015em; }
      .ph-watermark { font-size: clamp(13rem, 62vw, 20rem); top: auto; bottom: 7%; right: -10vw; color: rgba(244,241,234,0.03); }
      .ph-rule { margin-top: 1.05rem; width: 7rem; }
      .ph-lead { font-size: .97rem; line-height: 1.78; }
      .ph-index {
        align-self: stretch;
        border: 1px solid rgba(6,161,84,0.20);
        border-radius: 1rem;
        background: linear-gradient(160deg, rgba(18,42,42,0.88), rgba(7,6,4,0.84));
        padding: .85rem;
        box-shadow: 0 18px 44px rgba(0,0,0,0.28);
      }
      .ph-index-head { margin-bottom: .35rem; }
      .ph-index-row { padding: .54rem 0; gap: .7rem; grid-template-columns: auto 1fr; }
      .ph-index-line { display: none; }
      .ph-index-num { font-size: .68rem; }
      .ph-index-label { font-size: .9rem; }
      .ph-footer { display: none; }
    }
    @media (prefers-reduced-motion: reduce) {
      .page-hero-img { animation: none; }
    }
  `]
})
export class PageHeroComponent implements AfterViewInit {
  @Input({ required: true }) eyebrow = '';
  @Input({ required: true }) title = '';
  @Input() sub = '';
  @Input() image = 'assets/images/IMG_2789.webp';
  @Input() chips: string[] = ['Sales', 'Service', 'Insurance', 'EV'];

  titleLines() {
    const parts = (this.title || '').split('|').map(v => v.trim()).filter(Boolean);
    return parts.length ? parts : [this.title || ''];
  }

  ngAfterViewInit() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.from('.ph-line', { yPercent: 92, duration: 1.15, ease: 'expo.out', stagger: 0.1, delay: 0.08 });
    gsap.from('.ph-rule', { scaleX: 0, duration: 1.0, ease: 'power3.out', delay: 0.48 });
    gsap.from('.ph-fade', { opacity: 0, y: 16, stagger: 0.07, duration: 0.82, delay: 0.34, ease: 'power3.out' });
  }
}
