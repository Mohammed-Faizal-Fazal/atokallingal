import { Directive, ElementRef, HostListener, AfterViewInit } from '@angular/core';
import gsap from 'gsap';

@Directive({ selector: '[appTilt3d]', standalone: true })
export class Tilt3dDirective implements AfterViewInit {
  private reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewInit() {
    const e = this.el.nativeElement;
    e.style.transformStyle = 'preserve-3d';
    e.style.willChange = 'transform';
    if (e.parentElement) e.parentElement.style.perspective = '1000px';
  }

  @HostListener('mousemove', ['$event'])
  onMove(ev: MouseEvent) {
    if (this.reduced) return;
    const e = this.el.nativeElement, r = e.getBoundingClientRect();
    // Subtle tilt (±5°) — enough to feel responsive and dimensional without the
    // gimmicky "toy" wobble a steep tilt gives.
    const rx = ((ev.clientY - r.top) / r.height - 0.5) * -5;
    const ry = ((ev.clientX - r.left) / r.width - 0.5) * 5;
    gsap.to(e, { rotateX: rx, rotateY: ry, scale: 1.012, duration: 0.5, ease: 'power2.out' });
  }

  @HostListener('mouseleave')
  onLeave() {
    if (this.reduced) return;
    gsap.to(this.el.nativeElement, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.5, ease: 'power3.out' });
  }
}
