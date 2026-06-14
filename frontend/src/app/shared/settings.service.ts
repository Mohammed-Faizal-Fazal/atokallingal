import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private http = inject(HttpClient);
  whatsapp = signal('');
  phone = signal('');
  email = signal('');
  headOffice = signal('');
  leadTypes = signal<string[]>([]);
  happyRiders = signal('');
  yearsTrust = signal('');

  load() {
    this.http.get<Record<string, string>>('/api/settings').subscribe({
      next: s => {
        if (s['whatsapp_number']) this.whatsapp.set(s['whatsapp_number']);
        if (s['phone_number']) this.phone.set(s['phone_number']);
        if (s['contact_email']) this.email.set(s['contact_email']);
        if (s['head_office']) this.headOffice.set(s['head_office']);
        if (s['lead_types']) this.leadTypes.set(s['lead_types'].split(',').map(v => v.trim()).filter(Boolean));
        if (s['stat_happy_riders']) this.happyRiders.set(s['stat_happy_riders']);
        if (s['stat_years_trust']) this.yearsTrust.set(s['stat_years_trust']);
      },
      error: () => {}
    });
  }
  waLink(text = '') {
    return `https://wa.me/${this.whatsapp()}${text ? '?text=' + encodeURIComponent(text) : ''}`;
  }
}
