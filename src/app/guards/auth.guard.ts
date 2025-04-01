import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';


export const authGuard: CanActivateFn = (route, state) => {
  const pocketbase = inject(AuthService);
  const router = inject(Router);
  if (pocketbase.pb.authStore.record?.id) return true;
  router.navigate(['/auth']);
  pocketbase.signOut();
  return false;
};
