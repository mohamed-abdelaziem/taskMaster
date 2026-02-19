import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { CookieService } from 'ngx-cookie-service';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-navbar-with-logged',
  imports: [RouterLink],
  templateUrl: './navbar-with-logged.html',
  styleUrl: './navbar-with-logged.css',
})
export class NavbarWithLogged {
private cookie = inject(CookieService);
private authService = inject(Auth);
private router = inject(Router);
@ViewChild('linksContainer')
linksContainer !: ElementRef;


toggleNav(){
console.log(this.linksContainer.nativeElement);
(this.linksContainer.nativeElement as HTMLElement).classList.toggle('left-[-1000%]')
}



logOut(){
this.cookie.delete('userData');
this.authService.isLogged.set(false);
this.authService.userData.set(null);
this.authService.userId.set(0);
this.router.navigateByUrl('/home');
}

}
