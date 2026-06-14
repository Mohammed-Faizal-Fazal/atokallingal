import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AdminApiService } from './admin-api.service';
import { ToastService } from './toast.service';

/**
 * When an already-authenticated admin call returns 401 (the server password was
 * rotated, the session token went stale, or sessionStorage was tampered), tear
 * the session down so the UI falls back to the login screen instead of stranding
 * the admin on a silently-failing, empty dashboard.
 *
 * The `loggedIn()` guard is deliberate: during a fresh sign-in attempt the token
 * is stored but loggedIn() is still false, so a wrong-password 401 is left for
 * the login form's own error handler ("Invalid credentials") and does NOT toast
 * "session expired".
 */
export const adminAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const admin = inject(AdminApiService);
  const toast = inject(ToastService);
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && req.url.includes('/api/admin') && admin.loggedIn()) {
        admin.logout();
        toast.error('Session expired. Please sign in again.');
      }
      return throwError(() => err);
    })
  );
};
