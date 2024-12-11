import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot, Router } from '@angular/router';
import { firstValueFrom, of } from "rxjs";
import { AuthService } from "../auth.service";

export const canActivatePath: CanActivateFn = async  (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const loggedIn = await firstValueFrom(authService.authState$);
  
  if (!loggedIn) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};