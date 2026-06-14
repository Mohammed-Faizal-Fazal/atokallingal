import { Injectable, inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private meta = inject(Meta);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  init() {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(() => { let r = this.route; while (r.firstChild) r = r.firstChild; return r.snapshot.data; })
    ).subscribe(data => {
      if (data['description']) {
        this.meta.updateTag({ name: 'description', content: data['description'] });
        this.meta.updateTag({ property: 'og:description', content: data['description'] });
      }
    });
  }
}
