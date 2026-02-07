import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import {AuthService} from '@/core/services/http/auth.service';
import {PUBLIC_ROUTES} from '@/core/configs/public-route/public-route.constant';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isPublicEndpoint = PUBLIC_ROUTES.some(endpoint =>
      request.url.includes(endpoint)
    );

    if (isPublicEndpoint) {
      return next.handle(request).pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
    }

    const token = this.authService.getToken();

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 401) {
      this.authService.logout();
      this.router.navigate(['/login']);
    } else if (error.status === 403) {
      console.error('Accès refusé');
      this.router.navigate(['/forbidden']);
    }

    return throwError(() => error);
  }
}
