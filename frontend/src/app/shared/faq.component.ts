import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideArrowRight, LucideChevronDown } from '@lucide/angular';
import { ApiService, Faq } from './api.service';
import { RevealDirective } from './reveal.directive';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [RouterLink, RevealDirective, LucideArrowRight, LucideChevronDown],
  template: `
  <section class="page-band py-16 sm:py-24">
    <div class="section-shell relative z-10 grid gap-10 lg:grid-cols-[0.82fr_1.18fr]">
      <div appReveal class="lg:sticky lg:top-28 lg:self-start">
        <p class="eyebrow">{{ eyebrow }}</p>
        <h2 class="no-split mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">{{ heading }} <span class="text-gradient">{{ accent }}</span></h2>
        <p class="mt-4 max-w-md text-base leading-7 text-ink/65">{{ sub }}</p>
        <a routerLink="/contact" fragment="enquiry" class="btn-primary mt-7 w-fit">Ask us anything <svg lucideArrowRight class="ml-2 h-4 w-4"></svg></a>
      </div>
      <div appReveal class="faq-list space-y-3">
        @for (f of items(); track f.question; let i = $index) {
          <div class="overflow-hidden rounded-2xl border bg-white/[.86] shadow-[0_16px_42px_rgba(7,17,31,0.08)] transition"
               [class.border-kteal-300]="openFaq() === i" [class.border-kblue-100]="openFaq() !== i"
               [class.shadow-lg]="openFaq() === i">
            <button type="button" (click)="toggle(i)" class="flex w-full items-center justify-between gap-4 p-5 text-left"
                    [attr.aria-expanded]="openFaq() === i">
              <span class="font-display text-base font-bold text-kblue-900 sm:text-lg">{{ f.question }}</span>
              <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-kteal-50 text-kteal-700 transition-transform duration-300"
                    [class.rotate-180]="openFaq() === i">
                <svg lucideChevronDown class="h-4 w-4"></svg>
              </span>
            </button>
            @if (openFaq() === i) {
              <div class="faq-panel px-5 pb-5 text-sm leading-7 text-ink/70">{{ f.answer }}</div>
            }
          </div>
        }
        @if (!items().length) {
          <div class="rich-card p-8 text-center text-sm font-semibold text-ink/55">
            No FAQs published from backend yet.
          </div>
        }
      </div>
    </div>
  </section>`,
  styles: [`
    @keyframes faqOpen { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }
    .faq-panel { animation: faqOpen 0.25s ease-out; }
    /* Frosted-glass accordion site-wide (these cards use bg-white, so the
       global rich-card glass rule misses them — frost them here too). */
    .faq-list > div {
      background: linear-gradient(160deg, rgba(31,29,26,0.96), rgba(7,6,4,0.94)) !important;
      border-color: rgba(255,255,255,0.16) !important;
      box-shadow: 0 26px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.12) !important;
    }
    .faq-list .text-kblue-900 { color: #f6f2e8 !important; }
    .faq-panel { color: rgba(244,241,234,0.74) !important; }
    .faq-list [class*="bg-kteal-50"] {
      background: rgba(6,161,84,0.16) !important;
      color: #63d99b !important;
    }
    @media (max-width: 640px) {
      .faq-list {
        margin-inline: -1rem;
        padding-inline: 1rem;
      }
      .faq-list > div {
        border-radius: 1rem;
      }
      .faq-list button {
        min-height: 4.25rem;
        padding: 1rem;
      }
      .faq-panel {
        padding-inline: 1rem;
        padding-bottom: 1rem;
      }
    }
  `]
})
export class FaqComponent implements OnInit {
  private api = inject(ApiService);
  @Input() eyebrow = 'Good to know';
  @Input() heading = 'Questions,';
  @Input() accent = 'answered.';
  @Input() sub = 'Everything you need before you walk in, ride out or book a service. Still unsure? Our team replies on WhatsApp in minutes.';

  items = signal<Faq[]>([]);
  openFaq = signal<number | null>(0);

  ngOnInit() {
    this.api.faqs().subscribe({
      next: v => {
        this.items.set(v || []);
        this.openFaq.set(v?.length ? 0 : null);
      },
      error: () => { this.items.set([]); this.openFaq.set(null); }
    });
  }

  toggle(i: number) { this.openFaq.set(this.openFaq() === i ? null : i); }
}
