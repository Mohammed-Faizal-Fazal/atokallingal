import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { LucideShieldCheck, LucideZap, LucideWrench, LucideStore, LucideBadgeCheck, LucideClock } from '@lucide/angular';
import { ApiService } from './api.service';

type Feature = { icon: string; title: string; text: string };

/**
 * Premium "why choose us" feature grid. Each item reads as a distinct feature
 * block — logo-accented icon, title and supporting line. Dark-luxury styling
 * so it sits inside the brand theme; 2 columns on phones, 3 on desktop.
 */
@Component({
  selector: 'app-feature-grid',
  standalone: true,
  imports: [LucideShieldCheck, LucideZap, LucideWrench, LucideStore, LucideBadgeCheck, LucideClock],
  template: `
  <section class="fg-stage relative overflow-hidden bg-transparent py-16 text-white sm:py-24">
    <span class="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(6,161,84,0.14),transparent_64%)]"></span>
    <span class="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(30,112,173,0.10),transparent_64%)]"></span>

    <div class="section-shell relative z-10">
      <div class="mx-auto max-w-2xl text-center">
        <p class="eyebrow justify-center !text-kgreen-300">{{ eyebrow }}</p>
        <h2 class="no-split mt-3 font-display text-3xl font-bold leading-tight sm:text-5xl">{{ title }}</h2>
      </div>

      <div class="mt-9 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        @for (f of items(); track f.title) {
          <article class="fg-card group relative overflow-hidden rounded-2xl border border-white/[0.16] p-4 sm:p-6">
            <span class="fg-icon flex h-11 w-11 items-center justify-center rounded-xl text-[#05161c] sm:h-12 sm:w-12">
              @switch (f.icon) {
                @case ('shield') { <svg lucideShieldCheck class="h-5 w-5"></svg> }
                @case ('zap') { <svg lucideZap class="h-5 w-5"></svg> }
                @case ('wrench') { <svg lucideWrench class="h-5 w-5"></svg> }
                @case ('store') { <svg lucideStore class="h-5 w-5"></svg> }
                @case ('badge') { <svg lucideBadgeCheck class="h-5 w-5"></svg> }
                @case ('clock') { <svg lucideClock class="h-5 w-5"></svg> }
              }
            </span>
            <h3 class="mt-4 font-display text-base font-bold leading-tight text-white sm:text-lg">{{ f.title }}</h3>
            <p class="mt-1.5 text-[0.8rem] leading-5 text-white/62 sm:text-sm sm:leading-6">{{ f.text }}</p>
          </article>
        }
      </div>
    </div>
  </section>`,
  styles: [`
    .fg-card {
      background:
        radial-gradient(280px 140px at 0% 0%, rgba(30,112,173,0.18), transparent 62%),
        linear-gradient(160deg, rgba(31,29,26,0.96), rgba(7,6,4,0.94));
      box-shadow: 0 24px 56px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.13);
      transition: transform .3s ease, border-color .3s ease, box-shadow .3s ease;
    }
    .fg-card::before {
      content: "";
      position: absolute;
      inset: 0 0 auto 0;
      height: 3px;
      background: linear-gradient(90deg, #1e70ad, #06a154 58%, transparent);
      opacity: .9;
    }
    .fg-card:hover {
      transform: translateY(-4px);
      border-color: rgba(6,161,84,0.42);
      box-shadow: 0 30px 70px rgba(0,0,0,0.5);
    }
    .fg-icon {
      background: linear-gradient(135deg, #63d99b, #06a154 54%, #1e70ad);
      box-shadow: 0 12px 26px rgba(6,161,84,0.30), inset 0 1px 0 rgba(255,255,255,0.4);
    }
    /* Bolder, more tactile feature cards on phones */
    @media (max-width: 640px) {
      .fg-card {
        border-radius: 1.25rem;
        padding: 1.15rem 1.05rem 1.25rem;
        box-shadow: 0 22px 48px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06);
      }
      .fg-card::before { height: 4px; }
      .fg-icon {
        height: 2.9rem;
        width: 2.9rem;
        border-radius: 0.9rem;
      }
      .fg-icon svg { height: 1.35rem; width: 1.35rem; }
      .fg-card h3 { margin-top: 1.05rem; font-size: 1.02rem; }
      .fg-card p { margin-top: .5rem; font-size: .82rem; line-height: 1.55; color: rgba(244,241,234,0.66); }
    }
  `]
})
export class FeatureGridComponent implements OnInit {
  private api = inject(ApiService);
  @Input() eyebrow = 'Why Kallingal';
  @Input() title = 'Everything ownership needs, in one trusted group.';
  /** Provide to override the default feature list entirely. */
  @Input() features?: Feature[];

  private showroomCount = signal(0);

  ngOnInit() {
    this.api.showrooms().subscribe({
      next: v => this.showroomCount.set((v || []).length),
      error: () => {}
    });
  }

  /** Feature list — the showroom card reflects the real, live showroom count. */
  items = () => {
    if (this.features) return this.features;
    const n = this.showroomCount();
    const showrooms = n > 0
      ? { icon: 'store', title: n === 1 ? '1 showroom' : `${n} showrooms`, text: 'A connected network across Trivandrum, always close to you.' }
      : { icon: 'store', title: 'Showroom network', text: 'A connected network across Trivandrum, always close to you.' };
    return [
      { icon: 'shield', title: 'Authorized & trusted', text: 'Official Bajaj, Chetak and Tata partner — 50+ years of Trivandrum trust.' },
      { icon: 'zap', title: 'Electric ready', text: 'Chetak EV sales, service and real charging guidance for city riders.' },
      { icon: 'wrench', title: 'In-house service', text: 'Factory-trained technicians, genuine parts and clear estimates.' },
      showrooms,
      { icon: 'badge', title: 'Finance & exchange', text: 'Quick finance, fair exchange and same-day delivery support.' },
      { icon: 'clock', title: 'Lifetime support', text: 'Service, insurance and claims handled by one team, for life.' }
    ];
  };
}
