import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService, PageHero } from '../../shared/api.service';
import { ToastService } from '../../shared/toast.service';
import { SettingsService } from '../../shared/settings.service';
import { PageHeroComponent } from '../../shared/page-hero.component';
import { RevealDirective } from '../../shared/reveal.directive';
import { WhatsappIconComponent } from '../../shared/whatsapp-icon.component';
import { LucideMail, LucidePhone, LucideSend } from '@lucide/angular';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, PageHeroComponent, RevealDirective, WhatsappIconComponent, LucidePhone, LucideMail, LucideSend],
  template: `
  <app-page-hero [eyebrow]="hero()?.eyebrow || ''" [title]="hero()?.title || ''"
    [sub]="hero()?.sub || ''" [image]="hero()?.imageUrl || ''" [chips]="heroChips()"/>

  <section id="enquiry" class="page-band contact-console py-16 sm:py-24">
  <div class="section-shell contact-layout relative z-10">
    <form appReveal [formGroup]="form" (ngSubmit)="submit()" class="contact-form space-y-5 p-6 sm:p-8">
      <div>
        <p class="eyebrow">Enquiry type</p>
        <div class="mt-3 grid grid-cols-2 gap-1.5 rounded-2xl bg-kteal-50 p-1.5 sm:grid-cols-3">
          @for (t of settings.leadTypes(); track t) {
            <button type="button" (click)="form.patchValue({ type: t })"
              class="min-h-11 rounded-full px-3 py-2 text-sm font-semibold transition"
              [class.bg-gradient-to-br]="form.value.type === t"
              [class.from-kteal-500]="form.value.type === t"
              [class.to-kteal-700]="form.value.type === t"
              [class.text-white]="form.value.type === t"
              [class.shadow-md]="form.value.type === t"
              [class.text-kteal-700]="form.value.type !== t">{{ t }}</button>
          }
        </div>
      </div>
      <input formControlName="name" placeholder="Your name" class="form-control"/>
      <input formControlName="phone" placeholder="Phone" class="form-control"/>
      <input formControlName="email" type="email" placeholder="Email" class="form-control"/>
      <textarea formControlName="message" rows="4" placeholder="How can we help?" class="form-control"></textarea>
      <div class="flex flex-col gap-3 sm:flex-row">
        <button type="submit" [disabled]="form.invalid || sending()" class="btn-primary disabled:opacity-50">
          <svg lucideSend class="mr-2 h-4 w-4"></svg>
          {{ sending() ? 'Sending...' : 'Send message' }}
        </button>
        <button type="button" (click)="sendViaWhatsApp()" [disabled]="form.invalid"
          class="inline-flex min-h-12 items-center justify-center rounded-full bg-[#25D366] px-6 py-3 font-display font-semibold text-white transition hover:bg-[#1da851] disabled:opacity-50">
          <app-whatsapp-icon className="mr-2 h-4 w-4"/>
          Send via WhatsApp
        </button>
      </div>
    </form>

    <div class="contact-side space-y-5">
      <article appReveal [revealDelay]="0.1" class="contact-card p-6 sm:p-8">
        <p class="eyebrow">Head office</p>
        <p class="mt-3 font-display text-2xl font-semibold leading-tight">{{ settings.headOffice() }}</p>
        <a [href]="'tel:' + settings.phone()" class="mt-3 inline-block font-semibold text-kblue-700">{{ settings.phone() }}</a>
        <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a [href]="'tel:' + settings.phone()" class="inline-flex min-h-12 items-center justify-center rounded-full bg-kblue-700 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-kblue-800">
            <svg lucidePhone class="mr-2 h-4 w-4"></svg>Call now
          </a>
          <a [href]="settings.waLink('Hi Kallingal')" target="_blank" rel="noopener"
             class="inline-flex min-h-12 items-center justify-center rounded-full bg-[#25D366] px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#1da851]">
            <app-whatsapp-icon className="mr-2 h-4 w-4"/>WhatsApp
          </a>
          <a [href]="'mailto:' + settings.email()" class="inline-flex min-h-12 items-center justify-center rounded-full bg-kteal-600 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-kteal-700">
            <svg lucideMail class="mr-2 h-4 w-4"></svg>Email us
          </a>
        </div>
      </article>

      <div appReveal [revealDelay]="0.2" class="contact-map p-2">
        <iframe src="https://maps.google.com/maps?q=8.5241,76.9366&z=13&output=embed"
          class="h-80 w-full rounded-xl border-0 sm:h-96" loading="lazy" title="Head office map"></iframe>
      </div>
    </div>
  </div>
  </section>`,
  styles: [`
    .contact-layout {
      display: grid;
      gap: 1.5rem;
      grid-template-columns: minmax(0, 1.04fr) minmax(0, .96fr);
      align-items: start;
    }
    .contact-form,
    .contact-card,
    .contact-map {
      position: relative;
      overflow: hidden;
      border: 1px solid rgba(6,161,84,.24);
      border-radius: 1.35rem;
      background:
        radial-gradient(520px 260px at 0% 0%, rgba(6,161,84,0.16), transparent 62%),
        radial-gradient(420px 220px at 100% 0%, rgba(30,112,173,0.12), transparent 64%),
        linear-gradient(160deg, rgba(20,17,11,0.97), rgba(7,6,4,0.95));
      color: #f1ede3;
      box-shadow: 0 30px 82px rgba(0,0,0,.44), inset 0 1px 0 rgba(255,255,255,0.10);
    }
    .contact-form::before {
      content: "Concierge";
      position: absolute;
      right: 1.1rem;
      top: 1rem;
      font-family: "Sora", sans-serif;
      font-size: .65rem;
      font-weight: 900;
      letter-spacing: .22em;
      text-transform: uppercase;
      color: rgba(30,112,173,.48);
    }
    .contact-side {
      position: sticky;
      top: 6rem;
    }
    .contact-card::after {
      content: "";
      position: absolute;
      right: -2rem;
      top: -2rem;
      height: 10rem;
      width: 10rem;
      border-radius: 999px;
      background: radial-gradient(circle, rgba(30,112,173,.16), transparent 66%);
    }
    .contact-card .text-kblue-700 { color: #63d99b !important; }
    .contact-form .form-control {
      background: rgba(255,255,255,0.06);
      border-color: rgba(6,161,84,0.22);
      color: #f6f2e8;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.06);
    }
    .contact-form .form-control::placeholder { color: rgba(244,241,234,0.46); }
    .contact-form .form-control:focus {
      background: rgba(255,255,255,0.10);
      border-color: #06a154;
      box-shadow: 0 0 0 4px rgba(6,161,84,0.18);
    }
    .contact-form [class*="bg-kteal-50"] {
      background: rgba(255,255,255,0.06) !important;
      border: 1px solid rgba(6,161,84,0.18);
    }
    .contact-form [class*="bg-kteal-50"] button:not([class*="from-kteal"]) { color: #ded7c8 !important; }
    .contact-map iframe {
      display: block;
      filter: saturate(.92) contrast(1.02);
    }
    @media (max-width: 1023px) {
      .contact-layout { grid-template-columns: 1fr; }
      .contact-side { position: static; }
      /* Dark-luxury on mobile so the contact console matches the rest of the
         mobile experience instead of a light cream card. */
      .contact-form,
      .contact-card,
      .contact-map {
        background:
          radial-gradient(420px 200px at 0% 0%, rgba(6,161,84,0.14), transparent 62%),
          linear-gradient(165deg, rgba(31,29,26,0.97), rgba(7,6,4,0.95)) !important;
        border-color: rgba(6,161,84,0.26) !important;
        color: #f1ede3 !important;
        box-shadow: 0 24px 64px rgba(0,0,0,0.46) !important;
      }
      .contact-form::after,
      .contact-card::before {
        content: "";
        position: absolute;
        inset: 0 0 auto 0;
        height: 3px;
        background: linear-gradient(90deg, #1e70ad, #06a154 58%, transparent);
        opacity: .92;
        z-index: 2;
      }
      .contact-form .eyebrow,
      .contact-card .eyebrow { color: #35c985 !important; }
      .contact-card .text-kblue-700 { color: #35c985 !important; }
      /* inputs become dark glass with light text */
      .contact-form .form-control {
        background: rgba(255,255,255,0.06) !important;
        border-color: rgba(6,161,84,0.22) !important;
        color: #f6f2e8 !important;
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.06) !important;
      }
      .contact-form .form-control::placeholder { color: rgba(244,241,234,0.46) !important; }
      .contact-form .form-control:focus {
        background: rgba(255,255,255,0.10) !important;
        border-color: #06a154 !important;
        box-shadow: 0 0 0 4px rgba(6,161,84,0.18) !important;
      }
      /* enquiry-type switch reads on the dark surface */
      .contact-form [class*="bg-kteal-50"] {
        background: rgba(255,255,255,0.06) !important;
        border: 1px solid rgba(6,161,84,0.18);
      }
      .contact-form [class*="bg-kteal-50"] button:not([class*="from-kteal"]) { color: #ded7c8 !important; }
    }
    @media (max-width: 640px) {
      .contact-layout { gap: 1rem; }
      .contact-form,
      .contact-card,
      .contact-map {
        border-radius: 1.1rem;
      }
      .contact-form { padding: 1rem; }
      .contact-form::before { display: none; }
      /* Enquiry type: clean equal columns that always fit — no scroll, no
         cut-off text, perfectly aligned. Wraps if there are more than 3 types. */
      .contact-form [class*="grid-cols-2"] {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(5.8rem, 1fr));
        gap: .35rem;
        padding: .3rem;
      }
      .contact-form [class*="grid-cols-2"] button {
        min-width: 0;
        padding-inline: .35rem;
        font-size: .8rem;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .contact-card { padding: 1rem; }
      .contact-card a { width: 100%; }
      .contact-map { padding: .45rem; }
      .contact-map iframe {
        height: 18rem;
        border-radius: .9rem;
      }
    }
  `]
})
export class ContactComponent {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private toast = inject(ToastService);
  settings = inject(SettingsService);
  hero = signal<PageHero | null>(null);
  sending = signal(false);
  form = this.fb.nonNullable.group({
    type: ['Sales'],
    name: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    message: ['']
  });

  constructor() {
    this.api.pageHero('contact').subscribe({ next: v => this.hero.set(v), error: () => this.hero.set(null) });
  }

  heroChips() {
    return (this.hero()?.chips || '').split(',').map(v => v.trim()).filter(Boolean);
  }

  sendViaWhatsApp() {
    const v = this.form.getRawValue();
    const msg = `New ${v.type} enquiry\nName: ${v.name}\nPhone: ${v.phone}\nEmail: ${v.email}\nMessage: ${v.message || '-'}`;
    window.open(this.settings.waLink(msg), '_blank', 'noopener');
    this.toast.info('Opening WhatsApp with your enquiry...');
    this.api.submitLead(v).subscribe({ next: () => {}, error: () => {} });
  }

  submit() {
    this.sending.set(true);
    this.api.submitLead(this.form.getRawValue()).subscribe({
      next: () => {
        this.toast.success('Message sent. Our team will reach out shortly.');
        this.sending.set(false);
        this.form.reset({ type: 'Sales' });
      },
      error: () => {
        this.toast.error('Could not send right now. Please call or WhatsApp us instead.');
        this.sending.set(false);
      }
    });
  }
}
