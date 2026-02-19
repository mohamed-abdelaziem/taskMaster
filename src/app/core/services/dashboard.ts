import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  
private http = inject(HttpClient);




getDashboardDetails(userId:number){
return this.http.get(`${environment.baseUrl}/dashboard?userId=${userId}`);
}



}
