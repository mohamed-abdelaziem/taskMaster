import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../services/auth';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NavbarNotLoggedUser } from "../../components/navbar-not-logged-user/navbar-not-logged-user";

@Component({
selector: 'app-register',
imports: [FormsModule, ReactiveFormsModule, NavbarNotLoggedUser],
templateUrl: './register.html',
styleUrl: './register.css',
})
export class Register {
private authService = inject(Auth);
private cookie = inject(CookieService);
private toast = inject(ToastrService);
isLoading = signal<boolean>(false);
private router = inject(Router);
registerForm = new FormGroup({
emailId : new FormControl('' , [Validators.email,Validators.required]),
password : new FormControl('',[Validators.minLength(3),Validators.required]),
mobileNo : new FormControl('anyThing'),
fullName:new FormControl('',[Validators.minLength(3),Validators.required]),
userId : new FormControl(0)
})

onRegister(){
this.isLoading.set(true);
console.log(this.registerForm.value);
this.authService.onRegister(this.registerForm.value).subscribe({
next:(res)=>{
this.toast.success('Register Successfully');
this.isLoading.set(false);
this.router.navigateByUrl('/home/login');
},
error:(err)=>{
this.toast.error('Please Try Again');
this.isLoading.set(false);
console.log(err);
}
})
}


}
