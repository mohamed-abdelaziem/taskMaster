import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Auth } from '../services/auth';
import { isPlatformBrowser } from '@angular/common';

export const authenticationGuard: CanActivateFn = (route, state) => {
  const cookie = inject(CookieService);
  const router = inject(Router);
  const authService = inject(Auth);
  const platformId = inject(PLATFORM_ID);


  if(!isPlatformBrowser(platformId)){
    return true;
  }


  if(cookie.get('userData').length !== 0 || authService.isLogged()){
    return true;
  }else{
    return router.createUrlTree(['/home']);
  }




};
