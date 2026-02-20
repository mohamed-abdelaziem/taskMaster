import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  
private http = inject(HttpClient);



// https://api.freeprojectapi.com/api/GoalTracker/recent-activity?userId=8342
getDashboardDetails(userId:number){
return this.http.get(`${environment.baseUrl}/dashboard?userId=${userId}`);
}


getRecentActivity(userId:number):Observable<any>{
return this.http.get<any>(`${environment.baseUrl}/recent-activity?userId=${userId}`);
}


}
