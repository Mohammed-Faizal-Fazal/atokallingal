import { Component, Input } from '@angular/core';

/**
 * Kallingal brand lockup. Uses the real official logo PNG when present
 * (assets/brand/kallingal-logo.png); otherwise renders a faithful, fully
 * scalable SVG recreation — the green road-swoosh with the blue lane and the
 * "KALLINGAL" wordmark — so the brand always shows crisp at any size.
 *
 *   <app-brand-logo [size]="40" [dark]="false" [showWordmark]="true"/>
 */
@Component({
  selector: 'app-brand-logo',
  standalone: true,
  template: `
  <span class="brand-lockup inline-flex items-center gap-2.5" [attr.aria-label]="'Kallingal — Redefining Excellence'">
    @if (!imgFailed) {
      <!-- Real official Kallingal logo (transparent PNG). Falls back to the
           animated SVG lockup below if the file isn't present yet. -->
      <img class="brand-img select-none" src="assets/brand/kallingal-logo.png"
           [style.height.px]="size * 1.4" [style.width.px]="size * 4.5"
           alt="Kallingal — Redefining Excellence" (error)="imgFailed = true"/>
    } @else {
    <span class="brand-svg relative inline-flex items-center">
      <svg [attr.height]="size * 1.06" [attr.viewBox]="showWordmark ? '0 0 244 48' : '0 0 60 48'"
           fill="none" class="block w-auto" aria-hidden="true">
        <!-- Recreated Kallingal mark: a green road-swoosh with the blue lane behind it -->
        <path d="M51 9 C27 11 13 16 8 29 C6 36 8 42 13 46 C13 40 17 34 25 29 C34 23 43 20 50 18 Z" fill="#1e70ad"/>
        <path d="M53 6 C28 8 13 13 9 25 C7 32 9 39 14 43 C14 37 18 31 25 26 C34 20 43 17 52 15 Z" fill="#1aa84f"/>
        @if (showWordmark) {
          <text x="64" y="35" font-family="'Sora','Plus Jakarta Sans',sans-serif"
                font-size="33" font-weight="800" font-style="italic" letter-spacing="0.4"
                [attr.fill]="dark ? '#27b75e' : '#1aa84f'">KALLINGAL</text>
        }
      </svg>
      <span class="brand-sheen pointer-events-none absolute inset-0"></span>
    </span>
    }
  </span>`,
  styles: [`
    :host { display: inline-flex; }
    /* The official PNG is on a transparent plate — crop straight to the logo art
       so the KALLINGAL reads large on the dark navbar. The logo sits STILL (a
       premium logo doesn't wobble); it lifts gently only on hover. */
    .brand-img {
      display: block;
      object-fit: cover;
      object-position: 46% center;
      filter: drop-shadow(0 6px 16px rgba(0,0,0,.5));
      transition: transform .5s cubic-bezier(.22,.9,.27,1), filter .45s ease;
      will-change: transform;
    }
    .brand-lockup:hover .brand-img {
      transform: translateY(-3px) scale(1.06);
      filter: drop-shadow(0 14px 30px rgba(30,112,173,.45));
    }
    .brand-svg { overflow: hidden; transition: transform .5s ease; }
    .brand-lockup:hover .brand-svg { transform: translateY(-2px) scale(1.04); }
    /* One-pass sheen sweep on hover only (no idle loop) */
    .brand-sheen {
      background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.45) 50%, transparent 60%);
      transform: translateX(-160%) skewX(-14deg);
      mix-blend-mode: overlay;
    }
    .brand-lockup:hover .brand-sheen { transition: transform 0.85s ease; transform: translateX(160%) skewX(-14deg); }
    @media (prefers-reduced-motion: reduce) {
      .brand-sheen { display: none; }
    }
  `]
})
export class BrandLogoComponent {
  @Input() size = 40;
  @Input() dark = false;
  @Input() showWordmark = true;
  /** Flips to the recreated SVG lockup if the real logo PNG is missing. */
  imgFailed = false;
}
