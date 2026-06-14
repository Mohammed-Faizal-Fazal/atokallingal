import { Component, ElementRef, AfterViewInit, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { LucideStore, LucideUsers, LucideAward, LucideWrench, LucideBike, LucideMapPin } from '@lucide/angular';
import { ApiService, SiteStat } from './api.service';
import { Tilt3dDirective } from './tilt3d.directive';

@Component({
  selector: 'app-stats-band',
  standalone: true,
  imports: [Tilt3dDirective, LucideStore, LucideUsers, LucideAward, LucideWrench, LucideBike, LucideMapPin],
  template: `
  @if (stats().length) {
    <section class="page-band py-14 sm:py-16">
      <div class="stats-grid section-shell relative z-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        @for (s of stats(); track s.label) {
          <article appTilt3d class="stat-card rich-card p-6">
            <span class="icon-badge h-12 w-12">
              @switch (s.icon) {
                @case ('store') { <svg lucideStore class="h-5 w-5"></svg> }
                @case ('users') { <svg lucideUsers class="h-5 w-5"></svg> }
                @case ('award') { <svg lucideAward class="h-5 w-5"></svg> }
                @case ('wrench') { <svg lucideWrench class="h-5 w-5"></svg> }
                @case ('bike') { <svg lucideBike class="h-5 w-5"></svg> }
                @case ('map') { <svg lucideMapPin class="h-5 w-5"></svg> }
              }
            </span>
            <p class="mt-5 font-display text-4xl font-bold text-kblue-900 sm:text-5xl">
              <span class="stat-num" [attr.data-to]="s.value">{{ formatStat(s.value) }}</span>{{ s.suffix }}
            </p>
            <p class="mt-2 text-sm font-semibold uppercase tracking-wide text-ink/55">{{ s.label }}</p>
          </article>
        }
      </div>
    </section>
  }`,
  styles: [`
    .stat-card {
      min-height: 13rem;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    }
    .stat-card::before {
      content: "";
      position: absolute;
      inset: auto 1.2rem 1rem 1.2rem;
      height: 3px;
      border-radius: 999px;
      background: linear-gradient(90deg, #1e70ad, #06a154, #1e70ad);
      opacity: .58;
    }
    @media (max-width: 640px) {
      /* Clean 2x2 grid instead of a peeking horizontal scroll */
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: .7rem;
      }
      .stat-card {
        min-height: 9rem;
        padding: 1rem;
      }
      .stat-card p {
        font-size: 1.85rem !important;
        line-height: 1.05;
      }
      .stat-card .stat-num { font-size: inherit; }
    }
  `]
})
export class StatsBandComponent implements OnInit, AfterViewInit, OnDestroy {
  private host = inject(ElementRef<HTMLElement>);
  private api = inject(ApiService);
  private io?: IntersectionObserver;
  private viewReady = false;
  stats = signal<SiteStat[]>([]);

  ngOnInit() {
    this.api.stats().subscribe({
      next: stats => {
        this.stats.set(stats || []);
        window.setTimeout(() => this.setupCounters(), 0);
      },
      error: () => this.stats.set([])
    });
  }

  ngAfterViewInit() {
    this.viewReady = true;
    this.setupCounters();
  }

  ngOnDestroy() {
    this.io?.disconnect();
  }

  formatStat(value = 0) {
    return Number(value || 0).toLocaleString('en-IN');
  }

  private setupCounters(attempt = 0) {
    if (!this.viewReady) return;
    const root = this.host.nativeElement as HTMLElement;
    const nums = (Array.from(root.querySelectorAll('.stat-num')) as HTMLElement[])
      .filter(el => el.dataset['counted'] !== 'true');
    if (!nums.length) {
      // Render race: stats data is in, but Angular hasn't painted the cards yet.
      // Retry a few times so the numbers never get stranded at 0.
      if (this.stats().length && attempt < 6) window.setTimeout(() => this.setupCounters(attempt + 1), 90);
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      nums.forEach(el => this.finalize(el));
      return;
    }

    this.io?.disconnect();
    this.io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          this.count(e.target as HTMLElement);
          this.io?.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });
    nums.forEach(el => this.io!.observe(el));

    // Safety net: if the count-up never fires for any reason (IO missed, tab
    // backgrounded, etc.) snap the real value in so it can't stick at 0.
    window.setTimeout(() => nums.forEach(el => {
      if (el.dataset['counted'] !== 'true') this.finalize(el);
    }), 2600);
  }

  private finalize(el: HTMLElement) {
    el.dataset['counted'] = 'true';
    el.textContent = Number(el.dataset['to'] || 0).toLocaleString('en-IN');
  }

  private count(el: HTMLElement) {
    el.dataset['counted'] = 'true';
    const to = Number(el.dataset['to'] || 0);
    const duration = 1500;
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(to * eased).toLocaleString('en-IN');
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = to.toLocaleString('en-IN');
    };
    requestAnimationFrame(step);
  }
}
