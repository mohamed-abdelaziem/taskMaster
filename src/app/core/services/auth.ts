import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

interface IResponseOfLogin{
userId: number,
emailId: string,
password: string,
createdDate: string,
projectName: string,
fullName: string,
mobileNo: string,
extraId: 0
}


@Injectable({
  providedIn: 'root',
})
export class Auth {
private http = inject(HttpClient);
isLogged = signal<boolean>(false);
userData = signal<any>(null);
cookie = inject(CookieService);
userId = signal<number>(0);
constructor(){
if(!!this.cookie.get('userData')){
this.userId.set(JSON.parse(this.cookie.get('userData')).userId);
console.log(this.userId());
}


}

onLogin(data:{emailId:string,password:string}):Observable<IResponseOfLogin>{
return this.http.post<IResponseOfLogin>(`${environment.baseUrl}/login` , data);
}

onRegister(data:any){
return this.http.post(`https://api.freeprojectapi.com/api/GoalTracker/register` , data);
}

}
