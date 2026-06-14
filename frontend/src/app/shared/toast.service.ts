import { Injectable, signal } from '@angular/core';

export interface Toast { id: number; kind: 'success' | 'error' | 'info'; text: string; }

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = signal<Toast[]>([]);
  private seq = 0;
  show(kind: Toast['kind'], text: string, ms = 4000) {
    const t: Toast = { id: ++this.seq, kind, text };
    this.toasts.update(l => [...l, t]);
    setTimeout(() => this.dismiss(t.id), ms);
  }
  success(text: string) { this.show('success', text); }
  error(text: string) { this.show('error', text); }
  info(text: string) { this.show('info', text); }
  dismiss(id: number) { this.toasts.update(l => l.filter(t => t.id !== id)); }
}
