import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '@/core/services/http/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/auth/login'], {
      queryParams: { returnUrl: state.url }
    });
  }

  const requiredRoles = route.data?.['roles'] as string[] | undefined;

  if (requiredRoles && requiredRoles.length > 0) {
    if (!authService.hasAnyRole(requiredRoles)) {
      return router.createUrlTree(['/auth/login']);
    }
  }

  return true;
};
