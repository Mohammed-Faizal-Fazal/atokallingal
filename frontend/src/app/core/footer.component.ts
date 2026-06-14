import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideArrowRight, LucideMail, LucidePhone } from '@lucide/angular';
import { SettingsService } from '../shared/settings.service';
import { WhatsappIconComponent } from '../shared/whatsapp-icon.component';
import { BrandLogoComponent } from '../shared/brand-logo.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, WhatsappIconComponent, BrandLogoComponent, LucideArrowRight, LucidePhone, LucideMail],
  template: `
  <footer class="mt-24 overflow-hidden bg-transparent text-kteal-50" style="text-shadow: 0 1px 14px rgba(0,0,0,0.6);">
    <div class="relative">

      <div class="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.3fr_0.7fr_1fr] md:py-16">
        <div>
          <app-brand-logo [size]="52" [dark]="true"/>
          <p class="mt-5 max-w-sm text-sm leading-7 text-kteal-100/80">
            Bajaj two and three wheelers, Chetak EV, Tata authorized service and insurance under one trusted name across Trivandrum.
          </p>
          <a routerLink="/contact" fragment="enquiry" class="btn-primary mt-6">
            Talk to our team <svg lucideArrowRight class="ml-2 h-4 w-4"></svg>
          </a>
        </div>

        <div class="text-sm">
          <p class="eyebrow mb-3 !text-kteal-300">Explore</p>
          <a routerLink="/products" class="block py-2 hover:text-kteal-300">Products</a>
          <a routerLink="/services" class="block py-2 hover:text-kteal-300">Services</a>
          <a routerLink="/showrooms" class="block py-2 hover:text-kteal-300">Showrooms</a>
          <a routerLink="/careers" class="block py-2 hover:text-kteal-300">Careers</a>
        </div>

        <div class="text-sm">
          <p class="eyebrow mb-3 !text-kteal-300">Head office</p>
          <p class="leading-7 text-kteal-100/80">{{ settings.headOffice() }}</p>
          <a [href]="'tel:' + settings.phone()" class="mt-4 flex items-center gap-2 py-1 hover:text-kteal-300">
            <svg lucidePhone class="h-4 w-4"></svg>{{ settings.phone() }}
          </a>
          <a [href]="settings.waLink()" target="_blank" rel="noopener" class="flex items-center gap-2 py-1 hover:text-kteal-300">
            <app-whatsapp-icon className="h-4 w-4"/>WhatsApp us
          </a>
          <a [href]="'mailto:' + settings.email()" class="flex items-center gap-2 py-1 hover:text-kteal-300">
            <svg lucideMail class="h-4 w-4"></svg>{{ settings.email() }}
          </a>
          <a routerLink="/contact" fragment="enquiry" class="block py-1 hover:text-kteal-300">Contact us</a>
        </div>
      </div>
    </div>

    <p class="border-t border-white/10 py-5 text-center text-xs font-semibold uppercase tracking-[0.22em] text-kteal-100/60">Copyright {{ year }} Kallingal Group</p>
  </footer>`,
  styles: [`
    footer {
      margin-top: clamp(2.5rem, 5vw, 4rem);
    }
    @media (max-width: 640px) {
      footer {
        margin-top: 2.4rem;
        padding-bottom: 5.25rem;
      }
      footer .btn-primary {
        width: 100%;
      }
      footer a {
        min-height: 2.7rem;
      }
      footer p:last-child {
        padding-inline: 1rem;
        letter-spacing: .14em;
        line-height: 1.7;
      }
    }
  `]
})
export class FooterComponent {
  settings = inject(SettingsService);
  year = new Date().getFullYear();
}
