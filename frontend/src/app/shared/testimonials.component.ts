import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { LucideQuote, LucideStar } from '@lucide/angular';
import { ApiService, Testimonial } from './api.service';
import { RevealDirective } from './reveal.directive';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [LucideQuote, LucideStar, RevealDirective],
  template: `
  <section class="page-band py-16 sm:py-24">
    <div class="section-shell relative z-10">
      <div appReveal class="mx-auto max-w-2xl text-center">
        <p class="eyebrow">{{ eyebrow }}</p>
        <h2 class="no-split mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">{{ heading }} <span class="text-gradient">{{ accent }}</span></h2>
        <p class="mt-4 text-base leading-7 text-ink/65">{{ sub }}</p>
      </div>

      <div class="testimonial-grid mt-12 grid gap-5 md:grid-cols-3">
        @for (t of visible(); track t.name; let i = $index) {
          <figure appReveal [revealDelay]="(i % 3) * 0.08"
            class="rich-card relative flex h-full flex-col p-7">
            <svg lucideQuote class="absolute right-6 top-6 h-9 w-9 text-kteal-100"></svg>
            <div class="flex gap-0.5 text-kgreen-500">
              @for (s of stars(t.rating); track s) { <svg lucideStar class="h-4 w-4 fill-current"></svg> }
            </div>
            <blockquote class="mt-4 flex-1 text-sm leading-7 text-ink/75">"{{ t.quote }}"</blockquote>
            <figcaption class="mt-6 flex items-center gap-3 border-t border-kblue-100 pt-5">
              <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-kgreen-500 via-kteal-600 to-kblue-900 font-display text-sm font-bold text-white shadow-[0_12px_28px_rgba(7,6,4,0.24)]">{{ initials(t.name) }}</span>
              <span>
                <span class="block font-display font-bold text-kblue-900">{{ t.name }}</span>
                <span class="block text-xs font-semibold uppercase tracking-wide text-ink/45">{{ t.role }}</span>
              </span>
            </figcaption>
          </figure>
        }
      </div>

      @if (!visible().length) {
        <div class="rich-card mt-10 p-8 text-center text-sm font-semibold text-ink/55">
          No testimonials published from backend yet.
        </div>
      }
    </div>
  </section>`,
  styles: [`
    @media (max-width: 640px) {
      /* Premium vertical stack — bold quote, logo accent, no carousel */
      .testimonial-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;
        margin-top: 2rem;
      }
      .testimonial-grid figure {
        position: relative;
        overflow: hidden;
        padding: 1.6rem 1.35rem 1.35rem;
        border-radius: 1.35rem;
        box-shadow: 0 24px 54px rgba(0,0,0,0.5) !important;
      }
      /* green/blue accent rail down the left edge */
      .testimonial-grid figure::before {
        content: "";
        position: absolute;
        left: 0; top: 0; bottom: 0;
        width: 4px;
        background: linear-gradient(180deg, #63d99b, #06a154);
      }
      /* oversized faint quote glyph */
      .testimonial-grid figure::after {
        content: "\\201C";
        position: absolute;
        right: .6rem; top: -1.1rem;
        font-family: "Sora", serif;
        font-size: 7rem;
        line-height: 1;
        color: rgba(6,161,84,0.12);
        pointer-events: none;
      }
      .testimonial-grid figure svg.text-kteal-100 { display: none; }
      .testimonial-grid figure blockquote { font-size: .95rem; line-height: 1.7; }
    }
  `]
})
export class TestimonialsComponent implements OnInit {
  private api = inject(ApiService);
  @Input() eyebrow = 'Customer stories';
  @Input() heading = 'Trusted by';
  @Input() accent = 'Kallingal customers';
  @Input() sub = 'Real words from the families and businesses who ride, work and travel with Kallingal.';
  @Input() limit = 3;

  items = signal<Testimonial[]>([]);
  visible = () => this.items().slice(0, this.limit);

  ngOnInit() {
    this.api.testimonials().subscribe({ next: v => this.items.set(v || []), error: () => this.items.set([]) });
  }

  stars(rating = 5) { return Array.from({ length: Math.max(1, Math.min(5, rating || 5)) }, (_, i) => i); }
  initials(name = '') {
    const p = name.trim().split(/\s+/).filter(Boolean);
    return (p[0]?.[0] || '') + (p[1]?.[0] || '');
  }
}
