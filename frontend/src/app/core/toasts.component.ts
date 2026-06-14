import { Component, inject } from '@angular/core';
import { ToastService } from '../shared/toast.service';

@Component({
  selector: 'app-toasts',
  standalone: true,
  template: `
  <div class="pointer-events-none fixed inset-x-0 top-24 z-[90] flex flex-col items-center gap-3 px-4" role="status" aria-live="polite">
    @for (t of toast.toasts(); track t.id) {
      <div class="toast-in pointer-events-auto flex max-w-md items-center gap-3 rounded-lg px-5 py-4 font-display text-sm font-semibold text-white shadow-2xl"
           [class.bg-kgreen-600]="t.kind === 'success'"
           [class.bg-red-600]="t.kind === 'error'"
           [class.bg-kblue-700]="t.kind === 'info'">
        <span aria-hidden="true">
          @if (t.kind === 'success') { ✓ } @else if (t.kind === 'error') { ✕ } @else { ℹ }
        </span>
        <span>{{ t.text }}</span>
        <button (click)="toast.dismiss(t.id)" class="ml-2 opacity-70 hover:opacity-100" aria-label="Dismiss">✕</button>
      </div>
    }
  </div>`,
  styles: [`
    .toast-in { animation: toastIn .35s cubic-bezier(.16,1,.3,1); }
    @keyframes toastIn { from { opacity: 0; transform: translateY(-16px) scale(.96); } to { opacity: 1; transform: none; } }
    @media (prefers-reduced-motion: reduce) { .toast-in { animation: none; } }
  `]
})
export class ToastsComponent { toast = inject(ToastService); }
