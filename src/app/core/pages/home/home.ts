import { Component, inject, PLATFORM_ID} from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { Auth } from '../../services/auth';
import { CookieService } from 'ngx-cookie-service';
import { isPlatformBrowser } from '@angular/common';
import { NavbarNotLoggedUser } from "../../components/navbar-not-logged-user/navbar-not-logged-user";

@Component({
  selector: 'app-home',
  imports: [RouterLink, NavbarNotLoggedUser],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  private authService = inject(Auth);
  private cookie = inject(CookieService);

  
}
