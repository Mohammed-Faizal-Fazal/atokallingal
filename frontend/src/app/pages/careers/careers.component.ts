import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideArrowRight, LucideTrendingUp, LucideUsers, LucideGraduationCap, LucideHeart } from '@lucide/angular';
import { ApiService, CareerPerk, JobOpening, PageHero } from '../../shared/api.service';
import { ToastService } from '../../shared/toast.service';
import { SettingsService } from '../../shared/settings.service';
import { PageHeroComponent } from '../../shared/page-hero.component';
import { RevealDirective } from '../../shared/reveal.directive';
import { StatsBandComponent } from '../../shared/stats-band.component';

@Component({
  selector: 'app-careers',
  standalone: true,
  imports: [ReactiveFormsModule, PageHeroComponent, RevealDirective, StatsBandComponent, LucideArrowRight, LucideTrendingUp, LucideUsers, LucideGraduationCap, LucideHeart],
  template: `
  <app-page-hero [eyebrow]="hero()?.eyebrow || ''" [title]="hero()?.title || ''"
    [sub]="hero()?.sub || ''" [image]="hero()?.imageUrl || ''" [chips]="heroChips()"/>

  <section class="page-band py-16 sm:py-24">
  <div class="section-shell relative z-10">
    <div appReveal class="max-w-2xl">
      <p class="eyebrow">Why join us</p>
      <h2 class="cr-h2 mt-3 font-display font-black uppercase leading-[0.9]">Build a career<br/><span class="text-gradient">that moves.</span></h2>
    </div>

    <div class="cr-perks mt-12 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
      @for (p of perks(); track p.label; let i = $index) {
        <div appReveal [revealDelay]="i * 0.06" class="cr-perk">
          <div class="cr-perk-top">
            <span class="cr-perk-num">{{ pad(i + 1) }}</span>
            <span class="cr-perk-icon">
              @switch (p.icon) {
                @case ('growth') { <svg lucideTrendingUp class="h-5 w-5"></svg> }
                @case ('team') { <svg lucideUsers class="h-5 w-5"></svg> }
                @case ('learn') { <svg lucideGraduationCap class="h-5 w-5"></svg> }
                @default { <svg lucideHeart class="h-5 w-5"></svg> }
              }
            </span>
          </div>
          <h3 class="cr-perk-label font-display font-bold">{{ p.label }}</h3>
          <p class="cr-perk-text">{{ p.text }}</p>
        </div>
      }
    </div>

    <div appReveal class="cr-open-head mt-20 flex items-end justify-between gap-4 border-b border-white/15 pb-6">
      <div>
        <p class="eyebrow">Open roles</p>
        <h2 class="cr-h2 mt-2 font-display font-black uppercase leading-[0.9]">Find your <span class="text-gradient">seat.</span></h2>
      </div>
      <span class="cr-count">{{ pad(jobs().length) }}<span>Open</span></span>
    </div>

    @if (!jobs().length) {
      <div appReveal class="cr-empty">
        <h3 class="font-display text-2xl font-bold text-white">No openings posted right now</h3>
        <p class="mt-3 max-w-xl leading-7 text-white/68">We're always glad to meet people who love this industry. Send your details and we'll reach out the moment a role that fits opens up.</p>
        <a [href]="settings.waLink('Hi Kallingal, I would like to share my CV for future roles.')" target="_blank" rel="noopener" class="btn-primary mt-6 w-fit">
          Share your CV <svg lucideArrowRight class="ml-2 h-4 w-4"></svg>
        </a>
      </div>
    }

    <div class="cr-jobs">
      @for (j of jobs(); track j.id; let i = $index) {
        <article appReveal [revealDelay]="i * 0.06" class="cr-job">
          <span class="cr-job-num">{{ pad(i + 1) }}</span>
          <div class="cr-job-body">
            <p class="cr-job-meta">{{ j.department }} · {{ j.location }}</p>
            <h3 class="cr-job-title font-display font-black uppercase">{{ j.title }}</h3>
            <p class="cr-job-desc">{{ j.description }}</p>
          </div>
          <div class="cr-job-aside">
            <span class="cr-job-open">Open</span>
            <button (click)="applying.set(j)" class="btn-primary">Apply <svg lucideArrowRight class="ml-2 h-4 w-4"></svg></button>
          </div>
        </article>
      }
    </div>

    @if (applying(); as job) {
      <form appReveal [formGroup]="form" (ngSubmit)="submit(job)" class="cr-form mt-12 max-w-2xl space-y-4">
        <div>
          <p class="eyebrow">Application</p>
          <h3 class="mt-2 font-display text-2xl font-bold text-white">{{ job.title }}</h3>
        </div>
        <input formControlName="name" placeholder="Full name" class="cr-input"/>
        <input formControlName="phone" placeholder="Phone" class="cr-input"/>
        <input formControlName="email" type="email" placeholder="Email" class="cr-input"/>
        <textarea formControlName="note" rows="3" placeholder="Brief note (optional)" class="cr-input"></textarea>
        <div class="flex flex-col gap-3 sm:flex-row">
          <button type="submit" [disabled]="form.invalid || sending()" class="btn-primary disabled:opacity-50">Submit application</button>
          <button type="button" (click)="applyViaWhatsApp(job)" [disabled]="form.invalid"
            class="inline-flex min-h-12 items-center justify-center rounded-full bg-[#25D366] px-6 py-3 font-display font-semibold text-white transition hover:bg-[#1da851] disabled:opacity-50">
            Apply via WhatsApp
          </button>
        </div>
      </form>
    }
  </div>
  </section>

  <app-stats-band/>`,
  styles: [`
    .cr-h2 { font-size: clamp(2.4rem, 5.6vw, 4.4rem); color: #fbf7ec; letter-spacing: -0.01em; }
    .cr-count {
      font-family: "Sora", sans-serif; font-size: clamp(2.4rem, 4.6vw, 3.6rem); font-weight: 900; line-height: .8;
      color: rgba(6,161,84,0.9); display: flex; flex-direction: column; align-items: flex-end;
    }
    .cr-count span { font-size: .58rem; letter-spacing: .26em; text-transform: uppercase; color: rgba(244,241,234,0.5); margin-top: .4rem; }

    /* numbered perks (no cards) */
    .cr-perk { padding-top: 1.25rem; border-top: 1px solid rgba(6,161,84,0.24); }
    .cr-perk-top { display: flex; align-items: center; justify-content: space-between; }
    .cr-perk-num { font-family: "Sora", sans-serif; font-size: 1.5rem; font-weight: 900; color: rgba(6,161,84,0.85); }
    .cr-perk-icon {
      display: inline-flex; height: 2.5rem; width: 2.5rem; align-items: center; justify-content: center;
      border-radius: .8rem; color: #05161c;
      background: linear-gradient(135deg, #35c985, #06a154 55%, #1e70ad);
      box-shadow: 0 12px 24px rgba(30,112,173,0.3);
    }
    .cr-perk-label { margin-top: 1rem; font-size: 1.12rem; color: #fbf7ec; }
    .cr-perk-text { margin-top: .5rem; font-size: .9rem; line-height: 1.7; color: rgba(244,241,234,0.66); }

    .cr-empty {
      margin-top: 2rem; padding: 2rem; border: 1px dashed rgba(6,161,84,0.3); border-radius: 1.2rem;
      background: rgba(255,255,255,0.02);
    }

    /* job index rows */
    .cr-jobs { display: flex; flex-direction: column; }
    .cr-job {
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      gap: 1.75rem;
      padding: 2rem 0;
      border-bottom: 1px solid rgba(255,255,255,0.12);
      transition: padding-left .25s ease;
    }
    .cr-job:hover { padding-left: .6rem; }
    .cr-job-num { font-family: "Sora", sans-serif; font-size: .9rem; font-weight: 900; color: rgba(244,241,234,0.34); }
    .cr-job-meta { font-size: .64rem; font-weight: 800; letter-spacing: .18em; text-transform: uppercase; color: rgba(6,161,84,0.92); }
    .cr-job-title { margin-top: .5rem; font-size: clamp(1.4rem, 3vw, 2.1rem); line-height: 1; letter-spacing: -0.01em; color: #fbf7ec; }
    .cr-job-desc { margin-top: .7rem; max-width: 42rem; font-size: .92rem; line-height: 1.7; color: rgba(244,241,234,0.66); }
    .cr-job-aside { display: flex; flex-direction: column; align-items: flex-end; gap: 1rem; }
    .cr-job-open {
      display: inline-flex; align-items: center; gap: .4rem; border-radius: 999px;
      border: 1px solid rgba(6,161,84,0.5); background: rgba(6,161,84,0.14);
      padding: .3rem .8rem; font-size: .64rem; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; color: #6ee7b7;
    }

    /* dark editorial application form */
    .cr-form {
      border: 1px solid rgba(6,161,84,0.24);
      border-radius: 1.3rem;
      padding: 1.6rem;
      background: linear-gradient(160deg, rgba(20,17,11,0.96), rgba(7,6,4,0.94));
      box-shadow: 0 30px 80px rgba(0,0,0,0.5);
    }
    .cr-input {
      width: 100%; border-radius: .8rem;
      border: 1px solid rgba(6,161,84,0.22);
      background: rgba(255,255,255,0.06);
      color: #f6f2e8; padding: .85rem 1rem; outline: none;
      transition: border-color .2s ease, background .2s ease;
    }
    .cr-input::placeholder { color: rgba(244,241,234,0.46); }
    .cr-input:focus { border-color: #1e70ad; background: rgba(255,255,255,0.1); }

    @media (max-width: 640px) {
      .cr-h2 { font-size: clamp(2rem, 9vw, 2.6rem); }
      .cr-open-head {
        margin-top: 2.6rem;
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
      .cr-count {
        flex-direction: row;
        align-items: baseline;
        gap: .5rem;
        font-size: 2rem;
      }
      .cr-count span { margin-top: 0; }
      .cr-perks { column-gap: 1rem; row-gap: 1.5rem; }
      .cr-perk-num { font-size: 1.3rem; }
      .cr-perk-label { font-size: 1.05rem; }
      .cr-job {
        grid-template-columns: auto 1fr;
        gap: .55rem 1rem;
        padding: 1.6rem 0;
      }
      .cr-job-title { font-size: clamp(1.35rem, 6.5vw, 1.7rem); }
      .cr-job-desc { font-size: .88rem; }
      .cr-job-aside {
        grid-column: 1 / -1;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin-top: .6rem;
      }
      .cr-job-aside .btn-primary { flex: 1; justify-content: center; }
      .cr-form { padding: 1.15rem; }
    }
  `]
})
export class CareersComponent implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);
  settings = inject(SettingsService);
  hero = signal<PageHero | null>(null);
  perks = signal<CareerPerk[]>([]);
  jobs = signal<JobOpening[]>([]);
  applying = signal<JobOpening | null>(null);
  sending = signal(false);
  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    note: ['']
  });

  ngOnInit() {
    this.api.pageHero('careers').subscribe({ next: v => this.hero.set(v), error: () => this.hero.set(null) });
    this.api.careerPerks().subscribe({ next: v => this.perks.set(v || []), error: () => this.perks.set([]) });
    this.api.jobs().subscribe({ next: v => this.jobs.set(v || []), error: () => this.jobs.set([]) });
  }

  heroChips() {
    return (this.hero()?.chips || '').split(',').map(v => v.trim()).filter(Boolean);
  }
  pad(n: number) { return n < 10 ? '0' + n : '' + n; }

  applyViaWhatsApp(job: JobOpening) {
    const v = this.form.getRawValue();
    const msg = `Job application: ${job.title}\nName: ${v.name}\nPhone: ${v.phone}\nEmail: ${v.email}\nNote: ${v.note || '-'}`;
    window.open(this.settings.waLink(msg), '_blank', 'noopener');
    this.toast.info('Opening WhatsApp with your application...');
    this.api.applyJob({ jobId: job.id!, ...v }).subscribe({ next: () => {}, error: () => {} });
  }

  submit(job: JobOpening) {
    this.sending.set(true);
    this.api.applyJob({ jobId: job.id!, ...this.form.getRawValue() }).subscribe({
      next: () => {
        this.toast.success('Application received. HR will be in touch.');
        this.sending.set(false);
        this.form.reset();
        this.applying.set(null);
      },
      error: () => {
        this.toast.error('Could not submit. Try Apply via WhatsApp instead.');
        this.sending.set(false);
      }
    });
  }
}
