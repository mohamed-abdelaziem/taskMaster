import { Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Auth } from './core/services/auth';
import { isPlatformBrowser } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  private authService = inject(Auth);
  private cookie = inject(CookieService);


  constructor(){
    if(this.cookie.get('userData') || this.authService.isLogged()){
      this.router.navigateByUrl('/dashboard');
    }else{
      this.router.navigateByUrl('/home');
    }
  }

  protected readonly title = signal('taskMaster');
}
