import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import gsap from 'gsap';
import { BrandLogoComponent } from '../shared/brand-logo.component';

@Component({
  selector: 'app-preloader',
  standalone: true,
  imports: [BrandLogoComponent],
  template: `
    <div #overlay class="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-kblue-900 px-6">
      <div class="pointer-events-none absolute inset-0 opacity-80"
           style="background:radial-gradient(620px 420px at 20% 10%, rgba(6,161,84,0.15), transparent 60%),radial-gradient(560px 460px at 90% 90%, rgba(30,112,173,0.10), transparent 60%),linear-gradient(135deg, rgba(7,6,4,1), rgba(31,29,26,.94));"></div>
      <div class="relative text-center">
        <div #logo class="flex justify-center">
          <app-brand-logo [size]="76" [dark]="true"/>
        </div>
        <div #tagline class="mt-5 opacity-0">
          <p class="brand-tagline text-2xl italic leading-none text-kgreen-300 sm:text-[1.75rem]">Redefining Excellence</p>
          <p class="mt-3 font-body text-[0.6rem] font-bold uppercase tracking-[0.34em] text-kteal-100/75">Bajaj · Chetak · Tata · Trivandrum</p>
        </div>

        <div class="relative mx-auto mt-9 w-64 max-w-[76vw]">
          <div class="loader-rail h-[3px] w-full overflow-hidden rounded-full bg-white/15">
            <div #bar class="h-full w-0 rounded-full bg-gradient-to-r from-kgreen-300 via-[#1e70ad] to-kteal-200"></div>
          </div>
          <span #beam class="brand-loader-beam absolute left-0 top-1/2" aria-hidden="true"></span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Brand tagline, echoing the logo's blue italic serif "Redefining Excellence"
       using the site's editorial serif (Linux Libertine), with a soft blue glow. */
    .brand-tagline {
      font-family: var(--font-editorial), Georgia, serif;
      letter-spacing: 0.012em;
      text-shadow: 0 2px 20px rgba(30,112,173,0.45);
    }
    .loader-rail {
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.18),
        0 18px 42px rgba(0,0,0,0.28);
    }
    .brand-loader-beam {
      width: 2.25rem;
      height: 2.25rem;
      margin-left: -1.125rem;
      transform: translateY(-50%);
      border-radius: 999px;
      background:
        radial-gradient(circle, rgba(30,112,173,0.22), transparent 62%),
        linear-gradient(135deg, rgba(6,161,84,0.22), rgba(255,255,255,0.04));
      box-shadow: 0 0 26px rgba(6,161,84,0.35);
    }
    .brand-loader-beam::before {
      content: "";
      position: absolute;
      left: 50%;
      top: 50%;
      width: .62rem;
      height: .62rem;
      transform: translate(-50%, -50%) rotate(45deg);
      border: 1px solid rgba(30,112,173,0.9);
      background: rgba(6,161,84,0.72);
      box-shadow: 0 0 18px rgba(30,112,173,0.42);
    }
    .brand-loader-beam::after {
      content: "";
      position: absolute;
      left: 50%;
      top: 50%;
      width: 1px;
      height: 2.9rem;
      transform: translate(-50%, -50%);
      background: linear-gradient(180deg, transparent, rgba(30,112,173,0.7), transparent);
    }
  `]
})
export class PreloaderComponent implements AfterViewInit {
  @ViewChild('overlay') overlay!: ElementRef<HTMLDivElement>;
  @ViewChild('logo') logo!: ElementRef<HTMLDivElement>;
  @ViewChild('tagline') tagline!: ElementRef<HTMLDivElement>;
  @ViewChild('bar') bar!: ElementRef<HTMLDivElement>;
  @ViewChild('beam') beam!: ElementRef<HTMLSpanElement>;

  ngAfterViewInit(): void {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { this.overlay.nativeElement.remove(); return; }

    document.body.style.overflow = 'hidden';

    const beamEl = this.beam.nativeElement;
    const distance = () => Math.max(0, beamEl.parentElement?.clientWidth ?? 256);
    gsap.set(beamEl, { opacity: 0, scale: 0.86, x: 0, yPercent: -50 });

    const tl = gsap.timeline({
      onComplete: () => {
        this.overlay.nativeElement.remove();
        document.body.style.overflow = '';
        window.dispatchEvent(new CustomEvent('preloader:done'));
      }
    });

    tl.from(this.logo.nativeElement, { opacity: 0, y: 14, scale: 0.97, duration: 0.45, ease: 'power3.out' })
      .to(this.tagline.nativeElement, { opacity: 1, y: 0, duration: 0.28, ease: 'power2.out' }, '-=0.08')
      .addLabel('load')
      .to(beamEl, { opacity: 1, scale: 1, duration: 0.16, ease: 'power2.out' }, 'load')
      .to(this.bar.nativeElement, { width: '100%', duration: 0.82, ease: 'power2.inOut' }, 'load')
      .to(beamEl, { x: distance, duration: 0.82, ease: 'power2.inOut' }, 'load')
      .to(beamEl, { opacity: 0, scale: 1.08, duration: 0.18, ease: 'power2.out' }, '-=0.08')
      .to(this.overlay.nativeElement, { yPercent: -100, duration: 0.48, ease: 'power3.inOut' }, '+=0.02');
  }
}
