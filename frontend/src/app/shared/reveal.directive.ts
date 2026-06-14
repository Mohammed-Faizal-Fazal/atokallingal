import { Directive, ElementRef, Input, AfterViewInit, OnDestroy } from '@angular/core';

/**
 * Per-block reveal used across inner pages and shared components. It opts the
 * element into the SAME smooth "distance → near" depth used for whole sections
 * (the `.travel` / `.travel.inview` rules in styles.css): a small rise plus a
 * felt scale, transform + opacity only — no clip-path or 3D, so it composites
 * cleanly and stays smooth on mobile. Fires early (as the block enters from the
 * bottom) so you never scroll onto a blank block and wait. `revealDelay`
 * staggers sibling blocks via transition-delay.
 */
@Directive({ selector: '[appReveal]', standalone: true })
export class RevealDirective implements AfterViewInit, OnDestroy {
  @Input() revealDelay = 0;
  private io?: IntersectionObserver;
  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewInit() {
    const el = this.el.nativeElement;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    el.classList.add('travel');
    if (this.revealDelay) el.style.transitionDelay = `${this.revealDelay}s`;

    if (typeof IntersectionObserver === 'undefined') { el.classList.add('inview'); return; }
    this.io = new IntersectionObserver(([e], obs) => {
      if (e.isIntersecting) { el.classList.add('inview'); obs.disconnect(); }
    }, { rootMargin: '0px 0px 8% 0px', threshold: 0 });
    this.io.observe(el);

    // Safety net: never leave a block hidden if the observer never fires
    // (e.g. always-in-view on a short page).
    setTimeout(() => el.classList.add('inview'), 2600);
  }

  ngOnDestroy() { this.io?.disconnect(); }
}
