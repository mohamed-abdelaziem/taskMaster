import { Component, inject, PLATFORM_ID, signal } from '@angular/core';
import {FormsModule} from "@angular/forms"
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { isPlatformBrowser } from '@angular/common';
import { NavbarNotLoggedUser } from "../../components/navbar-not-logged-user/navbar-not-logged-user";
@Component({
  selector: 'app-login',
  imports: [FormsModule, NavbarNotLoggedUser],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
private authService = inject(Auth);
private router = inject(Router);
private cookie = inject(CookieService);
private toast = inject(ToastrService);
isLoading = signal<boolean>(false);
private platformId = inject(PLATFORM_ID);
loginForm = {
emailId : "",
password : ""
}

onSubmit(){
this.isLoading.set(true);
this.authService.onLogin(this.loginForm).subscribe({
next : (res)=>{
this.toast.success('Login Success');
this.router.navigateByUrl('/dashboard');
this.authService.isLogged.set(true);
this.authService.userData.set(res);
this.cookie.set('userData',JSON.stringify(res));
this.authService.userId.set(res?.userId);
this.isLoading.set(false);
},
error : (err)=>{
this.toast.error(err.error);
this.isLoading.set(false);
}
})


}



}
