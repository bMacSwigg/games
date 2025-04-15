import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Auth } from '@angular/fire/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const firebaseAuth = inject(Auth);
  const router = inject(Router);

  return firebaseAuth.authStateReady().then(() => {
    if (auth.authenticated()) {
      return true;
    } else {
      return router.navigate(['']).then(() => false);
    }
  });
};
