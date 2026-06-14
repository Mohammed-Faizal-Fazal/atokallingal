import { Component, inject } from '@angular/core';
import { LucideMail, LucidePhone } from '@lucide/angular';
import { SettingsService } from '../shared/settings.service';
import { WhatsappIconComponent } from '../shared/whatsapp-icon.component';

@Component({
  selector: 'app-whatsapp-fab',
  standalone: true,
  imports: [LucidePhone, LucideMail, WhatsappIconComponent],
  template: `
  <div class="contact-dock fixed inset-x-0 bottom-[calc(.75rem_+_env(safe-area-inset-bottom))] z-50 mx-auto flex w-fit items-center gap-2 rounded-full border border-[#06a154]/35 bg-[#05161c]/95 p-2 shadow-[0_20px_56px_rgba(0,0,0,0.42)] sm:bottom-6 lg:hidden">
    <a [href]="'tel:' + settings.phone()" aria-label="Call Kallingal" class="dock-action bg-[#63d99b] text-[#05161c]">
      <svg lucidePhone class="h-5 w-5"></svg><span class="hidden text-sm font-bold md:inline">Call</span>
    </a>
    <a [href]="'mailto:' + settings.email()" aria-label="Email Kallingal" class="dock-action bg-[#11313a] text-[#f4f1ea] ring-1 ring-[#06a154]/30">
      <svg lucideMail class="h-5 w-5"></svg><span class="hidden text-sm font-bold md:inline">Email</span>
    </a>
    <a [href]="settings.waLink('Hi Kallingal, I would like to know more about your vehicles')"
       target="_blank" rel="noopener" aria-label="Chat on WhatsApp" class="dock-action bg-[#25D366] text-white">
      <app-whatsapp-icon className="h-5 w-5"/><span class="hidden text-sm font-bold md:inline">WhatsApp</span>
    </a>
  </div>

  <!-- Desktop: a persistent WhatsApp button, always visible bottom-right. It sits
       as a green circle and expands on hover to reveal the label, lift and glow.
       (Phones use the bottom dock above; this fills the gap on lg+ screens.) -->
  <a [href]="settings.waLink('Hi Kallingal, I would like to know more about your vehicles')"
     target="_blank" rel="noopener" aria-label="Chat on WhatsApp"
     class="wa-fab fixed bottom-7 right-7 z-50 hidden items-center justify-center lg:inline-flex">
    <span class="wa-fab-label">Chat on WhatsApp</span>
    <span class="wa-fab-icon"><app-whatsapp-icon className="h-6 w-6"/></span>
  </a>`,
  styles: [`
    /* Persistent desktop WhatsApp FAB — circle that expands to a labelled pill on hover */
    .wa-fab {
      height: 3.85rem;
      min-width: 3.85rem;
      padding: 0 1.05rem;
      border-radius: 999px;
      color: #fff;
      background: linear-gradient(135deg, #25D366 0%, #1ebe57 46%, #128C7E 100%);
      box-shadow: 0 18px 44px rgba(18,140,126,.42), inset 0 1px 0 rgba(255,255,255,.32);
      transition: transform .32s cubic-bezier(.22,1,.36,1), box-shadow .32s ease;
    }
    .wa-fab-icon { display: inline-flex; align-items: center; justify-content: center; flex: none; }
    .wa-fab-label {
      max-width: 0;
      overflow: hidden;
      white-space: nowrap;
      opacity: 0;
      font-weight: 700;
      font-size: .95rem;
      transition: max-width .4s cubic-bezier(.22,1,.36,1), opacity .26s ease, margin-right .32s cubic-bezier(.22,1,.36,1);
    }
    .wa-fab:hover, .wa-fab:focus-visible {
      transform: translateY(-3px) scale(1.04);
      box-shadow: 0 26px 62px rgba(18,140,126,.52), inset 0 1px 0 rgba(255,255,255,.32);
    }
    .wa-fab:hover .wa-fab-label, .wa-fab:focus-visible .wa-fab-label {
      max-width: 12rem;
      opacity: 1;
      margin-right: .6rem;
    }
    .wa-fab:active { transform: translateY(-1px) scale(.99); }
    /* gentle attention pulse — idle only; it calms while you hover */
    .wa-fab::after {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: inherit;
      pointer-events: none;
      box-shadow: 0 0 0 0 rgba(37,211,102,.45);
      animation: waPulse 2.8s ease-out infinite;
    }
    .wa-fab:hover::after { animation: none; }
    @keyframes waPulse {
      0% { box-shadow: 0 0 0 0 rgba(37,211,102,.42); }
      70% { box-shadow: 0 0 0 16px rgba(37,211,102,0); }
      100% { box-shadow: 0 0 0 0 rgba(37,211,102,0); }
    }
    @media (prefers-reduced-motion: reduce) {
      .wa-fab, .wa-fab-label { transition: none; }
      .wa-fab::after { animation: none; }
    }
    .dock-action { display: inline-flex; min-height: 3rem; min-width: 3rem; align-items: center; justify-content: center; gap: .5rem; border-radius: 999px; padding: .8rem; transition: transform .2s, box-shadow .2s, filter .2s; box-shadow: inset 0 1px 0 rgba(255,255,255,.28); }
    .dock-action:hover { transform: translateY(-2px); filter: saturate(1.08); box-shadow: 0 14px 30px rgba(7,17,31,.16), inset 0 1px 0 rgba(255,255,255,.28); }
    .contact-dock { isolation: isolate; }
    .contact-dock::before { content: ""; position: absolute; inset: .28rem; z-index: -1; border-radius: 999px; background: linear-gradient(90deg, rgba(6,161,84,.12), rgba(30,112,173,.08)); }
    @media (max-width: 420px) {
      .contact-dock { width: calc(100vw - 1.25rem); justify-content: space-between; }
      .dock-action { flex: 1 1 0; }
    }
    @media (min-width: 768px) { .dock-action { padding-left: 1rem; padding-right: 1rem; } }
  `]
})
export class WhatsappFabComponent {
  settings = inject(SettingsService);
}
