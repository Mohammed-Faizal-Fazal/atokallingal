import { Component, Input, Output, EventEmitter, signal, HostListener } from '@angular/core';
import { LucideChevronLeft, LucideChevronRight, LucideX } from '@lucide/angular';
import { GalleryImage } from './api.service';

@Component({
  selector: 'app-lightbox',
  standalone: true,
  imports: [LucideChevronLeft, LucideChevronRight, LucideX],
  template: `
  @if (index() !== null) {
    <div class="fixed inset-0 z-[95] flex items-center justify-center bg-kblue-900/96"
         (click)="close()" role="dialog" aria-modal="true" aria-label="Image viewer">
      <button class="absolute right-6 top-6 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 transition hover:bg-white/25"
              (click)="close()" aria-label="Close">
        <svg lucideX class="h-5 w-5"></svg>
      </button>
      <button class="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 transition hover:bg-white/25"
              (click)="prev(); $event.stopPropagation()" aria-label="Previous">
        <svg lucideChevronLeft class="h-6 w-6"></svg>
      </button>
      <button class="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 transition hover:bg-white/25"
              (click)="next(); $event.stopPropagation()" aria-label="Next">
        <svg lucideChevronRight class="h-6 w-6"></svg>
      </button>

      <figure class="max-h-[88vh] max-w-[92vw]" (click)="$event.stopPropagation()">
        <img [src]="current()?.url" [alt]="current()?.caption || 'Gallery image'"
             class="max-h-[80vh] max-w-full cursor-zoom-in select-none rounded-xl object-contain shadow-2xl transition-transform duration-300"
             [class.scale-[1.8]]="zoomed()" [class.cursor-zoom-out]="zoomed()"
             (click)="zoomed.set(!zoomed())" draggable="false"/>
        @if (current()?.caption) {
          <figcaption class="mt-4 text-center font-display text-sm text-kteal-100">
            {{ current()?.caption }} - {{ (index() ?? 0) + 1 }} / {{ images.length }}
          </figcaption>
        }
      </figure>
    </div>
  }`
})
export class LightboxComponent {
  @Input() images: GalleryImage[] = [];
  @Output() closed = new EventEmitter<void>();
  index = signal<number | null>(null);
  zoomed = signal(false);

  current() { const i = this.index(); return i === null ? null : this.images[i]; }
  open(i: number) { this.index.set(i); this.zoomed.set(false); document.body.style.overflow = 'hidden'; }
  close() { this.index.set(null); document.body.style.overflow = ''; this.closed.emit(); }
  next() { this.zoomed.set(false); this.index.update(i => i === null ? null : (i + 1) % this.images.length); }
  prev() { this.zoomed.set(false); this.index.update(i => i === null ? null : (i - 1 + this.images.length) % this.images.length); }

  @HostListener('window:keydown', ['$event'])
  onKey(e: KeyboardEvent) {
    if (this.index() === null) return;
    if (e.key === 'Escape') this.close();
    if (e.key === 'ArrowRight') this.next();
    if (e.key === 'ArrowLeft') this.prev();
  }
}
