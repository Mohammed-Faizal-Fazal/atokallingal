import { Component, AfterViewInit, ElementRef, ViewChild, signal, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass } from '@angular/common';
import { LucideBike, LucideBriefcaseBusiness, LucideHome, LucideImages, LucideMapPin, LucideWrench } from '@lucide/angular';
import gsap from 'gsap';
import { BrandLogoComponent } from '../shared/brand-logo.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass, BrandLogoComponent, LucideBike, LucideBriefcaseBusiness, LucideHome, LucideImages, LucideMapPin, LucideWrench],
  template: `
  <header #header class="fixed top-0 z-50 w-full -translate-y-4 opacity-0">
    <nav class="nav-shell relative mx-3 mt-3 flex max-w-7xl items-center justify-between overflow-hidden rounded-2xl border border-kgreen-300/20 px-3 py-2 text-kblue-50 transition-all duration-300 sm:mx-auto sm:rounded-full sm:px-4"
         [ngClass]="scrolled()
           ? 'bg-[linear-gradient(110deg,rgba(7,6,4,0.94),rgba(31,29,26,0.90)_48%,rgba(7,6,4,0.94))] shadow-[0_26px_70px_rgba(0,0,0,0.34)]'
           : 'bg-[linear-gradient(110deg,rgba(7,6,4,0.78),rgba(31,29,26,0.72)_48%,rgba(7,6,4,0.78))] shadow-[0_20px_55px_rgba(0,0,0,0.22)]'">
      <a routerLink="/" class="group flex min-w-0 items-center" aria-label="Kallingal home">
        <app-brand-logo [size]="38" [dark]="true" class="transition-transform duration-300 group-hover:scale-[1.02]"/>
      </a>
      <ul class="hidden items-center gap-0.5 font-body text-sm font-semibold lg:flex">
        @for (l of links; track l.path) {
          <li><a [routerLink]="l.path" routerLinkActive="nav-active"
                 [routerLinkActiveOptions]="{exact: l.path === '/'}"
                 class="nav-link relative inline-flex items-center gap-2 rounded-full px-3 py-2 text-kblue-50/78 transition hover:bg-kgreen-500/12 hover:text-kgreen-100">
            @switch (l.icon) {
              @case ('home') { <svg lucideHome class="h-4 w-4"></svg> }
              @case ('products') { <svg lucideBike class="h-4 w-4"></svg> }
              @case ('services') { <svg lucideWrench class="h-4 w-4"></svg> }
              @case ('gallery') { <svg lucideImages class="h-4 w-4"></svg> }
              @case ('showrooms') { <svg lucideMapPin class="h-4 w-4"></svg> }
              @case ('careers') { <svg lucideBriefcaseBusiness class="h-4 w-4"></svg> }
            }
            {{ l.label }}
          </a></li>
        }
      </ul>
      <a routerLink="/contact" fragment="enquiry" class="nav-cta relative hidden overflow-hidden rounded-full px-5 py-2.5 font-display text-sm font-bold text-kblue-900 shadow-[0_14px_30px_rgba(7,17,31,0.22)] transition hover:-translate-y-0.5 md:inline-flex">Book a test drive</a>
      <button class="nav-burger flex h-11 w-11 items-center justify-center rounded-full border border-kgreen-300/25 bg-kblue-900/90 text-kblue-50 shadow-[0_12px_30px_rgba(0,0,0,0.24)] transition active:scale-95 lg:hidden"
              (click)="open.set(!open())" aria-label="Menu" [attr.aria-expanded]="open()">
        <span class="sr-only">Menu</span>
        <span aria-hidden="true">
          <span class="block h-0.5 w-5 rounded bg-kblue-50 transition" [style.transform]="open() ? 'translateY(8px) rotate(45deg)' : null"></span>
          <span class="mt-1.5 block h-0.5 w-5 rounded bg-kblue-50 transition" [class.opacity-0]="open()"></span>
          <span class="mt-1.5 block h-0.5 w-5 rounded bg-kblue-50 transition" [style.transform]="open() ? 'translateY(-8px) rotate(-45deg)' : null"></span>
        </span>
      </button>
    </nav>
    @if (open()) {
      <div class="mobile-menu mx-3 mt-2 rounded-3xl border border-kgreen-300/20 bg-[linear-gradient(160deg,rgba(7,6,4,0.98),rgba(31,29,26,0.96))] p-3 shadow-[0_30px_80px_rgba(0,0,0,0.34)] lg:hidden">
        @for (l of links; track l.path) {
          <a [routerLink]="l.path" (click)="open.set(false)"
             routerLinkActive="bg-kgreen-500/14 text-kgreen-100"
             [routerLinkActiveOptions]="{exact: l.path === '/'}"
             class="mobile-link flex items-center gap-3 rounded-2xl px-4 py-3 font-display font-semibold text-kblue-50 transition hover:bg-kgreen-500/12">
            @switch (l.icon) {
              @case ('home') { <svg lucideHome class="h-4 w-4"></svg> }
              @case ('products') { <svg lucideBike class="h-4 w-4"></svg> }
              @case ('services') { <svg lucideWrench class="h-4 w-4"></svg> }
              @case ('gallery') { <svg lucideImages class="h-4 w-4"></svg> }
              @case ('showrooms') { <svg lucideMapPin class="h-4 w-4"></svg> }
              @case ('careers') { <svg lucideBriefcaseBusiness class="h-4 w-4"></svg> }
            }
            {{ l.label }}
          </a>
        }
        <a routerLink="/contact" fragment="enquiry" (click)="open.set(false)" class="btn-primary mt-2 w-full">Book a test drive</a>
      </div>
    }
  </header>`,
  styles: [`
    @keyframes menuIn { from { opacity: 0; transform: translateY(-8px) scale(0.98); } to { opacity: 1; transform: none; } }
    .mobile-menu { animation: menuIn 0.22s ease-out; transform-origin: top center; }
    /* Living gradient hairline that travels around the navbar pill */
    .nav-shell::before {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: inherit;
      padding: 1.3px;
      background: linear-gradient(120deg, rgba(6,161,84,.54), rgba(30,112,173,.24) 38%, rgba(30,112,173,.34) 70%, rgba(6,161,84,.48));
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
              mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
              mask-composite: exclude;
      pointer-events: none;
      opacity: .85;
    }
    .nav-link svg,
    .mobile-link svg {
      border-radius: 999px;
      padding: .18rem;
      background: rgba(6,161,84,.12);
      box-shadow: inset 0 0 0 1px rgba(6,161,84,.18);
    }
    .nav-active {
      background: var(--cta-sheen), var(--cta-gradient);
      color: #05161c;
      box-shadow: inset 0 0 0 1px rgba(255,255,255,0.22), 0 10px 28px rgba(7,6,4,.20);
    }
    .nav-active::after {
      content: "";
      position: absolute;
      left: 50%;
      bottom: 3px;
      height: 3px;
      width: 16px;
      transform: translateX(-50%);
      border-radius: 999px;
      background: linear-gradient(90deg, #06a154, #1e70ad, #1e70ad);
    }
    .nav-cta {
      background: var(--cta-sheen), var(--cta-gradient);
    }
    .nav-cta::after {
      content: "";
      position: absolute;
      inset: 1px;
      border-radius: inherit;
      border: 1px solid rgba(255,255,255,.22);
      pointer-events: none;
    }
    .nav-cta::before {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(115deg, transparent 32%, rgba(255,255,255,.55) 48%, transparent 64%);
      transform: translateX(-160%) skewX(-15deg);
      transition: transform .75s ease;
      pointer-events: none;
    }
    .nav-cta:hover::before { transform: translateX(160%) skewX(-15deg); }
  `]
})
export class NavbarComponent implements AfterViewInit {
  @ViewChild('header') header!: ElementRef;
  open = signal(false);
  scrolled = signal(false);
  links = [
    { path: '/', label: 'Home', icon: 'home' },
    { path: '/products', label: 'Products', icon: 'products' },
    { path: '/services', label: 'Services', icon: 'services' },
    { path: '/gallery', label: 'Gallery', icon: 'gallery' },
    { path: '/showrooms', label: 'Showrooms', icon: 'showrooms' },
    { path: '/careers', label: 'Careers', icon: 'careers' }
  ];

  @HostListener('window:scroll')
  onScroll() { this.scrolled.set(window.scrollY > 12); }

  ngAfterViewInit() {
    const show = () => gsap.to(this.header.nativeElement, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { show(); return; }
    window.addEventListener('preloader:done', show, { once: true });
    setTimeout(show, 4500); // fallback
  }
}
